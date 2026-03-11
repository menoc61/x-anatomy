"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ApiConfigurationCard } from "@/components/admin/api-configuration-card"
import { useEnvironmentStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import { Download, Upload, RotateCcw } from "lucide-react"

type LocalHealthResponse = {
  ok: boolean
  elapsedMs: number
  postgres: {
    ok: boolean
    message: string
    timestamp?: string
  }
  redis: {
    ok: boolean
    message: string
    host: string
    port: number
  }
}

export default function EnvironmentSettingsPage() {
  const { exportConfigs, importConfigs, resetAllApiConfigs } = useEnvironmentStore()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("apis")
  const [isTestingLocal, setIsTestingLocal] = useState(false)
  const [localHealth, setLocalHealth] = useState<LocalHealthResponse | null>(null)

  const handleExport = () => {
    const configsJson = exportConfigs()
    const blob = new Blob([configsJson], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "api-configurations.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Configurations exported",
      description: "API configurations have been exported successfully.",
    })
  }

  const handleImport = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "application/json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target?.result as string
        try {
          const success = importConfigs(content)
          if (success) {
            toast({
              title: "Configurations imported",
              description: "API configurations have been imported successfully.",
            })
          } else {
            toast({
              title: "Import failed",
              description: "Failed to import API configurations. Invalid format.",
              variant: "destructive",
            })
          }
        } catch (error) {
          toast({
            title: "Import failed",
            description: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
            variant: "destructive",
          })
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  const handleResetAll = () => {
    if (confirm("Are you sure you want to reset all API configurations to their default values?")) {
      resetAllApiConfigs()
      toast({
        title: "All configurations reset",
        description: "All API configurations have been reset to their default values.",
      })
    }
  }

  const testLocalInfrastructure = async () => {
    setIsTestingLocal(true)

    try {
      const response = await fetch("/api/health/local", { cache: "no-store" })
      const data = (await response.json()) as LocalHealthResponse
      setLocalHealth(data)

      toast({
        title: data.ok ? "Local services connected" : "Local services check failed",
        description: data.ok
          ? "PostgreSQL and Redis are reachable from the app."
          : "One or more services are unavailable. Review details in Infrastructure tab.",
        variant: data.ok ? "default" : "destructive",
      })
    } catch (error) {
      toast({
        title: "Infrastructure check failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      })
    } finally {
      setIsTestingLocal(false)
    }
  }

  // Mock test connection functions
  const testSketchfabConnection = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    return true
  }

  const testOpenAIConnection = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    return true
  }

  const testStripeConnection = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    return true
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Environment Settings</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={handleImport}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm" onClick={handleResetAll}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset All
          </Button>
        </div>
      </div>

      <Tabs defaultValue="apis" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full max-w-xl">
          <TabsTrigger value="apis">APIs</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="auth">Auth</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
        </TabsList>

        <TabsContent value="apis" className="space-y-6 mt-6">
          <ApiConfigurationCard
            apiName="openai"
            title="OpenAI"
            description="Configure OpenAI API for AI-powered features."
            fields={[
              { key: "apiKey", label: "API Key", type: "password", required: true },
              { key: "endpoint", label: "API Endpoint", type: "url", placeholder: "https://api.openai.com/v1" },
              { key: "additionalConfig.model", label: "Default Model", type: "text", placeholder: "gpt-4" },
            ]}
            testConnection={testOpenAIConnection}
          />

          <ApiConfigurationCard
            apiName="stripe"
            title="Stripe"
            description="Configure Stripe for payment processing."
            fields={[
              { key: "apiKey", label: "Secret Key", type: "password", required: true },
              { key: "additionalConfig.publicKey", label: "Public Key", type: "text", required: true },
              { key: "additionalConfig.webhookSecret", label: "Webhook Secret", type: "password" },
            ]}
            testConnection={testStripeConnection}
          />

          <ApiConfigurationCard
            apiName="sendgrid"
            title="SendGrid"
            description="Configure SendGrid for email notifications."
            fields={[
              { key: "apiKey", label: "API Key", type: "password", required: true },
              {
                key: "additionalConfig.fromEmail",
                label: "From Email",
                type: "text",
                placeholder: "noreply@example.com",
              },
            ]}
          />
        </TabsContent>

        <TabsContent value="content" className="space-y-6 mt-6">
          <ApiConfigurationCard
            apiName="sketchfab"
            title="Sketchfab"
            description="Configure Sketchfab for 3D model integration."
            fields={[
              { key: "apiKey", label: "API Key", type: "password", required: true },
              {
                key: "additionalConfig.modelId",
                label: "Default Model ID",
                type: "text",
                placeholder: "31b40fd809b14665b93773936d67c52c",
              },
            ]}
            testConnection={testSketchfabConnection}
          />

          <ApiConfigurationCard
            apiName="vercelBlob"
            title="Vercel Blob"
            description="Configure Vercel Blob for file storage."
            fields={[{ key: "apiKey", label: "API Key", type: "password", required: true }]}
          />
        </TabsContent>

        <TabsContent value="auth" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Providers</CardTitle>
              <CardDescription>Configure authentication providers for your application.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Authentication providers have been moved to a separate section. Please use the Auth section in the main
                settings.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6 mt-6">
          <ApiConfigurationCard
            apiName="googleAnalytics"
            title="Google Analytics"
            description="Configure Google Analytics for tracking user behavior."
            fields={[
              {
                key: "additionalConfig.measurementId",
                label: "Measurement ID",
                type: "text",
                placeholder: "G-XXXXXXXXXX",
                required: true,
              },
            ]}
          />
        </TabsContent>

        <TabsContent value="infrastructure" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Local Infrastructure Check</CardTitle>
              <CardDescription>Verify local PostgreSQL and Redis connectivity from the running app.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={testLocalInfrastructure} disabled={isTestingLocal}>
                {isTestingLocal ? "Testing..." : "Test Local PostgreSQL + Redis"}
              </Button>

              {localHealth && (
                <div className="space-y-2 text-sm">
                  <p className={localHealth.ok ? "text-green-600" : "text-red-600"}>
                    Overall status: {localHealth.ok ? "Healthy" : "Unhealthy"}
                  </p>
                  <p>
                    PostgreSQL: {localHealth.postgres.ok ? "Connected" : "Disconnected"} — {localHealth.postgres.message}
                  </p>
                  <p>
                    Redis: {localHealth.redis.ok ? "Connected" : "Disconnected"} — {localHealth.redis.message} (
                    {localHealth.redis.host}:{localHealth.redis.port})
                  </p>
                  <p>Response time: {localHealth.elapsedMs}ms</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
