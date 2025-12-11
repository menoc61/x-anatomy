"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  ZAxis,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import type { Dashboard } from "@/types";
import {
  Users,
  Video,
  Crown,
  DollarSign,
  TrendingUp,
  Activity,
  Calendar,
  Dumbbell,
  MessageSquare,
  FileText,
  Settings,
  UserPlus,
  Upload,
  BarChart2,
  HardDrive,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [dashboardData, setDashboardData] = useState<Dashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30days");

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchDashboardData = async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock dashboard data
      const mockData: Dashboard = {
        totalUsers: 1248,
        activeSubscriptions: 843,
        totalVideos: 156,
        recentUsers: [
          {
            id: "user-1",
            name: "John Doe",
            email: "john@example.com",
            role: "user",
            createdAt: new Date(
              Date.now() - 2 * 24 * 60 * 60 * 1000
            ).toISOString(),
            updatedAt: new Date(
              Date.now() - 2 * 24 * 60 * 60 * 1000
            ).toISOString(),
            subscription: {
              id: "sub-1",
              status: "active",
              plan: "basic",
              startDate: new Date(
                Date.now() - 2 * 24 * 60 * 60 * 1000
              ).toISOString(),
              expiresAt: new Date(
                Date.now() + 12 * 24 * 60 * 60 * 1000
              ).toISOString(), // 12 days left
              autoRenew: true,
            },
          },
          {
            id: "user-2",
            name: "Jane Smith",
            email: "jane@example.com",
            role: "user",
            createdAt: new Date(
              Date.now() - 3 * 24 * 60 * 60 * 1000
            ).toISOString(),
            updatedAt: new Date(
              Date.now() - 3 * 24 * 60 * 60 * 1000
            ).toISOString(),
            subscription: {
              id: "sub-2",
              status: "trial",
              plan: "premium",
              startDate: new Date(
                Date.now() - 3 * 24 * 60 * 60 * 1000
              ).toISOString(),
              expiresAt: new Date(
                Date.now() + 11 * 24 * 60 * 60 * 1000
              ).toISOString(), // trial still active
              autoRenew: false,
            },
          },
          {
            id: "user-3",
            name: "Bob Johnson",
            email: "bob@example.com",
            role: "user",
            createdAt: new Date(
              Date.now() - 5 * 24 * 60 * 60 * 1000
            ).toISOString(),
            updatedAt: new Date(
              Date.now() - 5 * 24 * 60 * 60 * 1000
            ).toISOString(),
            subscription: {
              id: "sub-3",
              status: "inactive",
              plan: "professional",
              startDate: new Date(
                Date.now() - 40 * 24 * 60 * 60 * 1000
              ).toISOString(), // 40 days ago
              expiresAt: new Date(
                Date.now() - 10 * 24 * 60 * 60 * 1000
              ).toISOString(), // expired
              autoRenew: false,
            },
          },
        ],

        popularMuscles: [
          { id: "biceps", name: "Biceps Brachii", views: 1245 },
          { id: "quadriceps", name: "Quadriceps", views: 1120 },
          { id: "abdominals", name: "Abdominal Muscles", views: 980 },
          { id: "deltoids", name: "Deltoid Muscle", views: 875 },
          { id: "pectoralis", name: "Pectoralis Major", views: 750 },
        ],
        subscriptionStats: {
          basic: 423,
          premium: 312,
          professional: 108,
        },
        commentStats: {
          total: 1876,
          flagged: 23,
          pending: 12,
        },
      };

      setDashboardData(mockData);
      setIsLoading(false);
    };

    fetchDashboardData();
  }, []);

  // Prepare data for charts
  const subscriptionData = dashboardData
    ? [
        { name: "Basic", value: dashboardData.subscriptionStats.basic },
        { name: "Premium", value: dashboardData.subscriptionStats.premium },
        {
          name: "Professional",
          value: dashboardData.subscriptionStats.professional,
        },
      ]
    : [];

  const muscleViewsData = dashboardData?.popularMuscles || [];

  // Mock data for analytics charts
  const userGrowthData = [
    { name: "Jan", users: 850 },
    { name: "Feb", users: 900 },
    { name: "Mar", users: 950 },
    { name: "Apr", users: 1000 },
    { name: "May", users: 1050 },
    { name: "Jun", users: 1100 },
    { name: "Jul", users: 1150 },
    { name: "Aug", users: 1200 },
    { name: "Sep", users: 1248 },
  ];

  const revenueData = [
    { name: "Jan", revenue: 15000 },
    { name: "Feb", revenue: 16500 },
    { name: "Mar", revenue: 18000 },
    { name: "Apr", revenue: 19500 },
    { name: "May", revenue: 21000 },
    { name: "Jun", revenue: 22500 },
    { name: "Jul", revenue: 23000 },
    { name: "Aug", revenue: 23500 },
    { name: "Sep", revenue: 24389 },
  ];

  const engagementData = [
    { name: "Jan", views: 12500, sessions: 8500 },
    { name: "Feb", views: 13000, sessions: 9000 },
    { name: "Mar", views: 13500, sessions: 9500 },
    { name: "Apr", views: 14000, sessions: 10000 },
    { name: "May", views: 14500, sessions: 10500 },
    { name: "Jun", views: 15000, sessions: 11000 },
    { name: "Jul", views: 15500, sessions: 11500 },
    { name: "Aug", views: 16000, sessions: 12000 },
    { name: "Sep", views: 16500, sessions: 12500 },
  ];

  // Mock data for reports
  const deviceUsageData = [
    { name: "Desktop", value: 45 },
    { name: "Mobile", value: 40 },
    { name: "Tablet", value: 15 },
  ];

  // Mock data for user engagement scatter plot
  const userEngagementData = [
    {
      timeSpent: 15,
      actionsPerSession: 12,
      sessions: 50,
      name: "Casual Users",
    },
    {
      timeSpent: 25,
      actionsPerSession: 20,
      sessions: 80,
      name: "Regular Users",
    },
    {
      timeSpent: 40,
      actionsPerSession: 35,
      sessions: 120,
      name: "Power Users",
    },
    { timeSpent: 60, actionsPerSession: 50, sessions: 30, name: "Educators" },
    { timeSpent: 35, actionsPerSession: 30, sessions: 90, name: "Students" },
    {
      timeSpent: 45,
      actionsPerSession: 40,
      sessions: 70,
      name: "Healthcare Pros",
    },
  ];

  // Mock data for feature usage radar chart
  const featureUsageData = [
    {
      subject: "3D Model",
      A: 120,
      B: 110,
      fullMark: 150,
    },
    {
      subject: "Videos",
      A: 98,
      B: 130,
      fullMark: 150,
    },
    {
      subject: "Comments",
      A: 86,
      B: 130,
      fullMark: 150,
    },
    {
      subject: "Downloads",
      A: 99,
      B: 100,
      fullMark: 150,
    },
    {
      subject: "Search",
      A: 85,
      B: 90,
      fullMark: 150,
    },
    {
      subject: "Notes",
      A: 65,
      B: 85,
      fullMark: 150,
    },
  ];

  // Mock data for comment trends
  const commentTrendsData = [
    { name: "Jan", comments: 120, flagged: 5 },
    { name: "Feb", comments: 145, flagged: 7 },
    { name: "Mar", comments: 162, flagged: 8 },
    { name: "Apr", comments: 178, flagged: 10 },
    { name: "May", comments: 195, flagged: 12 },
    { name: "Jun", comments: 210, flagged: 15 },
    { name: "Jul", comments: 230, flagged: 18 },
    { name: "Aug", comments: 245, flagged: 20 },
    { name: "Sep", comments: 260, flagged: 23 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your anatomy explorer platform
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">This year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Export</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : dashboardData?.totalUsers.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Subscriptions
            </CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading
                ? "..."
                : dashboardData?.activeSubscriptions.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : dashboardData?.totalVideos.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">+4 added this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : "$24,389"}
            </div>
            <p className="text-xs text-muted-foreground">
              +18% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Popular Muscles</CardTitle>
                <CardDescription>
                  Most viewed muscle groups in the last 30 days
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px]">
                  {!isLoading && (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={muscleViewsData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <RechartsTooltip />
                        <Bar dataKey="views" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Subscription Distribution</CardTitle>
                <CardDescription>
                  Breakdown of active subscriptions by plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {!isLoading && (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={subscriptionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {subscriptionData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Users</CardTitle>
                <CardDescription>New users who joined recently</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {!isLoading &&
                    dashboardData?.recentUsers.map((user) => (
                      <div key={user.id} className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/users?id=${user.id}`}>View</Link>
                        </Button>
                      </div>
                    ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/admin/users">View All Users</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    className="h-auto py-4 flex flex-col items-center justify-center gap-2"
                    asChild
                  >
                    <Link href="/admin/users/add">
                      <UserPlus className="h-5 w-5" />
                      <span>Add User</span>
                    </Link>
                  </Button>
                  <Button
                    className="h-auto py-4 flex flex-col items-center justify-center gap-2"
                    asChild
                  >
                    <Link href="/admin/videos/upload">
                      <Upload className="h-5 w-5" />
                      <span>Upload Video</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href="/admin/settings">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/admin/backup">
                    <HardDrive className="h-4 w-4 mr-2" />
                    Backup
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Growth</CardTitle>
                    <CardDescription>Total users over time</CardDescription>
                  </div>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={userGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Line
                        type="monotone"
                        dataKey="users"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="ml-auto" asChild>
                  <Link href="/admin/predictions/users">
                    Run Prediction Model
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Revenue</CardTitle>
                    <CardDescription>Monthly revenue in USD</CardDescription>
                  </div>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#00C49F"
                        fill="#00C49F"
                        fillOpacity={0.2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="ml-auto" asChild>
                  <Link href="/admin/predictions/revenue">
                    Run Prediction Model
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>User Engagement</CardTitle>
                  <CardDescription>
                    Page views and session duration
                  </CardDescription>
                </div>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Area
                      type="monotone"
                      dataKey="views"
                      stackId="1"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.2}
                    />
                    <Area
                      type="monotone"
                      dataKey="sessions"
                      stackId="2"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                      fillOpacity={0.2}
                    />
                    <Legend />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="ml-auto" asChild>
                <Link href="/admin/predictions/engagement">
                  Run Prediction Model
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Engagement Clusters</CardTitle>
                    <CardDescription>
                      Time spent vs. actions per session
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart
                      margin={{
                        top: 20,
                        right: 20,
                        bottom: 20,
                        left: 20,
                      }}
                    >
                      <CartesianGrid />
                      <XAxis
                        type="number"
                        dataKey="timeSpent"
                        name="Time Spent (min)"
                      />
                      <YAxis
                        type="number"
                        dataKey="actionsPerSession"
                        name="Actions"
                      />
                      <ZAxis
                        type="number"
                        dataKey="sessions"
                        range={[50, 400]}
                        name="Sessions"
                      />
                      <RechartsTooltip cursor={{ strokeDasharray: "3 3" }} />
                      <Legend />
                      <Scatter
                        name="User Segments"
                        data={userEngagementData}
                        fill="#8884d8"
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="ml-auto" asChild>
                  <Link href="/admin/predictions/clusters">
                    Run Clustering Algorithm
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Feature Usage Comparison</CardTitle>
                    <CardDescription>
                      Current month vs. previous month
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart
                      cx="50%"
                      cy="50%"
                      outerRadius="80%"
                      data={featureUsageData}
                    >
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis />
                      <Radar
                        name="Current Month"
                        dataKey="A"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.6}
                      />
                      <Radar
                        name="Previous Month"
                        dataKey="B"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                        fillOpacity={0.6}
                      />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="ml-auto" asChild>
                  <Link href="/admin/predictions/features">
                    Predict Future Usage
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Device Usage</CardTitle>
                    <CardDescription>
                      User access by device type
                    </CardDescription>
                  </div>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deviceUsageData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {deviceUsageData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Export Reports</CardTitle>
                <CardDescription>Download detailed reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">User Activity Report</p>
                        <p className="text-sm text-muted-foreground">
                          Detailed user engagement metrics
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Export
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Financial Report</p>
                        <p className="text-sm text-muted-foreground">
                          Revenue and subscription data
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Export
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Content Performance</p>
                        <p className="text-sm text-muted-foreground">
                          Most viewed muscles and videos
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Export
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Monthly Summary</p>
                        <p className="text-sm text-muted-foreground">
                          Complete platform overview
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Export
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Schedule Reports</CardTitle>
              <CardDescription>
                Set up automated report delivery
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <p>Receive weekly summary reports via email</p>
                <div className="flex gap-2">
                  <Button variant="outline">Configure</Button>
                  <Button>Enable</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Comments
                </CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading
                    ? "..."
                    : dashboardData?.commentStats.total.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  +15% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Flagged Comments
                </CardTitle>
                <MessageSquare className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading
                    ? "..."
                    : dashboardData?.commentStats.flagged.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Requires review</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Approval
                </CardTitle>
                <MessageSquare className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading
                    ? "..."
                    : dashboardData?.commentStats.pending.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Awaiting moderation
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Comment Trends</CardTitle>
                  <CardDescription>
                    Total and flagged comments over time
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={commentTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="comments"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                    <Line type="monotone" dataKey="flagged" stroke="#ff7300" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="ml-auto" asChild>
                <Link href="/admin/comments">Manage Comments</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Comment Moderation</CardTitle>
              <CardDescription>
                Review and manage flagged comments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border border-red-200 bg-red-50 rounded-md p-4">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h4 className="font-medium">Flagged Comment</h4>
                          <div className="text-sm text-muted-foreground">
                            <span>By: John Doe</span>
                            <span> • </span>
                            <span>2 hours ago</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Approve
                          </Button>
                          <Button variant="destructive" size="sm">
                            Remove
                          </Button>
                        </div>
                      </div>
                      <p className="mt-2">
                        This content appears to violate community guidelines
                        regarding medical advice.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border border-amber-200 bg-amber-50 rounded-md p-4">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h4 className="font-medium">Pending Comment</h4>
                          <div className="text-sm text-muted-foreground">
                            <span>By: Jane Smith</span>
                            <span> • </span>
                            <span>5 hours ago</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Approve
                          </Button>
                          <Button variant="destructive" size="sm">
                            Reject
                          </Button>
                        </div>
                      </div>
                      <p className="mt-2">
                        I've found this resource incredibly helpful for my
                        studies. The 3D models are detailed and accurate.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href="/admin/comments">View All Comments</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="support" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Developer Contact</CardTitle>
              <CardDescription>
                Get in touch with the development team for technical issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-2">
                    Technical Support
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Contact our development team for technical issues, bugs, or
                    feature requests.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>dev-support@anatomyexplorer.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span>Developer Slack Channel</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>GitHub Issue Tracker</span>
                    </div>
                  </div>
                  <Button className="mt-4 w-full">Contact Developers</Button>
                </div>

                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-2">
                    Emergency Support
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    For critical issues affecting system availability or data
                    integrity.
                  </p>
                  <div className="p-4 bg-red-50 text-red-800 rounded-md border border-red-200 mb-4">
                    <h4 className="font-medium">On-Call Support</h4>
                    <p className="text-sm mt-1">
                      Available 24/7 for critical production issues only.
                    </p>
                  </div>
                  <Button variant="destructive" className="w-full">
                    Emergency Contact
                  </Button>
                </div>
              </div>

              <div className="mt-6 border rounded-lg p-6">
                <h3 className="text-lg font-medium mb-2">System Status</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 bg-green-50 text-green-800 rounded-md border border-green-200">
                    <h4 className="font-medium">API Services</h4>
                    <p className="text-sm mt-1">Operational</p>
                  </div>
                  <div className="p-4 bg-green-50 text-green-800 rounded-md border border-green-200">
                    <h4 className="font-medium">Database</h4>
                    <p className="text-sm mt-1">Operational</p>
                  </div>
                  <div className="p-4 bg-green-50 text-green-800 rounded-md border border-green-200">
                    <h4 className="font-medium">Storage</h4>
                    <p className="text-sm mt-1">Operational</p>
                  </div>
                </div>
                <Button variant="outline" className="mt-4 w-full">
                  View System Status
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
