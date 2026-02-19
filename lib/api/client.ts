import { treaty } from "@elysiajs/eden"
import type { App } from "@/server/app"

export const api = treaty<App>(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001", {
  fetch: {
    credentials: "include",
  },
})
