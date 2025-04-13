
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Shield, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-secondary" />
            <Link to="/" className="text-xl font-bold">Reportify</Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-secondary transition-colors">Home</Link>
            <Link to="/dashboard" className="hover:text-secondary transition-colors">Dashboard</Link>
            <Link to="/reports" className="hover:text-secondary transition-colors">Reports</Link>
            <Link to="/create-report" className="hover:text-secondary transition-colors">Create Report</Link>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-secondary">
              <Bell className="h-5 w-5" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-secondary">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              Sign In
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-primary-foreground hover:text-secondary"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-3 border-t border-primary-foreground/10 animate-fade-in">
            <div className="flex flex-col space-y-3">
              <Link to="/" className="hover:text-secondary transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/dashboard" className="hover:text-secondary transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
              <Link to="/reports" className="hover:text-secondary transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Reports</Link>
              <Link to="/create-report" className="hover:text-secondary transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Create Report</Link>
              <div className="pt-2 flex items-center justify-between">
                <Button size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                  Sign In
                </Button>
                <div className="flex space-x-3">
                  <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-secondary">
                    <Bell className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-secondary">
                    <User className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
