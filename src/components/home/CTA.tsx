
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to enhance your security posture?</h2>
        <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-10">
          Start using Reportify today to streamline vulnerability management, improve security reporting, and evolve your security processes.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" className="bg-secondary hover:bg-secondary/90" asChild>
            <Link to="/create-report">Report a Vulnerability</Link>
          </Button>
          <Button size="lg" variant="outline" className="border-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
            <Link to="/dashboard">View Security Dashboard</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
