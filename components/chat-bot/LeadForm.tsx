"use client"

import { useState } from "react"
import { Send } from "lucide-react"
import type { LeadInfo } from "@/lib/chat/chatbot-types"

type LeadFormProps = {
  onSubmit: (info: LeadInfo) => void
  disabled?: boolean
}

export const LeadForm = ({ onSubmit, disabled }: LeadFormProps) => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [interest, setInterest] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) newErrors.name = "Nome é obrigatório"
    if (!email.trim()) {
      newErrors.email = "Email é obrigatório"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email inválido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    onSubmit({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      interest: interest.trim() || undefined,
    })
  }

  const inputClass =
    "w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#F5B800] focus:border-[#F5B800] transition-colors"

  return (
    <div className="mx-1 mb-3 bg-[#F9FAFB] border border-gray-200 rounded-xl p-4">
      <p className="text-xs font-semibold text-gray-700 mb-3">
        Preenche os teus dados para recebermos a tua cotação:
      </p>
      <form onSubmit={handleSubmit} className="space-y-2.5">
        <div>
          <input
            type="text"
            placeholder="Nome *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            disabled={disabled}
            aria-label="Nome"
          />
          {errors.name && (
            <p className="text-[10px] text-red-500 mt-0.5">{errors.name}</p>
          )}
        </div>
        <div>
          <input
            type="email"
            placeholder="Email *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            disabled={disabled}
            aria-label="Email"
          />
          {errors.email && (
            <p className="text-[10px] text-red-500 mt-0.5">{errors.email}</p>
          )}
        </div>
        <input
          type="tel"
          placeholder="Telefone (opcional)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={inputClass}
          disabled={disabled}
          aria-label="Telefone"
        />
        <textarea
          placeholder="Descreve o que precisas..."
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
          rows={2}
          className={`${inputClass} resize-none`}
          disabled={disabled}
          aria-label="Descrição do interesse"
        />
        <button
          type="submit"
          disabled={disabled}
          className="w-full flex items-center justify-center gap-2 bg-[#F5B800] text-black text-sm font-semibold py-2 rounded-lg hover:bg-[#FFD040] transition-colors disabled:opacity-50"
        >
          <Send className="w-3.5 h-3.5" />
          Enviar Pedido
        </button>
      </form>
    </div>
  )
}
