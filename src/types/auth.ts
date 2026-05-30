export type User = {
  id: number
  email: string
  full_name: string
  role: string
}

export type AuthTokens = {
  access: string
  refresh: string
}

export type AuthResponse = AuthTokens & {
  user: User
}
