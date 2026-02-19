"use client"

import React, { useState, useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useProfile, useUpdateProfile, useDeleteAccount } from "@/lib/api/hooks/use-profile"
import { useHabits } from "@/lib/api/hooks/use-habits"
import { authClient } from "@/lib/api/auth-client"
import { resizeImageToBase64 } from "@/hooks/use-image-resize"
import { api } from "@/lib/api/client"
import { toast } from "sonner"

export type UsernameStatus = "idle" | "checking" | "available" | "taken"

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Only letters, numbers, _ and - allowed"),
})

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Required"),
    newPassword: z.string().min(6, "At least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type ProfileValues = z.infer<typeof profileSchema>
type PasswordValues = z.infer<typeof passwordSchema>

export function useProfileForm() {
  const { data: profile, isLoading } = useProfile()
  const { data: habits = [] } = useHabits()
  const updateProfile = useUpdateProfile()
  const deleteAccountMutation = useDeleteAccount()

  const [imagePreview, setImagePreview] = useState<string | null | undefined>(undefined)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>("idle")

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", username: "" },
  })

  // eslint-disable-next-line react-hooks/incompatible-library
  const usernameValue = profileForm.watch("username")

  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  useEffect(() => {
    if (profile) {
      profileForm.reset({
        name: profile.name,
        username: profile.username || "",
      })
      setImagePreview(profile.image)
    }
  }, [profile]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const currentUsername = profile?.username || ""
    const value = usernameValue?.trim() ?? ""

    if (!value || value.length < 3 || value === currentUsername) {
      setUsernameStatus("idle")
      return
    }

    setUsernameStatus("checking")

    const timer = setTimeout(async () => {
      try {
        const { data } = await api.api.profile["check-username"].get({
          query: { username: value },
        })
        setUsernameStatus(data && "available" in data && data.available ? "available" : "taken")
      } catch {
        setUsernameStatus("idle")
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [usernameValue, profile?.username])

  const initials = profile?.name
    ? profile.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?"

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const base64 = await resizeImageToBase64(file)
    setImagePreview(base64)
    e.target.value = ""
  }

  const handleSaveProfile = profileForm.handleSubmit(async (data) => {
    updateProfile.mutate(
      {
        name: data.name.trim(),
        username: data.username.trim(),
        image: imagePreview ?? undefined,
      },
      {
        onSuccess: () => toast.success("Profile updated"),
        onError: (err) => {
          const message = err instanceof Error ? err.message : "Failed to update profile"
          if (message.toLowerCase().includes("username")) {
            profileForm.setError("username", { message: "Username already taken" })
          } else {
            profileForm.setError("root", { message })
          }
        },
      }
    )
  })

  const handleChangePassword = passwordForm.handleSubmit(async (data) => {
    const { error } = await authClient.changePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    })
    if (error) {
      passwordForm.setError("root", {
        message: error.message ?? "Failed to update password",
      })
    } else {
      passwordForm.reset()
      toast.success("Password updated")
    }
  })

  const handleDeleteAccount = async () => {
    try {
      await deleteAccountMutation.mutateAsync()
      await authClient.signOut()
      window.location.href = "/"
    } catch {
      toast.error("Failed to delete account. Please try again.")
    }
  }

  const handleExportData = () => {
    const data = { profile, habits, exportedAt: new Date().toISOString() }
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `behabit-${profile?.username || "user"}-data.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return {
    profile,
    isLoading,
    profileForm,
    passwordForm,
    imagePreview,
    setImagePreview,
    fileInputRef,
    initials,
    usernameStatus,
    showCurrentPassword,
    setShowCurrentPassword,
    showNewPassword,
    setShowNewPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    handleFileChange,
    handleSaveProfile,
    handleChangePassword,
    handleExportData,
    handleDeleteAccount,
    isDeletingAccount: deleteAccountMutation.isPending,
  }
}
