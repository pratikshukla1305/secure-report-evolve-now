
import Layout from "@/components/layout/Layout";
import ReportForm from "@/components/reports/ReportForm";
import { ShieldCheck } from "lucide-react";

const CreateReportPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <ShieldCheck className="h-12 w-12 text-secondary mx-auto mb-3" />
          <h1 className="text-3xl font-bold mb-2">Submit Security Report</h1>
          <p className="text-muted-foreground">
            Provide details about the security vulnerability you've discovered
          </p>
        </div>

        <div className="bg-card border border-border/50 rounded-lg p-6 shadow-sm">
          <ReportForm />
        </div>
      </div>
    </Layout>
  );
};

export default CreateReportPage;
