import { NextResponse } from "next/server"
import { authenticateUser } from "@/lib/auth-server"
import { setSession } from "@/lib/auth-server"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    const valid = await authenticateUser(email, password)

    if (!valid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      )
    }


     await setSession(email)

    return NextResponse.json(
      { message: "Login successful" },
      { status: 200 }
    )
  } catch {
    return NextResponse.json(
      { message: "Login failed" },
      { status: 500 }
    )
  }
}
