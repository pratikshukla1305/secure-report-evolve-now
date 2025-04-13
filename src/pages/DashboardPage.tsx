
import Layout from "@/components/layout/Layout";
import StatsCard from "@/components/dashboard/StatsCard";
import ReportActivityChart from "@/components/dashboard/ReportActivityChart";
import SeveritySummaryChart from "@/components/dashboard/SeveritySummaryChart";
import RecentReportsTable from "@/components/dashboard/RecentReportsTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, FileText, Search, Shield, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";

const DashboardPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Security Dashboard</h1>
            <p className="text-muted-foreground">
              Overview of your organization's security status and reports
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search reports..."
                className="pl-8 w-[200px] md:w-[300px]"
              />
            </div>
            <Button>
              <FileText className="mr-2 h-4 w-4" /> New Report
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Reports"
            value="368"
            description="All security reports"
            icon={FileText}
            trend="up"
            trendValue="12% from last month"
          />
          <StatsCard
            title="Open Issues"
            value="42"
            description="Unresolved vulnerabilities"
            icon={AlertTriangle}
            trend="down"
            trendValue="8% from last month"
          />
          <StatsCard
            title="Average Resolution Time"
            value="4.2 days"
            description="Time to resolve issues"
            icon={Zap}
            trend="up"
            trendValue="Faster by 1.5 days"
          />
          <StatsCard
            title="Security Score"
            value="87/100"
            description="Overall security rating"
            icon={Shield}
            trend="up"
            trendValue="5 points from last month"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Report Activity</CardTitle>
              <CardDescription>
                Monthly report submissions and vulnerabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReportActivityChart />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Severity Summary</CardTitle>
              <CardDescription>
                Distribution of vulnerabilities by severity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SeveritySummaryChart />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <CardTitle>Recent Reports</CardTitle>
                  <CardDescription>
                    The latest security vulnerability reports
                  </CardDescription>
                </div>
                <Button variant="outline" className="mt-4 md:mt-0">
                  View All Reports
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <RecentReportsTable />
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
