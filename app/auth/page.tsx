"use client"

import { useState } from "react"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-zinc-900 p-8 rounded-xl w-96 space-y-6">

        <div className="flex justify-center gap-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`pb-2 ${
              isLogin ? "border-b-2 border-purple-500" : "text-gray-400"
            }`}
          >
            Login
          </button>

          <button
            onClick={() => setIsLogin(false)}
            className={`pb-2 ${
              !isLogin ? "border-b-2 border-purple-500" : "text-gray-400"
            }`}
          >
            Signup
          </button>
        </div>

        {isLogin ? (
          <div>Login Form Here</div>
        ) : (
          <div>Signup Form Here</div>
        )}

      </div>
    </div>
  )
}