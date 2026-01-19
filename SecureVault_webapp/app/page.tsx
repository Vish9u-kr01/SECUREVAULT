import { getSession } from "@/lib/auth-server"
import { redirect } from "next/navigation"
import AuthForm from "@/components/auth-form"
import { Lock } from "lucide-react"

export default async function Home() {
  const session = await getSession()

  // If already logged in → go to vault
  if (session) {
    redirect("/vault")
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-background via-blue-50 to-purple-50 dark:via-slate-900 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-linear-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg">
              <Lock size={32} className="text-primary-foreground" />
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Secure Password Vault
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Keep your passwords safe and organized.
          </p>
        </div>

        {/* Auth Form */}
        <div className="flex justify-center">
          <AuthForm />
        </div>
      </div>
    </main>
  )
}
