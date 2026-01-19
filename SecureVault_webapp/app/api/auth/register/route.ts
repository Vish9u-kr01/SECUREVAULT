import { NextResponse } from "next/server"
import { registerUser } from "@/lib/auth-server"
import { setSession } from "@/lib/auth-server"
 
export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password required" },
        { status: 400 }
      )
    }

    await registerUser(email, password)
    await setSession(email)

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    )
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Registration failed" },
      { status: 400 }
    )
  }
}
