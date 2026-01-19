import "server-only"

import mongoose from "mongoose"

const MONGODB_URI = "mongodb+srv://vish9u1424:17147714Vi%40@cluster01.1gbi4fl.mongodb.net/VAULTLOCK-DATA?retryWrites=true&w=majority" // paste your MongoDB string here or in .env

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI")
}

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) return

  return mongoose.connect(MONGODB_URI)
}
