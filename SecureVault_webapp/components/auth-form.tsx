"use client"

import { useState } from "react"
import { Mail, Lock, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import { loginUser } from "@/lib/auth-client"

type AuthMode = "signin" | "signup"

export default function AuthForm() {
  const router = useRouter()

  const [mode, setMode] = useState<AuthMode>("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch(
        mode === "signup" ? "/api/auth/register" : "/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || "Authentication failed")
        return
      }

      router.push("/vault")
    } catch (err) {
      console.error(err)
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md space-y-6">

      {/* ================= SecureVault Description Card ================= */}
      <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-background
                      border border-border rounded-2xl p-6 shadow-xl backdrop-blur">

        <h2 className="text-2xl font-bold mb-2 text-center">
          🔐 SecureVault
        </h2>

        <p className="text-muted-foreground text-sm text-center mb-4">
          Your personal, encrypted password manager
        </p>

        <ul className="space-y-3 text-sm">
          <li className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-primary mt-0.5" />
            <span>
              Securely store and manage your credentials in a private vault.
            </span>
          </li>

          <li className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-primary mt-0.5" />
            <span>
              User-specific vault isolation with protected access.
            </span>
          </li>

          <li className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-primary mt-0.5" />
            <span>
              Access your vault anywhere using your verified email.
            </span>
          </li>
        </ul>

        <p className="text-xs text-muted-foreground mt-4 text-center">
          Built with Next.js, MongoDB & modern security practices
        </p>
      </div>

      {/* ================= Auth Card ================= */}
      <div className="bg-card rounded-2xl p-8 border border-border shadow-2xl">

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-2">
          {mode === "signin" ? "Sign in" : "Create account"}
        </h1>

        <p className="text-center text-muted-foreground mb-6">
          Access your secure vault
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <div>
            <label className="text-sm font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg bg-input"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg bg-input"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-destructive text-sm font-medium">{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full gradient-button mt-4"
          >
            {loading
              ? "Please wait..."
              : mode === "signin"
              ? "Sign in"
              : "Sign up"}
          </button>
        </form>

        {/* Toggle */}
        <p className="text-center text-sm mt-6">
          {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin")
              setError("")
              setPassword("")
            }}
            className="text-primary font-semibold hover:underline"
          >
            {mode === "signin" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  )
}
