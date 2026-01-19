


export async function loginUser(email: string, password: string) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.message || "Login failed")
  }

  return res.json()
}


 
export async function logoutUser() {
  const res = await fetch("/api/auth/logout", {
    method: "POST",
  })

  if (!res.ok) {
    throw new Error("Logout failed")
  }
}
