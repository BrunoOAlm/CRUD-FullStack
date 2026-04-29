"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Lock, Mail, Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react"
import AnimatedBackground from "@/components/animated-background"

const API = process.env.NEXT_PUBLIC_API_URL

export default function Page() {
  const router = useRouter()

  const [show, setShow] = useState(false)

  const [gta, setGta] = useState<{
    type: "success" | "error"
    action: "login" | "register"
  } | null>(null)

  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")

  const [showSignup, setShowSignup] = useState(false)
  const [signupEmail, setSignupEmail] = useState("")
  const [signupSenha, setSignupSenha] = useState("")

  // 🔐 LOGIN (CORRIGIDO)
  const handleLogin = async () => {
    try {
      const response = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) throw new Error()

      localStorage.setItem("token", data.token)

      setGta({ type: "success", action: "login" })

      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2

      for (let i = 0; i < 4; i++) {
        setTimeout(() => {
          window.dispatchEvent(
            new CustomEvent("confetti", {
              detail: { x: cx + (Math.random() - 0.5) * 200, y: cy },
            })
          )
        }, i * 150)
      }

      setTimeout(() => {
        router.push("/dashboard")
      }, 1200)

    } catch {
      setGta({ type: "error", action: "login" })
    }

    setTimeout(() => setGta(null), 2200)
  }

  // 🆕 REGISTER (CORRIGIDO)
  const handleRegister = async () => {
    try {
      const response = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: signupEmail,
          senha: signupSenha,
        }),
      })

      if (!response.ok) throw new Error()

      setShowSignup(false)
      setGta({ type: "success", action: "register" })

    } catch {
      setGta({ type: "error", action: "register" })
    }

    setTimeout(() => setGta(null), 2200)
  }

  return (
    <>
      <AnimatedBackground />

      <div className="relative min-h-screen flex items-center justify-center text-white">
        <div className="w-[360px]">

          <div className="rounded-3xl border border-white/15 bg-[#0a0418]/80 p-6">

            <h1 className="text-center text-xl font-semibold mb-4">
              Bem-vindo de volta
            </h1>

            <div className="relative mb-3">
              <Mail className="absolute left-3 top-3 text-white/40 size-4" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full pl-9 p-3 rounded-xl bg-black/40"
              />
            </div>

            <div className="relative mb-3">
              <Lock className="absolute left-3 top-3 text-white/40 size-4" />
              <input
                type={show ? "text" : "password"}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Senha"
                className="w-full pl-9 pr-9 p-3 rounded-xl bg-black/40"
              />
              <button
                onClick={() => setShow(!show)}
                className="absolute right-3 top-3 text-white/50"
              >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button
              onClick={handleLogin}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-cyan-400 flex items-center justify-center gap-2"
            >
              <Sparkles size={16} />
              Entrar
              <ArrowRight size={16} />
            </button>

            <p className="mt-4 text-center text-sm text-white/50">
              Não tem conta?{" "}
              <span
                onClick={() => setShowSignup(true)}
                className="text-fuchsia-400 cursor-pointer"
              >
                Criar conta
              </span>
            </p>

          </div>
        </div>
      </div>

      {gta && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <h1 className={`text-4xl font-bold ${
            gta.type === "success" ? "text-green-400" : "text-red-400"
          }`}>
            {gta.action === "login"
              ? gta.type === "success"
                ? "LOGIN SUCCESS"
                : "LOGIN FAILED"
              : gta.type === "success"
                ? "REGISTER SUCCESS"
                : "REGISTER FAILED"}
          </h1>
        </div>
      )}

      {showSignup && (
        <div
          className="fixed inset-0 grid place-items-center bg-black/70"
          onClick={() => setShowSignup(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0a0418] p-6 rounded-xl w-[320px]"
          >
            <h2 className="text-lg mb-3">Criar conta</h2>

            <input
              placeholder="Email"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              className="w-full mb-2 p-2 rounded bg-black/40"
            />

            <input
              placeholder="Senha"
              type="password"
              value={signupSenha}
              onChange={(e) => setSignupSenha(e.target.value)}
              className="w-full mb-3 p-2 rounded bg-black/40"
            />

            <button
              onClick={handleRegister}
              className="w-full p-2 bg-fuchsia-600 rounded"
            >
              Cadastrar
            </button>

          </div>
        </div>
      )}
    </>
  )
}