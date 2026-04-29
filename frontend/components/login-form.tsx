"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Mail, Lock } from "lucide-react"
import { GTANotification } from "./gta-notification"

export function LoginForm() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    console.log("🚀 SUBMIT DISPAROU")

    setIsLoading(true)
    setNotification(null)

    try {
      console.log("📡 chamando backend")

      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          senha,
        }),
      })

      console.log("📥 voltou do backend", response.status)

      const data = await response.json().catch(() => null)

      console.log("📦 resposta:", data)

      if (!response.ok) {
        throw new Error(data?.message || "Credenciais inválidas")
      }

      // 🔐 salva token
      if (data?.token) {
        localStorage.setItem("token", data.token)
      }

      // 🔥 notificação sucesso
      setNotification({
        type: "success",
        message: "Login Bem Sucedido",
      })

      // 🚀 redirect (com leve delay pra UX da animação)
      setTimeout(() => {
        router.push("/dashboard")
      }, 1200)

    } catch (err: any) {
      console.error("❌ ERRO:", err)

      setNotification({
        type: "error",
        message: err.message || "Erro ao fazer login",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleNotificationComplete = () => {
    if (notification?.type === "error") {
      setNotification(null)
    }
  }

  return (
    <>
      {notification && (
        <GTANotification
          type={notification.type}
          message={notification.message}
          onComplete={handleNotificationComplete}
        />
      )}

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 mb-6">
            <Lock className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-3xl font-semibold text-white mb-2">
            Bem-vindo de volta
          </h1>

          <p className="text-slate-400">
            Entre com suas credenciais
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-700 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Email */}
            <div>
              <label className="text-sm text-slate-300">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-4 h-5 w-5 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-slate-800 rounded-xl text-white"
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label className="text-sm text-slate-300">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-4 h-5 w-5 text-slate-500" />
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-slate-800 rounded-xl text-white"
                />
              </div>
            </div>

            {/* Botão */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white disabled:opacity-70"
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </button>

          </form>
        </div>
      </div>
    </>
  )
}