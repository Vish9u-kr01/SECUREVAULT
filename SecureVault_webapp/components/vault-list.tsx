"use client"

import { useState } from "react"
import {
  Copy,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Search,
  CheckCircle,
} from "lucide-react"
import VaultItemModal from "./vault-item-modal"

/* ================= TYPES ================= */

export interface VaultItem {
  _id: string
  title: string
  username: string
  password: string
  url?: string
  notes?: string
  createdAt: number
}

interface VaultListProps {
  items: VaultItem[]
  email: string
  onItemDeleted: () => void
  onItemSaved: () => void
}

/* ================= COMPONENT ================= */

export default function VaultList({
  items,
  email,
  onItemDeleted,
  onItemSaved,
}: VaultListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({})
  const [copied, setCopied] = useState<Record<string, boolean>>({})
  const [editingItem, setEditingItem] = useState<VaultItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  /* ================= FILTER ================= */

  const filteredItems = items.filter((item) => {
    const search = searchTerm.toLowerCase()
    return (
      item.title.toLowerCase().includes(search) ||
      item.username.toLowerCase().includes(search) ||
      (item.url || "").toLowerCase().includes(search)
    )
  })

  /* ================= CLIPBOARD ================= */

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied((prev) => ({ ...prev, [key]: true }))
      setTimeout(() => {
        setCopied((prev) => ({ ...prev, [key]: false }))
      }, 2000)
    } catch {
      alert("Copy failed")
    }
  }

  /* ================= DELETE ================= */

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return

    try {
      const res = await fetch("/api/vault", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          email,
        },
        body: JSON.stringify({ id }),
      })

      if (!res.ok) throw new Error("Delete failed")

      onItemDeleted()
    } catch (err) {
      console.error(err)
      alert("Failed to delete entry")
    }
  }

  /* ================= RENDER ================= */

  return (
    <div className="w-full space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search vault entries..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border"
        />
      </div>

      {/* Add New */}
      <button
        className="gradient-button cursor-pointer"
        onClick={() => {
          setEditingItem(null)
          setShowPasswords({})
          setIsModalOpen(true)
        }}
      >
        + Add New Entry
      </button>

      {/* Vault Items */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {items.length === 0 ? "No vault entries yet" : "No results found"}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className="border rounded-xl p-4 bg-card"
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {item.username}
                  </p>
                </div>

                <div className="flex gap-1">
                  <button
                    className="cursor-pointer"
                    onClick={() =>
                      setShowPasswords((p) => ({
                        ...p,
                        [item._id]: !p[item._id],
                      }))
                    }
                  >
                    {showPasswords[item._id] ? <EyeOff /> : <Eye />}
                  </button>

                  <button
                    className="cursor-pointer"
                    onClick={() =>
                      copyToClipboard(item.password, `pwd-${item._id}`)
                    }
                  >
                    {copied[`pwd-${item._id}`] ? (
                      <CheckCircle className="text-green-500" />
                    ) : (
                      <Copy />
                    )}
                  </button>

                  <button
                    className="cursor-pointer"
                    onClick={() => {
                      setEditingItem(item)
                      setShowPasswords({})
                      setIsModalOpen(true)
                    }}
                  >
                    <Edit2 />
                  </button>

                  <button
                    className="cursor-pointer"
                    onClick={() => handleDelete(item._id)}
                  >
                    <Trash2 className="text-destructive" />
                  </button>
                </div>
              </div>

              {/* Password */}
              {showPasswords[item._id] ? (
                <code className="block mt-3 text-xs bg-muted p-2 rounded">
                  {item.password}
                </code>
              ) : (
                <p className="text-xs mt-3 text-muted-foreground">
                  ••••••••
                </p>
              )}

              {/* Notes */}
              {item.notes && (
                <p className="text-sm mt-2 text-muted-foreground">
                  {item.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <VaultItemModal
          key={editingItem?._id || "new"}   // ✅ FIX-3
          item={editingItem}
          email={email}
          onItemDeleted={() => {
            setIsModalOpen(false)
            onItemDeleted()
          }}
          onItemSaved={async () => {
    await onItemSaved() // 🔥 REFRESH FIRST
    setIsModalOpen(false)
          }}
        />
      )}
    </div>
  )
}
