"use client"

import React, { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Trash2, Eye, EyeOff, Camera, Loader2, CheckCircle2, XCircle } from "lucide-react"
import { useProfileForm, type UsernameStatus } from "@/hooks/use-profile-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const ALL_TABS = ["profile", "password", "data"] as const
type TabValue = (typeof ALL_TABS)[number]

function UsernameStatusIcon({ status }: { status: UsernameStatus }) {
  if (status === "checking")
    return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
  if (status === "available") return <CheckCircle2 className="h-4 w-4 text-green-500" />
  if (status === "taken") return <XCircle className="h-4 w-4 text-destructive" />
  return null
}

const tabVariants = {
  enter: (d: number) => ({ x: d * 32, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: d * -32, opacity: 0 }),
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabValue>("profile")
  const [direction, setDirection] = useState(0)

  function handleTabChange(value: string) {
    const tabs = visibleTabs
    const oldIdx = tabs.indexOf(activeTab)
    const newIdx = tabs.indexOf(value as TabValue)
    setDirection(newIdx > oldIdx ? 1 : -1)
    setActiveTab(value as TabValue)
  }

  const {
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
    isDeletingAccount,
  } = useProfileForm()

  const visibleTabs = profile?.hasPassword
    ? ALL_TABS
    : (["profile", "data"] as const as readonly TabValue[])

  if (isLoading) {
    return (
      <main className="mx-auto max-w-lg px-4 py-6">
        {/* Back link */}
        <Skeleton className="h-4 w-36 mb-6" />

        <div className="flex flex-col gap-6">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-3 w-64" />
          </div>

          {/* Tabs bar */}
          <div className="flex gap-3 border-b border-border pb-1">
            <Skeleton className="h-7 w-36 rounded-md" />
            <Skeleton className="h-7 w-20 rounded-md" />
            <Skeleton className="h-7 w-12 rounded-md" />
          </div>

          {/* Card */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-6 py-5 flex flex-col gap-1.5">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-52" />
            </div>
            <div className="h-px bg-border" />
            <div className="px-6 py-5 flex flex-col gap-5">
              <Skeleton className="h-[72px] w-[72px] rounded-full" />
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex flex-col gap-1.5">
                  <Skeleton className="h-3.5 w-12" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              ))}
            </div>
            <div className="h-px bg-border" />
            <div className="px-6 py-4 flex justify-end">
              <Skeleton className="h-9 w-28 rounded-md" />
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (!profile) return null

  return (
    <main className="mx-auto max-w-lg px-4 py-6">
      <div className="flex flex-col gap-6">
        {/* Page title */}
        <div>
          <h1 className="text-xl font-semibold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your account settings and preferences.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="profile">Personal Information</TabsTrigger>
            {profile.hasPassword && <TabsTrigger value="password">Password</TabsTrigger>}
            <TabsTrigger value="data">Data</TabsTrigger>
          </TabsList>

          <div className="relative">
            <AnimatePresence initial={false} mode="wait" custom={direction}>
              <motion.div
                key={activeTab}
                custom={direction}
                variants={tabVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                {/* Personal Info */}
                {activeTab === "profile" && (
                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle>Personal Informatio</CardTitle>
                      <CardDescription>Update your personal details.</CardDescription>
                    </CardHeader>
                    <Form {...profileForm}>
                      <CardContent>
                        <form id="profile-form" onSubmit={handleSaveProfile}>
                          <div className="flex flex-col gap-5">
                            {/* Avatar */}
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-4">
                                <div
                                  className="relative group cursor-pointer"
                                  onClick={() => fileInputRef.current?.click()}
                                >
                                  <Avatar className="h-18 w-18">
                                    {imagePreview && <AvatarImage src={imagePreview} />}
                                    <AvatarFallback className="text-lg font-semibold bg-secondary text-secondary-foreground">
                                      {initials}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="h-5 w-5 text-white" />
                                  </div>
                                </div>
                                {imagePreview && (
                                  <div className="flex flex-col gap-1">
                                    <Button
                                      variant="secondary"
                                      size="sm"
                                      onClick={() => fileInputRef.current?.click()}
                                    >
                                      Change photo
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => setImagePreview(null)}
                                    >
                                      Remove photo
                                    </Button>
                                  </div>
                                )}
                                <input
                                  ref={fileInputRef}
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={handleFileChange}
                                />
                              </div>
                            </div>

                            <FormField
                              control={profileForm.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm">Name</FormLabel>
                                  <FormControl>
                                    <Input className="h-10" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={profileForm.control}
                              name="username"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm">Username</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <Input className="h-10 pr-9" {...field} />
                                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <UsernameStatusIcon status={usernameStatus} />
                                      </div>
                                    </div>
                                  </FormControl>
                                  {usernameStatus === "available" && (
                                    <p className="text-[11px] text-green-600">
                                      Username is available
                                    </p>
                                  )}
                                  {usernameStatus === "taken" && (
                                    <p className="text-[11px] text-destructive">
                                      Username is already taken
                                    </p>
                                  )}
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="flex flex-col gap-2">
                              <Label className="text-sm">Email</Label>
                              <Input value={profile.email} disabled className="h-10 opacity-60" />
                              <p className="text-[11px] text-muted-foreground">
                                Email cannot be changed.
                              </p>
                            </div>

                            {profileForm.formState.errors.root && (
                              <p className="text-[11px] text-destructive">
                                {profileForm.formState.errors.root.message}
                              </p>
                            )}
                          </div>
                        </form>
                      </CardContent>
                      <CardFooter>
                        <Button
                          type="submit"
                          form="profile-form"
                          variant="outline"
                          disabled={
                            profileForm.formState.isSubmitting ||
                            usernameStatus === "taken" ||
                            usernameStatus === "checking"
                          }
                          className="w-full"
                        >
                          {profileForm.formState.isSubmitting ? "Saving..." : "Save changes"}
                        </Button>
                      </CardFooter>
                    </Form>
                  </Card>
                )}

                {/* Change Password */}
                {activeTab === "password" && (
                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle>Change Password</CardTitle>
                      <CardDescription>
                        Update your password to keep your account secure.
                      </CardDescription>
                    </CardHeader>
                    <Form {...passwordForm}>
                      <CardContent>
                        <form onSubmit={handleChangePassword}>
                          <div className="flex flex-col gap-5">
                            <FormField
                              control={passwordForm.control}
                              name="currentPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm">Current password</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <Input
                                        type={showCurrentPassword ? "text" : "password"}
                                        className="h-10 pr-10"
                                        {...field}
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
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={passwordForm.control}
                              name="newPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm">New password</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <Input
                                        type={showNewPassword ? "text" : "password"}
                                        className="h-10 pr-10"
                                        {...field}
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
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={passwordForm.control}
                              name="confirmPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm">Confirm new password</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <Input
                                        type={showConfirmPassword ? "text" : "password"}
                                        className="h-10 pr-10"
                                        {...field}
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
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {passwordForm.formState.errors.root && (
                              <p className="text-[11px] text-destructive">
                                {passwordForm.formState.errors.root.message}
                              </p>
                            )}
                          </div>
                        </form>
                      </CardContent>
                      <CardFooter>
                        <Button
                          type="submit"
                          variant={"outline"}
                          disabled={passwordForm.formState.isSubmitting}
                          className="w-full"
                        >
                          {passwordForm.formState.isSubmitting ? "Updating..." : "Update password"}
                        </Button>
                      </CardFooter>
                    </Form>
                  </Card>
                )}

                {/* Your Data */}
                {activeTab === "data" && (
                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle>Your Data</CardTitle>
                      <CardDescription>Manage your data and account.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0 pr-4">
                            <div className="flex items-center gap-2">
                              <Download className="h-4 w-4 text-muted-foreground shrink-0" />
                              <h3 className="text-sm font-medium text-card-foreground">
                                Export Data
                              </h3>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                              Download all your data (profile, habits, check-ins) in JSON format.
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleExportData}
                            className="h-9 px-4 text-xs shrink-0"
                          >
                            Export
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0 pr-4">
                          <div className="flex items-center gap-2">
                            <Trash2 className="h-4 w-4 text-destructive shrink-0" />
                            <h3 className="text-sm font-medium text-destructive">Delete Account</h3>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            This action is permanent and cannot be undone. All your data will be
                            removed.
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
                                This action is permanent and cannot be undone. All your data
                                including habits, check-ins, and badges will be permanently removed.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                onClick={handleDeleteAccount}
                                disabled={isDeletingAccount}
                              >
                                {isDeletingAccount ? "Deleting..." : "Delete account"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardFooter>
                  </Card>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </Tabs>
      </div>
    </main>
  )
}
