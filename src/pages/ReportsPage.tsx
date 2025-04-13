
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import ReportCard from "@/components/reports/ReportCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Plus, Search } from "lucide-react";

const reportsData = [
  {
    id: "REP-1234",
    title: "SQL Injection in Login Form",
    description:
      "A SQL injection vulnerability was discovered in the login form that could allow attackers to bypass authentication and access user data.",
    severity: "critical",
    status: "open",
    submittedBy: "John Doe",
    submittedDate: "2023-04-12",
  },
  {
    id: "REP-1235",
    title: "Cross-Site Scripting in Comments",
    description:
      "A stored XSS vulnerability exists in the comments section, allowing attackers to inject malicious JavaScript code that executes when users view comments.",
    severity: "high",
    status: "in-progress",
    submittedBy: "Jane Smith",
    submittedDate: "2023-04-11",
  },
  {
    id: "REP-1236",
    title: "Insecure Cookie Configuration",
    description:
      "Authentication cookies are being set without the Secure and HttpOnly flags, potentially exposing them to theft through MITM attacks or client-side scripts.",
    severity: "medium",
    status: "resolved",
    submittedBy: "Robert Johnson",
    submittedDate: "2023-04-10",
  },
  {
    id: "REP-1237",
    title: "Missing HTTP Security Headers",
    description:
      "The application is missing several important security headers such as Content-Security-Policy, X-Content-Type-Options, and X-Frame-Options.",
    severity: "low",
    status: "closed",
    submittedBy: "Emily Davis",
    submittedDate: "2023-04-09",
  },
  {
    id: "REP-1238",
    title: "Server Information Leakage",
    description:
      "The server is revealing detailed version information in HTTP headers, which could help attackers identify vulnerable components.",
    severity: "info",
    status: "open",
    submittedBy: "Michael Wilson",
    submittedDate: "2023-04-08",
  },
  {
    id: "REP-1239",
    title: "Weak Password Policy",
    description:
      "The system allows users to create weak passwords without enforcing minimum complexity requirements or length.",
    severity: "medium",
    status: "in-progress",
    submittedBy: "Sarah Johnson",
    submittedDate: "2023-04-07",
  },
  {
    id: "REP-1240",
    title: "CSRF Vulnerability in Profile Update",
    description:
      "The profile update functionality is vulnerable to Cross-Site Request Forgery attacks, allowing unauthorized changes to user profiles.",
    severity: "high",
    status: "open",
    submittedBy: "David Brown",
    submittedDate: "2023-04-06",
  },
  {
    id: "REP-1241",
    title: "Excessive Session Timeout",
    description:
      "User sessions remain active for too long (24+ hours) without re-authentication, increasing the risk of session hijacking.",
    severity: "low",
    status: "resolved",
    submittedBy: "Jennifer Lee",
    submittedDate: "2023-04-05",
  },
];

const ReportsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");

  const filteredReports = reportsData.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || report.status === statusFilter;

    const matchesSeverity =
      severityFilter === "all" || report.severity === severityFilter;

    return matchesSearch && matchesStatus && matchesSeverity;
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Security Reports</h1>
            <p className="text-muted-foreground">
              View and manage all security vulnerability reports
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button asChild>
              <a href="/create-report">
                <Plus className="mr-2 h-4 w-4" /> New Report
              </a>
            </Button>
          </div>
        </div>

        <div className="bg-card p-4 rounded-lg shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search reports..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={severityFilter}
                onValueChange={setSeverityFilter}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {filteredReports.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              No reports match the current filters.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setSeverityFilter("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <ReportCard
                key={report.id}
                id={report.id}
                title={report.title}
                description={report.description}
                severity={report.severity as any}
                status={report.status as any}
                submittedBy={report.submittedBy}
                submittedDate={report.submittedDate}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ReportsPage;
