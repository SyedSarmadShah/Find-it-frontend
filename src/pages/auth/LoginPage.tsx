import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/auth/AuthLayout'
import PasswordInput from '../../components/ui/PasswordInput'
import { useAuth } from '../../context/AuthContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch {
      setError('Unable to log in. Check your credentials.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout
      eyebrow="Let’s get you back in"
      title="Hello Again!"
      description="Sign in to check updates, recover items, and keep your campus finds organized in one place."
      footerLabel="No account yet?"
      footerLinkText="Create one"
      footerLinkTo="/signup"
    >
      <form className="space-y-4" onSubmit={handleSubmit} aria-busy={isSubmitting}>
        <div className="space-y-3">
          <input
            className="w-full rounded-2xl border border-black/8 bg-white px-4 py-3.5 text-base text-[#1c1c1e] outline-none transition placeholder:text-black/28 focus:border-[#9a6d5f] focus:ring-4 focus:ring-[#9a6d5f]/10 sm:text-sm"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <PasswordInput
            value={form.password}
            onChange={(v) => setForm({ ...form, password: v })}
            id="password"
            name="password"
            placeholder="Password"
            showChecklist={false}
          />
          <div className="text-right text-xs font-medium text-black/35">Recovery Password</div>
        </div>
        {error ? <p className="text-sm text-[#9a4d43]">{error}</p> : null}
        <button
          className="w-full rounded-2xl bg-[#a36d7c] px-4 py-3.5 font-medium text-white shadow-[0_16px_32px_rgba(163,109,124,0.28)] transition hover:bg-[#94616f] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-[#a36d7c]"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </AuthLayout>
  )
}
