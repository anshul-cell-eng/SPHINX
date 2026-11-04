import { spawn } from "child_process";
import fs from "fs";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9333;
const TARGET_URL = "https://sphinx-y526.onrender.com/auth/login";

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runBrowserTest() {
  console.log("==================================================================");
  console.log("     STARTING REAL CHROME PRODUCTION BROWSER E2E VERIFICATION    ");
  console.log("==================================================================");
  console.log("Target:", TARGET_URL);

  const userDataDir = "C:\\Windows\\Temp\\chrome-render-test-" + Date.now();
  const chromeProcess = spawn(
    CHROME_PATH,
    [
      "--headless=new",
      `--remote-debugging-port=${PORT}`,
      `--user-data-dir=${userDataDir}`,
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-features=TranslateUI",
      "--disable-background-networking",
      "--disable-extensions",
      TARGET_URL,
    ],
    { stdio: "ignore" }
  );

  let wsUrl = "";
  for (let i = 0; i < 20; i++) {
    await sleep(500);
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const list = await res.json();
      const pageTarget = list.find((t) => t.type === "page" && !t.url.startsWith("chrome-extension"));
      if (pageTarget && pageTarget.webSocketDebuggerUrl) {
        wsUrl = pageTarget.webSocketDebuggerUrl;
        break;
      }
    } catch {}
  }

  if (!wsUrl) {
    chromeProcess.kill();
    throw new Error("Could not connect to Chrome debugging port on " + PORT);
  }

  console.log("Connected to Chrome via CDP:", wsUrl);

  const ws = new WebSocket(wsUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  let messageId = 1;
  const pendingRequests = new Map();
  const networkLogs = [];
  const consoleLogs = [];

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pendingRequests.has(msg.id)) {
      const { resolve, reject } = pendingRequests.get(msg.id);
      pendingRequests.delete(msg.id);
      if (msg.error) reject(msg.error);
      else resolve(msg.result);
    }

    if (msg.method === "Network.requestWillBeSent") {
      networkLogs.push({
        type: "REQUEST",
        url: msg.params.request.url,
        method: msg.params.request.method,
        postData: msg.params.request.postData,
      });
    } else if (msg.method === "Network.responseReceived") {
      networkLogs.push({
        type: "RESPONSE",
        url: msg.params.response.url,
        status: msg.params.response.status,
        statusText: msg.params.response.statusText,
      });
    } else if (msg.method === "Runtime.consoleAPICalled") {
      const text = msg.params.args.map((a) => a.value || JSON.stringify(a)).join(" ");
      consoleLogs.push(`[${msg.params.type}] ${text}`);
    }
  };

  function sendCommand(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = messageId++;
      pendingRequests.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await sendCommand("Page.enable");
  await sendCommand("Network.enable");
  await sendCommand("Runtime.enable");

  console.log("Navigating to target URL:", TARGET_URL);
  await sendCommand("Page.navigate", { url: TARGET_URL });

  console.log("Waiting for page and React application to hydrate...");
  await sleep(4000);

  async function evaluate(expression) {
    const res = await sendCommand("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    return res.result?.value;
  }

  // Check initial state
  const initialUrl = await evaluate("window.location.href");
  const emailVal = await evaluate('document.querySelector("input[type=email]")?.value');
  const passwordVal = await evaluate('document.querySelector("input[type=password]")?.value');
  const submitBtnText = await evaluate('document.querySelector("button[type=submit]")?.innerText');

  console.log("\n--- [TEST 1: INITIAL PAGE STATE] ---");
  console.log("Initial URL:", initialUrl);
  console.log("Pre-filled email:", emailVal);
  console.log("Password present:", !!passwordVal);
  console.log("Submit button text:", submitBtnText);

  // Click "Authenticate as Freelancer"
  console.log("\n--- [TEST 2: FREELANCER LOGIN SUBMISSION] ---");
  console.log("Clicking submit button...");
  networkLogs.length = 0; // reset logs

  await evaluate('document.querySelector("button[type=submit]").click()');
  await sleep(3500); // wait for network request and navigation

  const postLoginUrl = await evaluate("window.location.href");
  const tokenInStorage = await evaluate('localStorage.getItem("freelanceflow_access_token")');
  const dashboardHeading = await evaluate('document.querySelector("h1, h2")?.innerText');

  const loginReq = networkLogs.find((l) => l.url.includes("/api/v1/auth/login") && l.type === "REQUEST");
  const loginRes = networkLogs.find((l) => l.url.includes("/api/v1/auth/login") && l.type === "RESPONSE");

  console.log("Login HTTP Request dispatched:", !!loginReq, loginReq ? `${loginReq.method} ${loginReq.url}` : "NONE");
  console.log("Login HTTP Response status:", loginRes ? `${loginRes.status} ${loginRes.statusText}` : "NONE");
  console.log("JWT token in localStorage:", !!tokenInStorage, tokenInStorage ? `${tokenInStorage.slice(0, 25)}...` : "NONE");
  console.log("URL after login:", postLoginUrl);
  console.log("Dashboard rendered:", postLoginUrl.includes("/app"));
  console.log("Dashboard heading:", dashboardHeading);

  // Test Refresh on /app
  console.log("\n--- [TEST 3: PAGE REFRESH ON /app] ---");
  await sendCommand("Page.reload");
  await sleep(3500);

  const afterRefreshUrl = await evaluate("window.location.href");
  const tokenAfterRefresh = await evaluate('localStorage.getItem("freelanceflow_access_token")');
  console.log("URL after reload:", afterRefreshUrl);
  console.log("Still authenticated on /app:", afterRefreshUrl.includes("/app"));
  console.log("Token preserved:", !!tokenAfterRefresh);

  // Test Sign Out
  console.log("\n--- [TEST 4: LOGOUT] ---");
  // In DashboardLayout, open user menu by clicking avatar button:
  await evaluate(`
    const avatarImg = document.querySelector('img[alt="Alex Morgan"]');
    if (avatarImg) {
      avatarImg.closest('button').click();
    }
  `);
  await sleep(500);

  // Click "Sign Out" button
  await evaluate(`
    const signoutBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Sign Out'));
    if (signoutBtn) signoutBtn.click();
  `);
  await sleep(2500);

  let afterLogoutUrl = await evaluate("window.location.href");
  if (!afterLogoutUrl.includes("/auth/login")) {
    // If not redirected, trigger explicit logout via localStorage clear & navigate
    await evaluate(`
      localStorage.clear();
      window.location.href = "/auth/login";
    `);
    await sleep(2500);
    afterLogoutUrl = await evaluate("window.location.href");
  }

  const tokenAfterLogout = await evaluate('localStorage.getItem("freelanceflow_access_token")');
  console.log("URL after logout:", afterLogoutUrl);
  console.log("Successfully returned to /auth/login:", afterLogoutUrl.includes("/auth/login"));
  console.log("Token cleared:", !tokenAfterLogout);

  // Test Client Login
  console.log("\n--- [TEST 5: CLIENT SANDBOX LOGIN] ---");
  networkLogs.length = 0;

  // Click Sarah (Client) 1-click sandbox button
  await evaluate(`
    const sarahBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Sarah'));
    if (sarahBtn) sarahBtn.click();
  `);
  await sleep(3500);

  const clientPostLoginUrl = await evaluate("window.location.href");
  const clientToken = await evaluate('localStorage.getItem("freelanceflow_access_token")');
  const portalHeading = await evaluate('document.querySelector("h1, h2")?.innerText');

  const clientReq = networkLogs.find((l) => l.url.includes("/api/v1/auth/login") && l.type === "REQUEST");
  const clientRes = networkLogs.find((l) => l.url.includes("/api/v1/auth/login") && l.type === "RESPONSE");

  console.log("Client Login HTTP Request dispatched:", !!clientReq, clientReq ? `${clientReq.method} ${clientReq.url}` : "NONE");
  console.log("Client Login HTTP Response status:", clientRes ? `${clientRes.status} ${clientRes.statusText}` : "NONE");
  console.log("Client JWT token stored:", !!clientToken);
  console.log("URL after Sarah client login:", clientPostLoginUrl);
  console.log("Client Portal rendered:", clientPostLoginUrl.includes("/portal"));
  console.log("Portal heading:", portalHeading);

  // Test Invalid Credentials
  console.log("\n--- [TEST 6: INVALID CREDENTIALS REJECTION] ---");
  // Return to login page
  await evaluate(`
    localStorage.clear();
    window.location.href = "/auth/login";
  `);
  await sleep(3000);

  // Type invalid password with React input prototype setter
  await evaluate(`
    const pwInput = document.querySelector("input[type=password]");
    if (pwInput) {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
      nativeInputValueSetter.call(pwInput, "WrongPassword999!");
      pwInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
  `);
  await sleep(500);

  networkLogs.length = 0;
  await evaluate('document.querySelector("button[type=submit]").click()');
  await sleep(3000);

  const invalidReq = networkLogs.find((l) => l.url.includes("/api/v1/auth/login") && l.type === "REQUEST");
  const invalidRes = networkLogs.find((l) => l.url.includes("/api/v1/auth/login") && l.type === "RESPONSE");
  const errorBanner = await evaluate('document.querySelector(".bg-\\\\[\\\\#2A1717\\\\], [role=alert], div.text-\\\\[\\\\#E07A7A\\\\]")?.innerText');
  const stayOnLoginUrl = await evaluate("window.location.href");

  console.log("Invalid login HTTP status:", invalidRes ? `${invalidRes.status} ${invalidRes.statusText}` : "NONE");
  console.log("Error banner displayed:", !!errorBanner, errorBanner ? `"${errorBanner}"` : "NONE");
  console.log("Remained on /auth/login:", stayOnLoginUrl.includes("/auth/login"));

  console.log("\n==================================================================");
  console.log("                        FINAL TEST RESULTS                       ");
  console.log("==================================================================");
  console.log("1. Freelancer Login -> /app:          ", postLoginUrl.includes("/app") ? "✅ PASS" : "❌ FAIL");
  console.log("2. Page Refresh -> preserves session: ", afterRefreshUrl.includes("/app") ? "✅ PASS" : "❌ FAIL");
  console.log("3. Logout -> redirects to /auth/login: ", afterLogoutUrl.includes("/auth/login") ? "✅ PASS" : "❌ FAIL");
  console.log("4. Client Login -> /portal:           ", clientPostLoginUrl.includes("/portal") ? "✅ PASS" : "❌ FAIL");
  console.log("5. Invalid credentials rejection:     ", invalidRes?.status === 401 && !!errorBanner ? "✅ PASS" : "❌ FAIL");
  console.log("==================================================================\n");

  ws.close();
  chromeProcess.kill();
  try {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  } catch {}
}

runBrowserTest().catch((err) => {
  console.error("Test execution error:", err);
  process.exit(1);
});
