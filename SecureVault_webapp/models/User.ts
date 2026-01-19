import "server-only"

import mongoose, { Schema, model, models } from "mongoose"

export interface User {
  email: string
  passwordHash: string
  createdAt: number
}

const UserSchema = new Schema<User>({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Number, default: Date.now },
})

export const UserModel =
  models.User || model<User>("User", UserSchema)
