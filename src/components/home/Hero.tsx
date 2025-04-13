
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileText, Shield, TrendingUp } from "lucide-react";

const Hero = () => {
  return (
    <div className="py-20 bg-gradient-to-b from-background to-muted relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            <span className="text-primary">Secure</span> your systems.{" "}
            <span className="text-secondary">Report</span> vulnerabilities.{" "}
            <span className="text-accent">Evolve</span> securely.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            A comprehensive platform for security vulnerability reporting,
            management, and analytics. Help your organization evolve securely with
            actionable insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild className="bg-secondary hover:bg-secondary/90">
              <Link to="/create-report">Create Report</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/dashboard">View Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute right-0 top-20 -z-0 opacity-10">
        <Shield className="w-96 h-96 text-secondary" />
      </div>
      <div className="hidden md:block absolute bottom-10 right-10 animate-pulse-slow opacity-10">
        <TrendingUp className="w-40 h-40 text-accent" />
      </div>
      <div className="hidden md:block absolute top-40 right-1/3 animate-pulse-slow opacity-10">
        <FileText className="w-24 h-24 text-primary" />
      </div>
    </div>
  );
};

export default Hero;
