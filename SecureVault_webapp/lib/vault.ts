import "server-only"
import { connectDB } from "./db"
import { VaultItemModel } from "@/models/VaultItem"

/* ================= GET ================= */

export async function getVaultItems(email: string) {
  await connectDB()

  return VaultItemModel
    .find({ userEmail: email })
    .sort({ createdAt: -1 })
}

/* ================= CREATE / UPDATE ================= */

export async function saveVaultItem(
  email: string,
  item: {
    _id?: string
    title: string
    username: string
    password: string
    url?: string
    notes?: string
  }
) {
  await connectDB()

  if (item._id) {
    // UPDATE
    return VaultItemModel.findOneAndUpdate(
      { _id: item._id, userEmail: email },
      { ...item },
      { new: true }
    )
  }

  // CREATE
  return VaultItemModel.create({
    ...item,
    userEmail: email,
    createdAt: Date.now(),
  })
}

/* ================= DELETE ================= */

export async function deleteVaultItem(email: string, itemId: string) {
  await connectDB()

  return VaultItemModel.deleteOne({
    _id: itemId,
    userEmail: email,
  })
}
