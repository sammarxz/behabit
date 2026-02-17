export type UserProfile = {
  name: string
  username: string
  email: string
  avatarUrl?: string
}

export const DEFAULT_USER: UserProfile = {
  name: "Jane Doe",
  username: "janedoe",
  email: "jane@example.com",
}
