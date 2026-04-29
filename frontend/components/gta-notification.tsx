"use client"

import { useEffect, useState } from "react"

interface GTANotificationProps {
  type: "success" | "error"
  message: string
  onComplete?: () => void
}

export function GTANotification({ type, message, onComplete }: GTANotificationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 50)

    // Start exit animation after 2.5 seconds
    const exitTimer = setTimeout(() => {
      setIsExiting(true)
    }, 2500)

    // Call onComplete after exit animation
    const completeTimer = setTimeout(() => {
      onComplete?.()
    }, 3000)

    return () => {
      clearTimeout(exitTimer)
      clearTimeout(completeTimer)
    }
  }, [onComplete])

  const isSuccess = type === "success"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Dark overlay */}
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${
          isVisible && !isExiting ? "opacity-100" : "opacity-0"
        }`}
      />
      
      {/* Main notification container */}
      <div
        className={`relative flex flex-col items-center gap-4 transition-all duration-500 ${
          isVisible && !isExiting 
            ? "opacity-100 scale-100 translate-y-0" 
            : "opacity-0 scale-75 translate-y-8"
        }`}
      >
        {/* Glow effect behind text */}
        <div 
          className={`absolute inset-0 blur-3xl opacity-50 ${
            isSuccess ? "bg-green-500" : "bg-red-500"
          }`}
          style={{ transform: "scale(2)" }}
        />

        {/* Icon */}
        <div
          className={`relative w-24 h-24 rounded-full flex items-center justify-center border-4 ${
            isSuccess 
              ? "bg-green-500/20 border-green-400" 
              : "bg-red-500/20 border-red-400"
          } ${isVisible && !isExiting ? "animate-pulse" : ""}`}
        >
          {isSuccess ? (
            <svg className="w-14 h-14 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-14 h-14 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>

        {/* Main text - GTA style */}
        <h1
          className={`relative text-5xl md:text-7xl font-black uppercase tracking-wider text-center ${
            isSuccess ? "text-green-400" : "text-red-400"
          }`}
          style={{
            textShadow: isSuccess
              ? "0 0 20px rgba(74, 222, 128, 0.8), 0 0 40px rgba(74, 222, 128, 0.6), 0 0 60px rgba(74, 222, 128, 0.4)"
              : "0 0 20px rgba(248, 113, 113, 0.8), 0 0 40px rgba(248, 113, 113, 0.6), 0 0 60px rgba(248, 113, 113, 0.4)",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          {message}
        </h1>

        {/* Subtitle */}
        <p className={`relative text-xl md:text-2xl font-medium uppercase tracking-widest ${
          isSuccess ? "text-green-300/80" : "text-red-300/80"
        }`}>
          {isSuccess ? "Redirecionando..." : "Tente novamente"}
        </p>

        {/* Animated line */}
        <div className="relative w-64 h-1 mt-2 overflow-hidden rounded-full bg-white/10">
          <div 
            className={`h-full rounded-full ${
              isSuccess ? "bg-green-400" : "bg-red-400"
            } ${isVisible && !isExiting ? "animate-progress" : ""}`}
            style={{
              animation: isVisible && !isExiting ? "progress 2.5s ease-out forwards" : "none",
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}
