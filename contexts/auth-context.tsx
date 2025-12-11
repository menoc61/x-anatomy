"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { User, Subscription } from "@/types"
import { useRouter } from "next/navigation"
import { create } from "zustand"
import { persist } from "zustand/middleware"

// Zustand store for auth persistence
interface AuthStore {
  user: User | null
  isAdmin: boolean
  setUser: (user: User | null) => void
  setIsAdmin: (isAdmin: boolean) => void
  clearStore: () => void
}

const useAuthStore = create(
  persist<AuthStore>(
    (set) => ({
      user: null,
      isAdmin: false,
      setUser: (user) => set({ user }),
      setIsAdmin: (isAdmin) => set({ isAdmin }),
      clearStore: () => set({ user: null, isAdmin: false }),
    }),
    {
      name: "anatomy-explorer-auth",
    },
  ),
)

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  updateSubscription: (subscription: Subscription) => void
  updateUser: (updatedUser: User) => void
  isAdmin: boolean
  isSubscribed: boolean
  isTrialActive: boolean
  trialDaysRemaining: number
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  // Get state from zustand store
  const { user, isAdmin, setUser, setIsAdmin, clearStore } = useAuthStore()

  // Derived states
  const isSubscribed =
    user?.subscription?.status === "active" &&
    user?.subscription?.plan !== "basic" &&
    new Date(user?.subscription?.expiresAt) > new Date()

  const isTrialActive = user?.subscription?.status === "trial" && new Date(user?.subscription?.expiresAt) > new Date()

  const trialDaysRemaining = isTrialActive
    ? Math.max(
        0,
        Math.ceil((new Date(user?.subscription?.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
      )
    : 0

  // Initialize auth state from persistent storage
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true)
      try {
        // Auth is handled by zustand/persist, so we just need to check if we have a user
        if (user) {
          // Validate subscription status
          const now = new Date()
          const expiryDate = user.subscription ? new Date(user.subscription.expiresAt) : null

          // If subscription has expired, update it
          if (expiryDate && expiryDate < now && user.subscription.status !== "inactive") {
            const updatedUser = {
              ...user,
              subscription: {
                ...user.subscription,
                status: "inactive" as Subscription["status"],
              },
            }
            setUser(updatedUser)
          }

          // Set admin status
          setIsAdmin(user.role === "admin")
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
        // Don't clear store on error, just continue
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)

    try {
      // Accept any email/password combination for demo purposes
      // Special case for premium user
      if (email.includes("premium") || email === "user@user.com") {
        const premiumUser: User = {
          id: `user-${Date.now()}`,
          name: email.split("@")[0],
          email: email,
          role: "user",
          subscription: {
            id: `sub-${Date.now()}`,
            status: "active",
            plan: "premium",
            startDate: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
            autoRenew: true,
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        setUser(premiumUser)
        setIsAdmin(false)
        return true
      }

      // Special case for admin
      if (email.includes("admin")) {
        const adminUser: User = {
          id: `admin-${Date.now()}`,
          name: email.split("@")[0],
          email,
          role: "admin",
          subscription: {
            id: `sub-${Date.now()}`,
            status: "active",
            plan: "professional",
            startDate: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
            autoRenew: true,
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        setUser(adminUser)
        setIsAdmin(true)
        return true
      }

      // For all other users, create a trial account
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: email.split("@")[0],
        email,
        role: "user",
        subscription: {
          id: `sub-${Date.now()}`,
          status: "trial",
          plan: "basic",
          startDate: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
          autoRenew: false,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // Save to zustand store
      setUser(newUser)
      setIsAdmin(false)
      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    clearStore() // Clear zustand store
    router.push("/login")
  }

  const updateSubscription = (subscription: Subscription) => {
    if (!user) return

    const updatedUser = {
      ...user,
      subscription,
    }

    setUser(updatedUser)
  }

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser)
    setIsAdmin(updatedUser.role === "admin")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        updateSubscription,
        updateUser,
        isAdmin,
        isSubscribed,
        isTrialActive,
        trialDaysRemaining,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
