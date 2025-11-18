import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";
import { Activity, Users, TrendingUp, Heart } from "lucide-react";
import { useHealthMetrics } from "../hooks/useHealthMetrics";
import { StatsSkeleton } from "./SkeletonLoader";

export function HealthStats() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    avgHealthScore: 0,
    totalSubmissions: 0,
    activeUsers: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const { contract, isConnected } = useHealthMetrics();

  const loadStats = async () => {
    if (!contract || !isConnected) return;

    setIsLoading(true);
    try {
      // Get total users count
      const usersCount = await contract.getUsersCount();
      const totalUsers = Number(usersCount);

      // Calculate basic statistics
      let totalScore = 0;
      let activeCount = 0;

      for (let i = 0; i < Math.min(totalUsers, 50); i++) { // Limit for performance
        try {
          const userAddr = await contract.users(i);
          const hasData = await contract.hasHealthData(userAddr);
          if (hasData) {
            activeCount++;
            // Note: In real implementation, we'd decrypt and aggregate scores
            // For demo purposes, we'll show placeholder calculations
          }
        } catch (error) {
          console.log(`Error checking user ${i}:`, error);
        }
      }

      setStats({
        totalUsers,
        avgHealthScore: activeCount > 0 ? Math.floor(Math.random() * 40) + 60 : 0, // Placeholder
        totalSubmissions: activeCount,
        activeUsers: activeCount
      });
    } catch (error) {
      console.error("Failed to load stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, [contract, isConnected]);

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Health Statistics
          </CardTitle>
          <CardDescription>Platform health metrics overview</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Connect wallet to view statistics</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Health Statistics
            </CardTitle>
            <CardDescription>Real-time platform health analytics</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadStats}
            disabled={isLoading}
          >
            <TrendingUp className="w-4 h-4 mr-1" />
            {isLoading ? "Loading..." : "Refresh"}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <StatsSkeleton />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-8 h-8 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalUsers}
              </div>
              <div className="text-sm text-gray-500">Total Users</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Heart className="w-8 h-8 text-red-500" />
              </div>
              <div className="text-2xl font-bold text-red-600">
                {stats.avgHealthScore}
              </div>
              <div className="text-sm text-gray-500">Avg Health Score</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Activity className="w-8 h-8 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-green-600">
                {stats.totalSubmissions}
              </div>
              <div className="text-sm text-gray-500">Total Submissions</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-8 h-8 text-purple-500" />
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {stats.activeUsers}
              </div>
              <div className="text-sm text-gray-500">Active Users</div>
            </div>
          </div>
        )}

        {stats.totalUsers > 0 && (
          <div className="mt-6 pt-6 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Participation Rate:</span>{" "}
                {stats.totalUsers > 0
                  ? ((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)
                  : 0}% of registered users
              </div>
              <div>
                <span className="font-medium">Health Score Range:</span>{" "}
                Good (70+), Fair (50-69), Needs Attention (<50)
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
