"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { X } from "lucide-react"
import PasswordGenerator from "./password-generator"

interface VaultItem {
  _id?: string
  title: string
  username: string
  password: string
  url?: string
  notes?: string
}

interface VaultItemModalProps {
  item: VaultItem | null
  email: string
  onItemDeleted: () => void
  onItemSaved: () => void
}

export default function VaultItemModal({
  item,
  email,
  onItemDeleted,
  onItemSaved,
}: VaultItemModalProps) {

  const [formData, setFormData] = useState({
    title: "",
    username: "",
    password: "",
    url: "",
    notes: "",
  })

  /* ✅ reset form on item change */
  useEffect(() => {
    setFormData({
      title: item?.title || "",
      username: item?.username || "",
      password: item?.password || "",
      url: item?.url || "",
      notes: item?.notes || "",
    })
  }, [item])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch("/api/vault", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          email,
        },
        body: JSON.stringify({
          ...formData,
          ...(item?._id ? { _id: item._id } : {}),
        }),
      })

      if (!res.ok) throw new Error("Failed to save")

      onItemSaved()
      onItemDeleted()
    } catch (err) {
      console.error(err)
      alert("Failed to save entry")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      
      {/* ✅ Modal container with height control */}
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col border border-border">

        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b shrink-0">
          <h2 className="text-xl font-bold">
            {item ? "Edit Entry" : "New Entry"}
          </h2>

          <button onClick={onItemDeleted} className="p-2 cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* ✅ SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              required
              placeholder="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="input"
            />

            <input
              placeholder="Username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="input"
            />

            <input
              required
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="input"
            />

            <input
              type="url"
              placeholder="URL"
              value={formData.url}
              onChange={(e) =>
                setFormData({ ...formData, url: e.target.value })
              }
              className="input"
            />

            <textarea
              placeholder="Notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="input"
            />

            <button type="submit" className="gradient-button w-full">
              {item ? "Update" : "Add"} Entry
            </button>
          </form>

          {/* ✅ Password Generator (fully visible, scroll-safe) */}
          <div className="pt-4 border-t">
            <PasswordGenerator
              onGenerate={(pwd) =>
                setFormData((prev) => ({ ...prev, password: pwd }))
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}
