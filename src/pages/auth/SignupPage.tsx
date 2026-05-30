import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/auth/AuthLayout'
import { useAuth } from '../../context/AuthContext'

function getErrorMessage(error: unknown) {
  if (typeof error !== 'object' || error === null) {
    return 'Unable to create account. Please verify your details.'
  }

  const response = (error as { response?: { data?: unknown } }).response
  const data = response?.data

  if (typeof data === 'string') {
    return data
  }

  if (data && typeof data === 'object') {
    const entries = Object.entries(data as Record<string, unknown>)
    const messages = entries.flatMap(([, value]) => {
      if (Array.isArray(value)) {
        return value.map((item) => String(item))
      }

      if (typeof value === 'string') {
        return [value]
      }

      return []
    })

    if (messages.length > 0) {
      return messages.join(' ')
    }
  }

  return 'Unable to create account. Please verify your details.'
}

export default function SignupPage() {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const [form, setForm] = useState({ email: '', full_name: '', password: '', password_confirm: '' })
  const [error, setError] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    try {
      await signup(form)
      navigate('/dashboard')
    } catch (error) {
      setError(getErrorMessage(error))
    }
  }

  return (
    <AuthLayout
      eyebrow="Join the Find-It network"
      title="Create your account"
      description="Set up your profile to post items, track recoveries, and make searching easier for everyone on campus."
      footerLabel="Already have an account?"
      footerLinkText="Log in"
      footerLinkTo="/login"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-3">
          <input
            className="w-full rounded-2xl border border-black/8 bg-white px-4 py-3.5 text-base text-[#1c1c1e] outline-none transition placeholder:text-black/28 focus:border-[#9a6d5f] focus:ring-4 focus:ring-[#9a6d5f]/10 sm:text-sm"
            placeholder="Full name"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          />
          <input
            className="w-full rounded-2xl border border-black/8 bg-white px-4 py-3.5 text-base text-[#1c1c1e] outline-none transition placeholder:text-black/28 focus:border-[#9a6d5f] focus:ring-4 focus:ring-[#9a6d5f]/10 sm:text-sm"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="w-full rounded-2xl border border-black/8 bg-white px-4 py-3.5 text-base text-[#1c1c1e] outline-none transition placeholder:text-black/28 focus:border-[#9a6d5f] focus:ring-4 focus:ring-[#9a6d5f]/10 sm:text-sm"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <input
            className="w-full rounded-2xl border border-black/8 bg-white px-4 py-3.5 text-base text-[#1c1c1e] outline-none transition placeholder:text-black/28 focus:border-[#9a6d5f] focus:ring-4 focus:ring-[#9a6d5f]/10 sm:text-sm"
            type="password"
            placeholder="Confirm password"
            value={form.password_confirm}
            onChange={(e) => setForm({ ...form, password_confirm: e.target.value })}
          />
          <p className="text-xs text-black/40">Use at least 8 characters and avoid common passwords.</p>
        </div>
        {error ? <p className="text-sm text-[#9a4d43]">{error}</p> : null}
        <button
          className="w-full rounded-2xl bg-[#a36d7c] px-4 py-3.5 font-medium text-white shadow-[0_16px_32px_rgba(163,109,124,0.28)] transition hover:-translate-y-0.5 hover:bg-[#94616f]"
          type="submit"
        >
          Sign Up
        </button>
      </form>
    </AuthLayout>
  )
}
