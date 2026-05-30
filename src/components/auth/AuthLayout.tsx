import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type AuthLayoutProps = {
  eyebrow: string
  title: string
  description: string
  footerLabel: string
  footerLinkText: string
  footerLinkTo: string
  children: ReactNode
}

export default function AuthLayout({
  eyebrow,
  title,
  description,
  footerLabel,
  footerLinkText,
  footerLinkTo,
  children,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen overflow-x-hidden overflow-y-auto bg-[radial-gradient(circle_at_top_left,_rgba(199,123,98,0.28),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(44,62,91,0.18),_transparent_32%),linear-gradient(180deg,_#d1a197_0%,_#f1dfd3_24%,_#f8f3ee_60%,_#efe8e3_100%)] px-4 py-4 sm:px-6 sm:py-8 lg:py-10">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid min-h-[calc(100vh-2rem)] w-full overflow-hidden rounded-[2rem] border border-white/65 bg-white/78 shadow-[0_30px_90px_rgba(34,20,17,0.22)] backdrop-blur-xl md:min-h-[calc(100vh-6rem)] md:grid-cols-[minmax(0,1.02fr)_minmax(320px,0.98fr)] md:rounded-[2.5rem]">
        <section className="flex flex-col items-center justify-center px-5 py-8 text-center sm:px-8 sm:py-10 lg:px-16">
          <div className="mb-6 flex items-center justify-center">
            <img src="/logo-find-it.png" alt="Find-It" className="h-28 w-28 rounded-2xl object-contain sm:h-36 sm:w-36" />
          </div>

          <div className="mt-2 w-full max-w-md sm:mt-4">
            {children}

            <div className="mt-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-black/10" />
              <span className="whitespace-nowrap text-xs font-medium uppercase tracking-[0.22em] text-black/42">Or continue with</span>
              <div className="h-px flex-1 bg-black/10" />
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <button
                className="flex h-12 items-center justify-center rounded-2xl border border-black/8 bg-white text-xl shadow-[0_12px_24px_rgba(17,17,17,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(17,17,17,0.12)]"
                type="button"
                aria-label="Continue with Google"
              >
                G
              </button>
              <button
                className="flex h-12 items-center justify-center rounded-2xl border border-black/8 bg-white text-xl shadow-[0_12px_24px_rgba(17,17,17,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(17,17,17,0.12)]"
                type="button"
                aria-label="Continue with Apple"
              >
                A
              </button>
              <button
                className="flex h-12 items-center justify-center rounded-2xl border border-black/8 bg-white text-xl shadow-[0_12px_24px_rgba(17,17,17,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(17,17,17,0.12)]"
                type="button"
                aria-label="Continue with Facebook"
              >
                f
              </button>
            </div>

            <p className="mt-8 text-sm text-[#5f5954]">
              {footerLabel}{' '}
              <Link className="font-semibold text-[#1c1c1e] underline decoration-[#1c1c1e]/25 underline-offset-4 transition hover:decoration-[#1c1c1e]/55" to={footerLinkTo}>
                {footerLinkText}
              </Link>
            </p>
          </div>
        </section>

        <aside className="relative hidden md:flex md:items-center md:justify-center lg:p-10">
          <div className="h-full w-full overflow-hidden rounded-r-[2.5rem]">
            <img src="/signup.png" alt="Signup art" className="w-full h-full object-cover" />
          </div>
        </aside>
        </div>
      </div>
    </div>
  )
}