import React from 'react'

type Props = {
  value: string
  onChange: (v: string) => void
  id?: string
  name?: string
  placeholder?: string
  showChecklist?: boolean
}

export default function PasswordInput({
  value,
  onChange,
  id = 'password',
  name = 'password',
  placeholder = 'Password',
  showChecklist = true,
}: Props) {
  const [visible, setVisible] = React.useState(false)
  const pw = value ?? ''

  const rules = {
    length: pw.length >= 8,
    uppercase: /[A-Z]/.test(pw),
    number: /[0-9]/.test(pw),
    special: /[^A-Za-z0-9]/.test(pw),
  }

  const score = Object.values(rules).filter(Boolean).length

  const strength = (() => {
    switch (score) {
      case 0:
      case 1:
        return { label: 'Really Weak', color: 'bg-red-500', percent: 25 }
      case 2:
        return { label: 'Weak', color: 'bg-orange-500', percent: 50 }
      case 3:
        return { label: 'Medium', color: 'bg-yellow-400', percent: 75 }
      case 4:
        return { label: 'Strong', color: 'bg-green-500', percent: 100 }
      default:
        return { label: '', color: 'bg-gray-300', percent: 0 }
    }
  })()

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        Password
      </label>

      <div className="relative">
        <input
          id={id}
          name={name}
          type={visible ? 'text' : 'password'}
          value={pw}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="block w-full rounded-2xl border border-black/8 bg-white px-4 py-3.5 text-base text-[#1c1c1e] outline-none transition placeholder:text-black/28 focus:border-[#9a6d5f] focus:ring-4 focus:ring-[#9a6d5f]/10 sm:text-sm"
          aria-describedby={`${id}-requirements ${id}-strength`}
        />
        <button
          type="button"
          onClick={() => setVisible((s) => !s)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-sm text-gray-600"
        >
          <img
            src={visible ? '/visible.png' : '/eye.png'}
            alt=""
            aria-hidden="true"
            className="h-5 w-5 object-contain"
          />
        </button>
      </div>

      {showChecklist ? (
        <div id={`${id}-strength`} className="space-y-1">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>Password strength</span>
            <span className="font-medium">{strength.label}</span>
          </div>
          <div className="h-2 w-full rounded bg-gray-200 overflow-hidden">
            <div
              className={`${strength.color} h-full transition-all`}
              style={{ width: `${strength.percent}%` }}
            />
          </div>
        </div>
      ) : null}

      {showChecklist ? (
        <div id={`${id}-requirements`} aria-live="polite" className="mt-1 text-sm">
          <div className="font-medium text-gray-700 mb-1">Password requirements:</div>
          <ul className="space-y-1">
            <li className="flex items-center text-sm">
              <span className={`mr-2 ${rules.length ? 'text-green-500' : 'text-gray-400'}`}>
                {rules.length ? '✔' : '•'}
              </span>
              <span className={rules.length ? 'text-gray-700' : 'text-gray-400'}>At least 8 characters long</span>
            </li>
            <li className="flex items-center text-sm">
              <span className={`mr-2 ${rules.uppercase ? 'text-green-500' : 'text-gray-400'}`}>
                {rules.uppercase ? '✔' : '•'}
              </span>
              <span className={rules.uppercase ? 'text-gray-700' : 'text-gray-400'}>Contains at least 1 uppercase letter (A-Z)</span>
            </li>
            <li className="flex items-center text-sm">
              <span className={`mr-2 ${rules.number ? 'text-green-500' : 'text-gray-400'}`}>
                {rules.number ? '✔' : '•'}
              </span>
              <span className={rules.number ? 'text-gray-700' : 'text-gray-400'}>Contains at least 1 number (0-9)</span>
            </li>
            <li className="flex items-center text-sm">
              <span className={`mr-2 ${rules.special ? 'text-green-500' : 'text-gray-400'}`}>
                {rules.special ? '✔' : '•'}
              </span>
              <span className={rules.special ? 'text-gray-700' : 'text-gray-400'}>Contains at least 1 special character (e.g., !, @, #)</span>
            </li>
          </ul>
        </div>
      ) : null}
    </div>
  )
}
