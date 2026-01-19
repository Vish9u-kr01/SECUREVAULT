import mongoose, { Schema, model, models } from "mongoose"

const VaultItemSchema = new Schema(
  {
    userEmail: {
      type: String,
      required: true,
      index: true,
    },
    title: String,
    username: String,
    password: String,
    url: String,
    notes: String,
  },
  { timestamps: true }
)

export const VaultItemModel =
  models.VaultItem || model("VaultItem", VaultItemSchema)
