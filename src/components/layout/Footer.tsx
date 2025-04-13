
import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-primary text-primary-foreground pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-secondary" />
              <h3 className="text-xl font-bold">Reportify</h3>
            </div>
            <p className="text-primary-foreground/80">
              Evolve securely with comprehensive security reporting and management.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-primary-foreground/80 hover:text-secondary transition-colors">Home</Link></li>
              <li><Link to="/dashboard" className="text-primary-foreground/80 hover:text-secondary transition-colors">Dashboard</Link></li>
              <li><Link to="/reports" className="text-primary-foreground/80 hover:text-secondary transition-colors">Reports</Link></li>
              <li><Link to="/create-report" className="text-primary-foreground/80 hover:text-secondary transition-colors">Create Report</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-primary-foreground/80 hover:text-secondary transition-colors">Documentation</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-secondary transition-colors">API Reference</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-secondary transition-colors">Support</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-secondary transition-colors">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-primary-foreground/80 hover:text-secondary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-secondary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-secondary transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-secondary transition-colors">GDPR</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center text-primary-foreground/60">
          <p>© {currentYear} Reportify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
