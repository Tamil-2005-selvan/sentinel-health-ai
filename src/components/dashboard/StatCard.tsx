import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  variant?: "default" | "normal" | "warning" | "critical";
  delay?: number;
}

const variantStyles = {
  default: {
    bg: "bg-gradient-to-br from-primary/10 to-primary/5",
    icon: "bg-primary text-white",
    text: "text-primary",
  },
  normal: {
    bg: "bg-gradient-to-br from-status-normal/10 to-status-normal/5",
    icon: "bg-status-normal text-white",
    text: "text-status-normal",
  },
  warning: {
    bg: "bg-gradient-to-br from-status-warning/10 to-status-warning/5",
    icon: "bg-status-warning text-white",
    text: "text-status-warning",
  },
  critical: {
    bg: "bg-gradient-to-br from-status-critical/10 to-status-critical/5",
    icon: "bg-status-critical text-white",
    text: "text-status-critical",
  },
};

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  variant = "default",
  delay = 0,
}) => {
  const styles = variantStyles[variant];

  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl border border-white/20",
        "bg-white/70 shadow-lg hover:shadow-xl transition-all duration-300",
        "hover:-translate-y-1"
      )}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: delay * 0.1, ease: "easeOut" }}
      whileHover={{ scale: 1.02 }}
    >
      <div className={cn("absolute inset-0 opacity-50", styles.bg)} />
      
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <AnimatedCounter
            target={value}
            duration={1.5}
            className={cn("text-4xl font-bold", styles.text)}
          />
        </div>
        
        <motion.div
          className={cn(
            "flex items-center justify-center w-12 h-12 rounded-xl shadow-lg",
            styles.icon
          )}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, delay: delay * 0.1 + 0.2, type: "spring" }}
        >
          <Icon className="w-6 h-6" />
        </motion.div>
      </div>

      {variant === "critical" && value > 0 && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-status-critical"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: delay * 0.1 + 0.3 }}
        />
      )}
    </motion.div>
  );
};

export { StatCard };
