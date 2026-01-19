import "server-only"
import bcrypt from "bcryptjs"
import { connectDB } from "./db"
import { UserModel } from "@/models/User"
import { cookies } from "next/headers"

const SESSION_KEY = "securevault_session"

/* ================= SESSION ================= */

export async function setSession(email: string) {
  const cookieStore = await cookies()

  cookieStore.set(SESSION_KEY, email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  })
}

export async function getSession(): Promise<string | null> {
  const cookieStore = await cookies()
  const session = cookieStore.get(SESSION_KEY)
  return session?.value ?? null
}

export async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_KEY)
}

/* ================= AUTH ================= */

export async function registerUser(email: string, password: string) {
  await connectDB()

  const exists = await UserModel.findOne({ email })
  if (exists) throw new Error("User already exists")

  const passwordHash = await bcrypt.hash(password, 10)

  await UserModel.create({ email, passwordHash })
  return true
}

export async function authenticateUser(email: string, password: string) {
  await connectDB()

  const user = await UserModel.findOne({ email })
  if (!user) return false

  return bcrypt.compare(password, user.passwordHash)
}
