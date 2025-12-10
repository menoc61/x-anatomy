"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Mail, ArrowLeft, Brain } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const { toast } = useToast()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Particle animation for the background
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
    }[] = []

    const createParticles = () => {
      const particleCount = Math.floor(window.innerWidth / 10)
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: Math.random() * 0.5 - 0.25,
          speedY: Math.random() * 0.5 - 0.25,
          color: `rgba(59, 130, 246, ${Math.random() * 0.3})`,
        })
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()

        p.x += p.speedX
        p.y += p.speedY

        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1
      }

      requestAnimationFrame(animate)
    }

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      particles.length = 0
      createParticles()
    }

    createParticles()
    animate()

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Success
    setIsSubmitted(true)
    toast({
      title: "Reset link sent",
      description: "If an account exists with this email, you'll receive a password reset link.",
      duration: 5000,
    })

    setIsLoading(false)
  }

  const titleWords = "Reset Your Password".split(" ")

  return (
    <div className="flex min-h-screen flex-col md:flex-row overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0 opacity-30" />

      {/* Left Column - Branding/Image */}
      <div className="relative hidden w-full md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800">
        <div
          className="absolute inset-0 z-0 opacity-20 bg-blend-overlay"
          style={{
            backgroundImage: `url(/anatomy-background.png)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-600/80 to-blue-900/90" />

        <div className="relative z-10 flex w-full flex-col items-center justify-center p-12 text-white">
          <Link href="/" className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-5xl font-bold tracking-tight"
            >
              <span className="text-white">X</span>
              <span className="text-blue-200">Anatomy</span>
            </motion.div>
          </Link>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-12 max-w-md text-center"
          >
            <div className="mb-4 overflow-hidden">
              {titleWords.map((word, i) => (
                <motion.span
                  key={i}
                  className="inline-block mr-2 text-4xl font-bold"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                >
                  {word}
                </motion.span>
              ))}
            </div>
            <motion.p
              className="text-lg opacity-90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              We'll send you instructions to reset your password and get back to exploring.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="relative w-full max-w-md h-64 mb-8"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src="/placeholder-logo.jpg"
                alt="3D Anatomy Model"
                className="h-full object-contain auth-model-animation"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-auto"
          >
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-4 bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <div className="h-14 w-14 overflow-hidden rounded-full bg-white/20 flex-shrink-0">
                  <img src="/placeholder-userjpg" alt="Doctor" className="h-full w-full object-cover" />
                </div>
                <div>
                  <p className="font-medium">Dr. Sarah Johnson</p>
                  <p className="text-sm opacity-80">
                    "XAnatomy has revolutionized how I teach human anatomy to medical students. The 3D visualizations
                    are incredibly detailed."
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="relative flex w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-4 md:w-1/2">
        <div className="absolute top-4 left-4 md:hidden">
          <Link href="/" className="text-3xl font-bold tracking-tight">
            <span className="text-primary">X</span>
            <span className="text-gray-800 dark:text-gray-200">Anatomy</span>
          </Link>
        </div>

        <motion.div
          className="w-full max-w-md mt-16 md:mt-0 space-y-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
            <CardHeader className="space-y-1 pb-4">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex items-center justify-center mb-2"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Brain className="h-6 w-6" />
                </div>
              </motion.div>
              <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
              <CardDescription className="text-center">
                Enter your email address and we'll send you a link to reset your password
              </CardDescription>
            </CardHeader>

            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <CardContent className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                    >
                      <Alert className="bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800/30">
                        <AlertTitle className="font-semibold">Check your email</AlertTitle>
                        <AlertDescription>
                          We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and
                          follow the instructions.
                        </AlertDescription>
                      </Alert>
                    </motion.div>
                    <motion.div
                      className="text-center mt-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.3 }}
                    >
                      <Button asChild variant="outline" className="w-full h-11 relative overflow-hidden group">
                        <Link href="/login">
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Back to Login
                          <motion.div
                            className="absolute inset-0 bg-primary/5"
                            initial={{ x: "-100%" }}
                            whileHover={{ x: "100%" }}
                            transition={{ duration: 0.5 }}
                          />
                        </Link>
                      </Button>
                    </motion.div>
                  </CardContent>
                </motion.div>
              ) : (
                <motion.form key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSubmit}>
                  <CardContent className="space-y-4">
                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </Label>
                      <div className="relative">
                        <motion.div
                          className={cn(
                            "absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200",
                            isFocused ? "text-primary" : "text-muted-foreground",
                          )}
                          animate={{
                            scale: isFocused ? 1.1 : 1,
                            x: isFocused ? -2 : 0,
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          <Mail className="h-5 w-5" />
                        </motion.div>
                        <Input
                          id="email"
                          type="email"
                          placeholder="m@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={isLoading}
                          required
                          onFocus={() => setIsFocused(true)}
                          onBlur={() => setIsFocused(false)}
                          className={cn(
                            "h-11 pl-10 transition-all duration-300",
                            isFocused ? "border-primary ring-2 ring-primary/20" : "border-muted-foreground/20",
                          )}
                        />
                      </div>
                    </motion.div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-4 pt-0">
                    <Button type="submit" className="h-11 w-full relative overflow-hidden group" disabled={isLoading}>
                      <AnimatePresence mode="wait">
                        {isLoading ? (
                          <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center justify-center"
                          >
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </motion.div>
                        ) : (
                          <motion.div
                            key="default"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            Send Reset Link
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <motion.div
                        className="absolute inset-0 bg-white/10"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.5 }}
                      />
                    </Button>

                    <motion.div
                      className="text-center text-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      <Link href="/login" className="text-primary hover:underline inline-flex items-center">
                        <ArrowLeft className="mr-1 h-3 w-3" />
                        Back to login
                      </Link>
                    </motion.div>
                  </CardFooter>
                </motion.form>
              )}
            </AnimatePresence>
          </Card>

          <motion.div
            className="text-center text-xs text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <p>© 2023 XAnatomy. All rights reserved.</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

