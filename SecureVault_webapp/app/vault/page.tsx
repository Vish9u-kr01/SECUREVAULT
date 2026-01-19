import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth-server"
import VaultClient from "@/components/vault-client"




export default async function VaultPage() {
  const email = await getSession()

  if (!email) {
    redirect("/")
  }

  return <VaultClient email={email} />
}
