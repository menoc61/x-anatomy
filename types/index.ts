export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "user"
  bio: string
  subscription?: Subscription
  createdAt: string
  updatedAt: string
}

export interface Subscription {
  id: string
  status: "active" | "inactive" | "trial"
  plan: "basic" | "premium" | "professional"
  startDate: string
  expiresAt: string
  autoRenew: boolean
}

export interface MuscleCondition {
  id: string
  name: string
  description: string
}

export interface MuscleData {
  id: string
  name: string
  shortDescription: string
  description: string
  image: string
  origin: string
  insertion: string
  functions: string[]
  movements: string[]
  conditions: MuscleCondition[]
  videos: Video[]
  createdAt: string
  updatedAt: string
}

export interface Video {
  id: string
  title: string
  description: string
  url: string
  thumbnail: string
  duration: string
  status: "published" | "draft" | "review"
  category: string
  views?: number 
  uploadDate?: string 
  isPremium: boolean
  muscleId?: string 
  createdAt: string
  updatedAt: string
}

export interface Dashboard {
  totalUsers: number
  activeSubscriptions: number
  totalVideos: number
  recentUsers: User[]
  popularMuscles: {
    id: string
    name: string
    views: number
  }[]
  subscriptionStats: {
    basic: number
    premium: number
    professional: number
  }
  commentStats: {
    total: number
    flagged: number
    pending: number
  }
}
