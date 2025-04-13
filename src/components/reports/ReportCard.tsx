
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ArrowRight, Calendar, FileText, User } from "lucide-react";
import { Link } from "react-router-dom";

interface ReportCardProps {
  id: string;
  title: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
  status: "open" | "in-progress" | "resolved" | "closed";
  submittedBy: string;
  submittedDate: string;
}

const getSeverityColor = (severity: ReportCardProps["severity"]) => {
  const colors = {
    critical: "bg-red-500 hover:bg-red-600",
    high: "bg-orange-500 hover:bg-orange-600",
    medium: "bg-yellow-500 hover:bg-yellow-600",
    low: "bg-green-500 hover:bg-green-600",
    info: "bg-blue-500 hover:bg-blue-600",
  };
  return colors[severity];
};

const getStatusColor = (status: ReportCardProps["status"]) => {
  const colors = {
    open: "bg-red-100 text-red-800 hover:bg-red-200",
    "in-progress": "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    resolved: "bg-green-100 text-green-800 hover:bg-green-200",
    closed: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  };
  return colors[status];
};

const ReportCard = ({
  id,
  title,
  description,
  severity,
  status,
  submittedBy,
  submittedDate,
}: ReportCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="px-6 pb-0">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{id}</span>
          <div className="flex gap-2">
            <Badge
              className={getSeverityColor(severity)}
            >
              {severity.charAt(0).toUpperCase() + severity.slice(1)}
            </Badge>
            <Badge variant="outline" className={getStatusColor(status)}>
              {status.split("-").map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(" ")}
            </Badge>
          </div>
        </div>
        <h3 className="font-semibold text-lg mt-2">{title}</h3>
      </CardHeader>
      <CardContent className="px-6 py-4">
        <p className="text-muted-foreground text-sm line-clamp-2">{description}</p>
        <div className="flex flex-col sm:flex-row gap-3 mt-4 text-xs text-muted-foreground">
          <div className="flex items-center">
            <User className="h-3.5 w-3.5 mr-1" />
            <span>{submittedBy}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            <span>{submittedDate}</span>
          </div>
          <div className="flex items-center">
            <FileText className="h-3.5 w-3.5 mr-1" />
            <span>2 Attachments</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-6 pt-0">
        <Button asChild variant="outline" className="w-full">
          <Link to={`/reports/${id}`} className="flex items-center justify-center">
            View Report <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReportCard;
