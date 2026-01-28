import React from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  LogOut, 
  User, 
  Shield,
  Menu
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <motion.header
      className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/70 backdrop-blur-xl"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/dashboard" className="flex items-center gap-3">
          <motion.div
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary shadow-glow"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Activity className="w-5 h-5 text-white" />
          </motion.div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-foreground">ISMS</h1>
            <p className="text-xs text-muted-foreground">Patient Monitoring</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <NavItem to="/dashboard" label="Dashboard" />
          <NavItem to="/patient-history" label="Patient History" />
          <NavItem to="/audit-trail" label="Audit Trail" />
        </nav>

        <div className="flex items-center gap-2">
          <NotificationCenter />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 hover:bg-primary/5"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="hidden sm:inline text-sm font-medium">Dr. Smith</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 glass-card">
              <DropdownMenuLabel>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-secondary" />
                  <span>Admin Access</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => navigate("/profile")} 
                className="cursor-pointer"
              >
                <User className="w-4 h-4 mr-2" />
                Profile & Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 glass-card md:hidden">
              <DropdownMenuItem asChild>
                <Link to="/dashboard">Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/patient-history">Patient History</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/audit-trail">Audit Trail</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  );
};

interface NavItemProps {
  to: string;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, label }) => {
  return (
    <Link
      to={to}
      className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-primary/5"
    >
      {label}
    </Link>
  );
};

export { Navbar };
