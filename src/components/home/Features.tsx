
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, BarChart2, FileText, Lock, Shield, TrendingUp } from "lucide-react";

const features = [
  {
    title: "Vulnerability Reporting",
    description:
      "Submit detailed security vulnerability reports with supporting evidence and documentation.",
    icon: AlertTriangle,
  },
  {
    title: "Secure Management",
    description:
      "Manage security issues with end-to-end encryption and role-based access controls.",
    icon: Lock,
  },
  {
    title: "Comprehensive Analytics",
    description:
      "Gain insights with powerful analytics dashboards showing security trends and metrics.",
    icon: BarChart2,
  },
  {
    title: "Automated Workflows",
    description:
      "Streamline security processes with customizable workflows and automation rules.",
    icon: TrendingUp,
  },
  {
    title: "Detailed Documentation",
    description:
      "Create and maintain security documentation with collaborative editing tools.",
    icon: FileText,
  },
  {
    title: "Compliance Reporting",
    description:
      "Generate compliance reports for regulatory requirements and security frameworks.",
    icon: Shield,
  },
];

const Features = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Comprehensive Security Platform</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A complete suite of tools to help your organization identify, manage, and
            remediate security vulnerabilities efficiently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-border/40 transition-all duration-200 hover:shadow-md hover:border-secondary/50">
              <CardHeader className="pb-2">
                <feature.icon className="h-12 w-12 text-secondary mb-4" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
