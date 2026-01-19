"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import VaultList from "./vault-list"
import PasswordGenerator from "./password-generator"
import { Moon, Sun, LogOut, Lock, X, Search } from "lucide-react"
import { logoutUser } from "@/lib/auth-client"

export default function VaultClient({ email }: { email: string }) {
  const router = useRouter()

  const [items, setItems] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [showGenerator, setShowGenerator] = useState(false)
  const [isDark, setIsDark] = useState(false)

  /* ========== DARK MODE INIT ========== */
  useEffect(() => {
    const stored = localStorage.getItem("vault_dark_mode") === "true"
    setIsDark(stored)
    document.documentElement.classList.toggle("dark", stored)
  }, [])

  const toggleDarkMode = () => {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle("dark", next)
    localStorage.setItem("vault_dark_mode", String(next))
  }

  /* ========== FETCH VAULT ITEMS ========== */
  const fetchItems = async () => {
    const res = await fetch("/api/vault", {
      headers: { email },
        cache: "no-store",
    })
    if (!res.ok) return
     const data = await res.json()
  setItems(data)
  }

  useEffect(() => {
    fetchItems()
  }, [])

  /* ========== LOGOUT ========== */
  const handleLogout = async () => {
    await logoutUser()
    router.push("/")
  }

  /* ========== SEARCH FILTER ========== */
  const filteredItems = items.filter((item) =>
    [item.title, item.username, item.url]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  return (
    <main className="min-h-screen p-4">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Lock />
          <span>{email}</span>
        </div>

        <div className="flex gap-2">
          <button onClick={toggleDarkMode} className="cursor-pointer">
            {isDark ? <Sun /> : <Moon />}
          </button>

          <button onClick={handleLogout} className="cursor-pointer">
            <LogOut />
          </button>
        </div>
      </div>

      {/* SEARCH BAR */}
      {/* <div className="relative mb-4">
        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
        <input
          placeholder="Search vault..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-lg border bg-input"
        />
      </div>  */}

      {/* ACTION BUTTON */}
      <button
        onClick={() => setShowGenerator(true)}
        className="gradient-button mb-6 cursor-pointer"
      >
        Generate Password
      </button>

      {/* VAULT ITEMS LIST */}
      <VaultList
        items={filteredItems}
        email={email}
        onItemDeleted={fetchItems}
        onItemSaved={fetchItems}
      />

      {/* PASSWORD GENERATOR MODAL */}
      {showGenerator && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-xl w-full max-w-md">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">Password Generator</h2>
              <button
                onClick={() => setShowGenerator(false)}
                className="cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <PasswordGenerator />
          </div>
        </div>
      )}
    </main>
  )
}
