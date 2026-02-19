"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Eye, EyeOff } from "lucide-react"
import { signIn } from "@/lib/api/hooks/use-auth"
import { OAuthButtons } from "@/components/oauth-buttons"
import { loginSchema, type LoginValues } from "@/lib/shared/schemas/auth.schema"
import { Logo } from "@/components/logo"
import { Card } from "@/components/ui/card"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  const onSubmit = async (values: LoginValues) => {
    const { error } = await signIn.email({
      email: values.email,
      password: values.password,
    })
    if (error) {
      form.setError("root", {
        message: error.message ?? "Something went wrong",
      })
      return
    }
    router.push("/dashboard")
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-8 text-center">
        <Logo href="/" />
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-medium text-foreground">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your <strong>BeHabit</strong> account
          </p>
        </div>
      </div>

      <Card className="p-4 md:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" className="h-10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        className="h-10 pr-10"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-10 text-sm"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
            </Button>

            {form.formState.errors.root && (
              <p className="text-sm text-destructive text-center">
                {form.formState.errors.root.message}
              </p>
            )}
          </form>
        </Form>

        <div className="my-6 flex items-center gap-3">
          <hr className="flex-1" />
          <span className="text-muted-foreground text-xs">or continue with</span>
          <hr className="flex-1" />
        </div>

        <OAuthButtons />
      </Card>

      <p className="text-center text-sm text-muted-foreground">
        {"Don't have an account? "}
        <Link
          href="/register"
          className="text-foreground underline underline-offset-2 hover:text-foreground/80"
        >
          Sign up
        </Link>
      </p>
    </div>
  )
}
