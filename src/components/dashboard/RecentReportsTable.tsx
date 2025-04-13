
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface Report {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
  status: "open" | "in-progress" | "resolved" | "closed";
  submittedBy: string;
  submittedDate: string;
}

const recentReports: Report[] = [
  {
    id: "REP-1234",
    title: "SQL Injection in Login Form",
    severity: "critical",
    status: "open",
    submittedBy: "John Doe",
    submittedDate: "2023-04-12",
  },
  {
    id: "REP-1235",
    title: "Cross-Site Scripting in Comments",
    severity: "high",
    status: "in-progress",
    submittedBy: "Jane Smith",
    submittedDate: "2023-04-11",
  },
  {
    id: "REP-1236",
    title: "Insecure Cookie Configuration",
    severity: "medium",
    status: "resolved",
    submittedBy: "Robert Johnson",
    submittedDate: "2023-04-10",
  },
  {
    id: "REP-1237",
    title: "Missing HTTP Security Headers",
    severity: "low",
    status: "closed",
    submittedBy: "Emily Davis",
    submittedDate: "2023-04-09",
  },
  {
    id: "REP-1238",
    title: "Server Information Leakage",
    severity: "info",
    status: "open",
    submittedBy: "Michael Wilson",
    submittedDate: "2023-04-08",
  },
];

const getSeverityColor = (severity: Report["severity"]) => {
  const colors = {
    critical: "bg-red-500 hover:bg-red-600",
    high: "bg-orange-500 hover:bg-orange-600",
    medium: "bg-yellow-500 hover:bg-yellow-600",
    low: "bg-green-500 hover:bg-green-600",
    info: "bg-blue-500 hover:bg-blue-600",
  };
  return colors[severity];
};

const getStatusColor = (status: Report["status"]) => {
  const colors = {
    open: "bg-red-100 text-red-800 hover:bg-red-200",
    "in-progress": "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    resolved: "bg-green-100 text-green-800 hover:bg-green-200",
    closed: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  };
  return colors[status];
};

const RecentReportsTable = () => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Submitted By</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentReports.map((report) => (
            <TableRow key={report.id}>
              <TableCell className="font-medium">{report.id}</TableCell>
              <TableCell>{report.title}</TableCell>
              <TableCell>
                <Badge
                  className={getSeverityColor(report.severity)}
                >
                  {report.severity.charAt(0).toUpperCase() + report.severity.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={getStatusColor(report.status)}>
                  {report.status.split("-").map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(" ")}
                </Badge>
              </TableCell>
              <TableCell>{report.submittedBy}</TableCell>
              <TableCell>{report.submittedDate}</TableCell>
              <TableCell className="text-right">
                <Button asChild size="sm" variant="outline">
                  <Link to={`/reports/${report.id}`}>View</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RecentReportsTable;
