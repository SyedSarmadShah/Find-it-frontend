import { act, fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'

const navigateMock = vi.fn()
const loginMock = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => navigateMock,
  }
})

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    login: loginMock,
  }),
}))

vi.mock('../components/auth/AuthLayout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

vi.mock('../components/ui/PasswordInput', () => ({
  default: ({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder?: string }) => (
    <input
      aria-label={placeholder}
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  ),
}))

import LoginPage from '../pages/auth/LoginPage'

test('LoginPage shows submitting state immediately after submit', async () => {
  loginMock.mockReturnValueOnce(new Promise<void>(() => {}))

  render(<LoginPage />)

  fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'student@example.com' } })
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secret123' } })

  const form = screen.getByRole('button', { name: 'Sign In' }).closest('form')
  if (!form) {
    throw new Error('Login form not found')
  }

  await act(async () => {
    fireEvent.submit(form)
  })

  expect(screen.getByRole('button', { name: 'Signing in...' })).toBeDisabled()
  expect(loginMock).toHaveBeenCalledWith('student@example.com', 'secret123')
})
