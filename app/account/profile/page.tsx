"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, User, Mail, Pencil, Save, X } from "lucide-react";
import Link from "next/link";

const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  bio: z.string().max(160).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  // Default values for the form
  const defaultValues: Partial<ProfileFormValues> = {
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
  };


  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  function onSubmit(data: ProfileFormValues) {
    if (!user) return;

    // Update user data
    const updatedUser = {
      ...user,
      name: data.name,
      email: data.email,
      bio: data.bio,
      updatedAt: new Date().toISOString(),
    };

    updateUser(updatedUser);
    setIsEditing(false);

    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="container max-w-4xl py-10">
      <div className="flex items-center gap-2 mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Account Settings</h1>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>
                    Manage your profile information.
                  </CardDescription>
                </div>
                <Button
                  variant={isEditing ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? (
                    <>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <Avatar className="w-20 h-20">
                  <AvatarImage
                    src={`https://avatar.vercel.sh/${user.email}`}
                    alt={user.name}
                  />
                  <AvatarFallback className="text-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="text-xl font-medium">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <p className="text-sm text-muted-foreground">
                    Member since {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <Separator />

              {isEditing ? (
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <div className="flex items-center">
                              <User className="mr-2 h-4 w-4 text-muted-foreground" />
                              <Input placeholder="Your name" {...field} />
                            </div>
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
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="flex items-center">
                              <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                              <Input placeholder="Your email" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us a little bit about yourself"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            You can <span>@mention</span> other users and
                            organizations.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">
                      <Save className="mr-2 h-4 w-4" />
                      Save changes
                    </Button>
                  </form>
                </Form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Name
                    </h4>
                    <p>{user.name}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Email
                    </h4>
                    <p>{user.email}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Bio
                    </h4>
                    <p>{user.bio || "No bio provided."}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
              <CardDescription>
                Manage your subscription plan and billing.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Current Plan</h4>
                  <p className="text-sm text-muted-foreground">
                    {user.subscription?.plan.charAt(0).toUpperCase() +
                      user.subscription?.plan.slice(1)}
                  </p>
                </div>
                <Button variant="outline" asChild>
                  <Link href="/account/subscription">Manage Subscription</Link>
                </Button>
              </div>
              <Separator />
              <div>
                <h4 className="font-medium mb-2">Subscription Status</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <p className="font-medium capitalize">
                      {user.subscription.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Renewal</p>
                    <p className="font-medium">
                      {user.subscription.autoRenew
                        ? "Auto-renews"
                        : "Does not renew"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Start Date</p>
                    <p className="font-medium">
                      {new Date(
                        user.subscription.startDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Expiry Date</p>
                    <p className="font-medium">
                      {new Date(
                        user.subscription.expiresAt
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how the application looks on your device.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h4 className="font-medium">Theme</h4>
                <p className="text-sm text-muted-foreground">
                  Select your preferred theme for the application.
                </p>
                <div className="grid grid-cols-3 gap-4 pt-2">
                  <Button variant="outline" className="justify-start">
                    Light
                  </Button>
                  <Button variant="outline" className="justify-start">
                    Dark
                  </Button>
                  <Button variant="default" className="justify-start">
                    System
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium">Font Size</h4>
                <p className="text-sm text-muted-foreground">
                  Adjust the font size for better readability.
                </p>
                <div className="grid grid-cols-4 gap-4 pt-2">
                  <Button variant="outline" className="justify-start">
                    Small
                  </Button>
                  <Button variant="default" className="justify-start">
                    Medium
                  </Button>
                  <Button variant="outline" className="justify-start">
                    Large
                  </Button>
                  <Button variant="outline" className="justify-start">
                    X-Large
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium">Animation</h4>
                <p className="text-sm text-muted-foreground">
                  Control animation and motion effects.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <Button variant="default" className="justify-start">
                    Enabled
                  </Button>
                  <Button variant="outline" className="justify-start">
                    Reduced
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Configure how you receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Email Notifications</h4>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Product Updates</p>
                      <p className="text-sm text-muted-foreground">
                        Receive emails about new features and improvements.
                      </p>
                    </div>
                    <Button variant="outline">Enabled</Button>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Subscription Alerts</p>
                      <p className="text-sm text-muted-foreground">
                        Get notified about your subscription status and
                        renewals.
                      </p>
                    </div>
                    <Button variant="outline">Enabled</Button>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Educational Content</p>
                      <p className="text-sm text-muted-foreground">
                        Receive educational materials and anatomy guides.
                      </p>
                    </div>
                    <Button variant="outline">Disabled</Button>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">In-App Notifications</h4>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">New Content Alerts</p>
                      <p className="text-sm text-muted-foreground">
                        Get notified when new muscles or videos are added.
                      </p>
                    </div>
                    <Button variant="outline">Enabled</Button>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Feature Tips</p>
                      <p className="text-sm text-muted-foreground">
                        Receive tips about features you haven't used yet.
                      </p>
                    </div>
                    <Button variant="outline">Enabled</Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save notification preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
