"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Eye, EyeOff } from "lucide-react"
import { signUp } from "@/lib/api/hooks/use-auth"
import { OAuthButtons } from "@/components/oauth-buttons"
import { registerSchema, type RegisterValues } from "@/lib/shared/schemas/auth.schema"
import { Card } from "@/components/ui/card"
import { Logo } from "@/components/logo"

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", username: "", email: "", password: "" },
  })

  const onSubmit = async (values: RegisterValues) => {
    const { error } = await signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
      username: values.username,
    } as Parameters<typeof signUp.email>[0] & { username: string })

    if (error) {
      form.setError("root", {
        message: error.message ?? "Registration failed",
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
          <h1 className="text-2xl font-medium text-foreground">Create your account</h1>
          <p className="text-sm text-muted-foreground">Start tracking your habits today</p>
        </div>
      </div>

      <Card className="p-4 md:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Jane Doe" className="h-10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Username</FormLabel>
                  <FormControl>
                    <Input placeholder="janedoe" className="h-10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
              {form.formState.isSubmitting ? "Creating account..." : "Create account"}
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
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-foreground underline underline-offset-2 hover:text-foreground/80"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}
