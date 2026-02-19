import { Elysia } from "elysia"
import { cors } from "@elysiajs/cors"
import { authRoutes } from "./routes/auth.routes"
import { habitRoutes } from "./routes/habit.routes"
import { userRoutes } from "./routes/user.routes"
import { rewardRoutes } from "./routes/reward.routes"

export const app = new Elysia()
  .use(
    cors({
      origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      credentials: true,
    })
  )
  .use(authRoutes)
  .use(habitRoutes)
  .use(userRoutes)
  .use(rewardRoutes)

export type App = typeof app
