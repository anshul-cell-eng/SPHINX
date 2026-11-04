import { getDatabaseStatus } from "./database.js";
import { memoryStore } from "./memory-store.js";
import {
  UserModel,
  ClientModel,
  ProjectModel,
  TaskModel,
  ProposalModel,
  ContractModel,
  InvoiceModel,
  PaymentModel,
  TimeEntryModel,
} from "../models/schemas.js";

type EntityType =
  | "user"
  | "client"
  | "project"
  | "task"
  | "proposal"
  | "contract"
  | "invoice"
  | "payment"
  | "timeEntry";

function getModel(type: EntityType) {
  switch (type) {
    case "user":
      return UserModel;
    case "client":
      return ClientModel;
    case "project":
      return ProjectModel;
    case "task":
      return TaskModel;
    case "proposal":
      return ProposalModel;
    case "contract":
      return ContractModel;
    case "invoice":
      return InvoiceModel;
    case "payment":
      return PaymentModel;
    case "timeEntry":
      return TimeEntryModel;
  }
}

/**
 * Initializes synchronization between MongoDB Atlas and the application store.
 * If the MongoDB database is empty, it seeds initial records.
 * If data exists in MongoDB, it hydrates the active store from MongoDB.
 */
export async function initDatabaseSync(): Promise<void> {
  const status = getDatabaseStatus();
  if (status.mode !== "MONGODB_LIVE") {
    console.log("ℹ️ Persistence layer operating in In-Memory Standby mode.");
    return;
  }

  try {
    const userCount = await UserModel.countDocuments();

    if (userCount === 0) {
      console.log("🌱 Fresh MongoDB Atlas instance detected. Seeding baseline records...");

      await Promise.all([
        UserModel.insertMany(memoryStore.users),
        ClientModel.insertMany(memoryStore.clients),
        ProjectModel.insertMany(memoryStore.projects),
        TaskModel.insertMany(memoryStore.tasks),
        ProposalModel.insertMany(memoryStore.proposals),
        ContractModel.insertMany(memoryStore.contracts),
        InvoiceModel.insertMany(memoryStore.invoices),
        PaymentModel.insertMany(memoryStore.payments),
        TimeEntryModel.insertMany(memoryStore.timeEntries),
      ]);

      console.log("✅ Seed complete: Users, clients, projects, contracts, and invoices persisted to MongoDB.");
    } else {
      console.log("📥 Hydrating application data from MongoDB Atlas collections...");

      const [users, clients, projects, tasks, proposals, contracts, invoices, payments, timeEntries] =
        await Promise.all([
          UserModel.find().lean(),
          ClientModel.find().lean(),
          ProjectModel.find().lean(),
          TaskModel.find().lean(),
          ProposalModel.find().lean(),
          ContractModel.find().lean(),
          InvoiceModel.find().lean(),
          PaymentModel.find().lean(),
          TimeEntryModel.find().lean(),
        ]);

      memoryStore.users = users as any;
      memoryStore.clients = clients as any;
      memoryStore.projects = projects as any;
      memoryStore.tasks = tasks as any;
      memoryStore.proposals = proposals as any;
      memoryStore.contracts = contracts as any;
      memoryStore.invoices = invoices as any;
      memoryStore.payments = payments as any;
      memoryStore.timeEntries = timeEntries as any;

      // Safe, idempotent check for essential demo sandbox accounts
      const baselineUsers = [
        {
          id: "usr-freelancer-1",
          email: "alex@freelanceos.dev",
          passwordHash: "$2a$10$o8.jQ1.8/f/B2R0yO7r4yecVf.4N7bQcZ2gqXf7Ww3hD1nUe6r2gG",
          name: "Alex Morgan",
          role: "FREELANCER",
          company: "Apex Design Systems",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
          hourlyRate: 4500,
          taxId: "27AADCA1234F1Z8",
          upiId: "alex.apex@okhdfcbank",
          workspaceId: "ws-alex",
          createdAt: "2026-08-01",
        },
        {
          id: "usr-freelancer-alias",
          email: "alex@freelanceos.studio",
          passwordHash: "$2a$10$o8.jQ1.8/f/B2R0yO7r4yecVf.4N7bQcZ2gqXf7Ww3hD1nUe6r2gG",
          name: "Alex Morgan",
          role: "FREELANCER",
          company: "Apex Design Systems",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
          hourlyRate: 4500,
          taxId: "27AADCA1234F1Z8",
          upiId: "alex.apex@okhdfcbank",
          workspaceId: "ws-alex",
          createdAt: "2026-08-01",
        },
        {
          id: "usr-client-1",
          email: "sarah@zenithfintech.com",
          passwordHash: "$2a$10$o8.jQ1.8/f/B2R0yO7r4yecVf.4N7bQcZ2gqXf7Ww3hD1nUe6r2gG",
          name: "Sarah Chen",
          role: "CLIENT",
          company: "Zenith FinTech",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
          hourlyRate: 0,
          taxId: "GSTIN27AABCT1234",
          upiId: "sarah.zenith@icici",
          workspaceId: "ws-alex",
          createdAt: "2026-08-15",
        },
        {
          id: "usr-client-alias",
          email: "sarah@novastudios.design",
          passwordHash: "$2a$10$o8.jQ1.8/f/B2R0yO7r4yecVf.4N7bQcZ2gqXf7Ww3hD1nUe6r2gG",
          name: "Sarah Chen",
          role: "CLIENT",
          company: "Nova Studios Inc",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
          hourlyRate: 0,
          taxId: "GSTIN27AABCT1234",
          upiId: "sarah.nova@icici",
          workspaceId: "ws-alex",
          createdAt: "2026-08-15",
        },
      ];

      for (const bUser of baselineUsers) {
        const found = memoryStore.users.find((u) => u.email.toLowerCase() === bUser.email.toLowerCase());
        if (!found) {
          const dbExists = await UserModel.findOne({ email: bUser.email.toLowerCase() });
          if (!dbExists) {
            await UserModel.create(bUser);
            console.log(`🌱 Idempotently seeded sandbox user: ${bUser.email}`);
          }
          memoryStore.users.push(bUser as any);
        }
      }

      console.log(`✅ Loaded ${memoryStore.users.length} users, ${clients.length} clients, ${projects.length} projects, ${invoices.length} invoices from MongoDB.`);
    }
  } catch (error) {
    console.error("⚠️ Error synchronizing with MongoDB:", error);
  }
}

/**
 * Asynchronously persists a created or updated entity to MongoDB if connected.
 */
export async function persistEntity(type: EntityType, record: { id: string; [key: string]: any }): Promise<void> {
  const status = getDatabaseStatus();
  if (status.mode !== "MONGODB_LIVE") return;

  try {
    const model = getModel(type);
    await model.findOneAndUpdate({ id: record.id }, record, { upsert: true, new: true });
  } catch (err) {
    console.error(`⚠️ Failed to persist ${type} [${record.id}] to MongoDB:`, err);
  }
}

/**
 * Asynchronously removes an entity from MongoDB if connected.
 */
export async function removeEntity(type: EntityType, id: string): Promise<void> {
  const status = getDatabaseStatus();
  if (status.mode !== "MONGODB_LIVE") return;

  try {
    const model = getModel(type);
    await model.deleteOne({ id });
  } catch (err) {
    console.error(`⚠️ Failed to delete ${type} [${id}] from MongoDB:`, err);
  }
}
