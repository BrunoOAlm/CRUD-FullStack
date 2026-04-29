"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {jwtDecode} from "jwt-decode"

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token) {
      router.push("/")
      return
    }

    try {
      const decoded: any = jwtDecode(token)
      setUser(decoded)
    } catch {
      localStorage.removeItem("token")
      router.push("/")
    }
  }, [])

  const logout = () => {
    localStorage.removeItem("token")
    router.push("/")
  }

  if (!user) {
    return <div className="text-white p-10">Carregando...</div>
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

      <div className="bg-slate-900 p-6 rounded-xl">
        <p>Email: {user.sub}</p>
        <p>Status: Logado ✅</p>
      </div>

      <button
        onClick={logout}
        className="mt-6 px-4 py-2 bg-red-600 rounded"
      >
        Sair
      </button>
    </div>
  )
}