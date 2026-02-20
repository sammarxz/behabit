import { Elysia } from "elysia"
import { cors } from "@elysiajs/cors"
import { authRoutes } from "./routes/auth.routes"
import { habitRoutes } from "./routes/habit.routes"
import { userRoutes } from "./routes/user.routes"
import { rewardRoutes } from "./routes/reward.routes"

export const app = new Elysia()
  .use(
    cors({
      origin: true, // Allow incoming origin
      credentials: true,
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "Accept",
        "Origin",
        "X-Forwarded-Host",
        "X-Forwarded-Proto",
      ],
    })
  )
  .onError(({ error, code }) => {
    console.error(`[Elysia Error] ${code}:`, error)
  })
  .use(authRoutes)
  .use(habitRoutes)
  .use(userRoutes)
  .use(rewardRoutes)

export type App = typeof app
