import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { VaultItemModel } from "@/models/VaultItem"
import mongoose from "mongoose"

/* ================= POST (CREATE / UPDATE) ================= */

export async function POST(req: Request) {
  try {
    const email = req.headers.get("email")
    if (!email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    await connectDB()

    /* ===== UPDATE ===== */
    if (body._id) {
      const updated = await VaultItemModel.findOneAndUpdate(
        { _id: body._id, userEmail: email },
        {
          title: body.title,
          username: body.username,
          password: body.password,
          url: body.url,
          notes: body.notes,
        },
        { new: true }
      )

      return NextResponse.json(updated)
    }

    /* ===== CREATE ===== */
    const created = await VaultItemModel.create({
      title: body.title,
      username: body.username,
      password: body.password,
      url: body.url,
      notes: body.notes,
      userEmail: email,
      createdAt: Date.now(),
    })

    return NextResponse.json(created)
  } catch (err) {
    console.error("Vault POST error:", err)
    return NextResponse.json(
      { message: "Failed to save entry" },
      { status: 500 }
    )
  }
}

/* ================= GET ================= */

export async function GET(req: Request) {
  const email = req.headers.get("email")
  if (!email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  await connectDB()

  const items = await VaultItemModel
    .find({ userEmail: email })
    .sort({ createdAt: -1 })
    .lean()

  console.log("Fetched items:", items.length)

  return NextResponse.json(items)
}


/* ================= DELETE ================= */

export async function DELETE(req: Request) {
  try {
    const email = req.headers.get("email")
    if (!email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = await req.json()

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid ID" },
        { status: 400 }
      )
    }

    await connectDB()

    const deleted = await VaultItemModel.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(id), // ✅ FIX
      userEmail: email,
    })

    if (!deleted) {
      return NextResponse.json(
        { message: "Entry not found for this user" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Vault DELETE error:", err)
    return NextResponse.json(
      { message: "Failed to delete entry" },
      { status: 500 }
    )
  }
}