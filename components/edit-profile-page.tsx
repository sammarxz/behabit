"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ArrowLeft, Download, Trash2, Eye, EyeOff } from "lucide-react"
import { type UserProfile } from "@/lib/user-types"

interface EditProfilePageProps {
  user: UserProfile
  onUpdateProfile: (user: UserProfile) => void
  onExportData: () => void
  onBack: () => void
}

export function EditProfilePage({
  user,
  onUpdateProfile,
  onExportData,
  onBack,
}: EditProfilePageProps) {
  const [name, setName] = useState(user.name)
  const [username, setUsername] = useState(user.username)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)
  const [passwordSaved, setPasswordSaved] = useState(false)

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const handleSaveProfile = () => {
    onUpdateProfile({
      ...user,
      name: name.trim(),
      username: username.trim(),
    })
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 2000)
  }

  const handleChangePassword = () => {
    if (newPassword.length < 6) return
    if (newPassword !== confirmPassword) return
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setPasswordSaved(true)
    setTimeout(() => setPasswordSaved(false), 2000)
  }

  const passwordValid =
    newPassword.length >= 6 &&
    newPassword === confirmPassword &&
    currentPassword.length > 0

  return (
    <main className="mx-auto max-w-2xl px-4 py-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </button>

      <div className="flex flex-col gap-8">
        {/* Page title */}
        <div>
          <h1 className="text-xl font-semibold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your account settings and preferences.
          </p>
        </div>

        {/* Personal Info */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-5">
            <h2 className="text-sm font-semibold text-card-foreground">
              Personal Information
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Update your personal details.
            </p>
          </div>
          <Separator />
          <div className="px-6 py-5 flex flex-col gap-5">
            {/* Avatar preview */}
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg font-semibold bg-secondary text-secondary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-card-foreground">
                  {user.name}
                </p>
                <p className="text-xs text-muted-foreground">@{user.username}</p>
              </div>
            </div>

            {/* Name */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="text-sm">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10"
              />
            </div>

            {/* Username */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="username" className="text-sm">
                Username
              </Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-10"
              />
            </div>

            {/* Email (read-only) */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-sm">
                Email
              </Label>
              <Input
                id="email"
                value={user.email}
                disabled
                className="h-10 opacity-60"
              />
              <p className="text-[11px] text-muted-foreground">
                Email cannot be changed.
              </p>
            </div>
          </div>
          <Separator />
          <div className="px-6 py-4 flex justify-end">
            <Button
              size="sm"
              onClick={handleSaveProfile}
              disabled={!name.trim() || !username.trim()}
              className="h-9 px-4 text-xs"
            >
              {profileSaved ? "Saved" : "Save changes"}
            </Button>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-5">
            <h2 className="text-sm font-semibold text-card-foreground">
              Change Password
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Update your password to keep your account secure.
            </p>
          </div>
          <Separator />
          <div className="px-6 py-5 flex flex-col gap-5">
            {/* Current password */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="current-password" className="text-sm">
                Current password
              </Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="h-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* New password */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="new-password" className="text-sm">
                New password
              </Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="h-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Minimum 6 characters.
              </p>
            </div>

            {/* Confirm password */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="confirm-password" className="text-sm">
                Confirm new password
              </Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {confirmPassword.length > 0 && newPassword !== confirmPassword && (
                <p className="text-[11px] text-destructive">
                  Passwords do not match.
                </p>
              )}
            </div>
          </div>
          <Separator />
          <div className="px-6 py-4 flex justify-end">
            <Button
              size="sm"
              onClick={handleChangePassword}
              disabled={!passwordValid}
              className="h-9 px-4 text-xs"
            >
              {passwordSaved ? "Updated" : "Update password"}
            </Button>
          </div>
        </div>

        {/* Your Data */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-5">
            <h2 className="text-sm font-semibold text-card-foreground">
              Your Data
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Manage your data and account.
            </p>
          </div>
          <Separator />
          <div className="flex flex-col">
            {/* Export Data */}
            <div className="flex items-start justify-between px-6 py-5">
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4 text-muted-foreground shrink-0" />
                  <h3 className="text-sm font-medium text-card-foreground">
                    Export Data
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Download all your data (profile, habits, check-ins, and
                  badges) in JSON format.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onExportData}
                className="h-9 px-4 text-xs shrink-0"
              >
                Export
              </Button>
            </div>

            <Separator />

            {/* Delete Account */}
            <div className="flex items-start justify-between px-6 py-5">
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4 text-destructive shrink-0" />
                  <h3 className="text-sm font-medium text-destructive">
                    Delete Account
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  This action is permanent and cannot be undone. All your data
                  will be removed.
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="h-9 px-4 text-xs shrink-0"
                  >
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action is permanent and cannot be undone. All your
                      data including habits, check-ins, and badges will be
                      permanently removed.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Delete account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
