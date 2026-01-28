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
    gradient: "from-primary/15 via-primary/5 to-transparent",
    iconBg: "bg-gradient-to-br from-primary to-primary/80",
    iconShadow: "shadow-lg shadow-primary/25",
    text: "text-primary",
    border: "border-primary/10",
    glow: "group-hover:shadow-primary/20",
  },
  normal: {
    gradient: "from-status-normal/15 via-status-normal/5 to-transparent",
    iconBg: "bg-gradient-to-br from-status-normal to-status-normal/80",
    iconShadow: "shadow-lg shadow-status-normal/25",
    text: "text-status-normal",
    border: "border-status-normal/10",
    glow: "group-hover:shadow-status-normal/20",
  },
  warning: {
    gradient: "from-status-warning/15 via-status-warning/5 to-transparent",
    iconBg: "bg-gradient-to-br from-status-warning to-status-warning/80",
    iconShadow: "shadow-lg shadow-status-warning/25",
    text: "text-status-warning",
    border: "border-status-warning/10",
    glow: "group-hover:shadow-status-warning/20",
  },
  critical: {
    gradient: "from-status-critical/15 via-status-critical/5 to-transparent",
    iconBg: "bg-gradient-to-br from-status-critical to-status-critical/80",
    iconShadow: "shadow-lg shadow-status-critical/25",
    text: "text-status-critical",
    border: "border-status-critical/10",
    glow: "group-hover:shadow-status-critical/20",
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
        "group relative overflow-hidden rounded-2xl p-6",
        "bg-white/80 backdrop-blur-xl",
        "border border-white/40",
        styles.border,
        "shadow-lg hover:shadow-xl transition-all duration-500",
        styles.glow
      )}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: delay * 0.1, ease: "easeOut" }}
      whileHover={{ y: -4, scale: 1.02 }}
    >
      {/* Gradient overlay */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-60",
        styles.gradient
      )} />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
        }}
      />
      
      <div className="relative flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
            {title}
          </p>
          <AnimatedCounter
            target={value}
            duration={1.5}
            className={cn("text-4xl font-bold tracking-tight", styles.text)}
          />
          
          {/* Subtle indicator line */}
          <motion.div 
            className={cn("h-0.5 rounded-full mt-2", styles.iconBg)}
            initial={{ width: 0 }}
            animate={{ width: '40%' }}
            transition={{ duration: 0.8, delay: delay * 0.1 + 0.3 }}
          />
        </div>
        
        <motion.div
          className={cn(
            "flex items-center justify-center w-14 h-14 rounded-xl",
            styles.iconBg,
            styles.iconShadow
          )}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, delay: delay * 0.1 + 0.2, type: "spring" }}
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          <Icon className="w-7 h-7 text-white" />
        </motion.div>
      </div>

      {/* Critical pulse indicator */}
      {variant === "critical" && value > 0 && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-status-critical via-status-critical/80 to-status-critical"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: delay * 0.1 + 0.3 }}
        />
      )}

      {/* Hover glow effect */}
      <motion.div
        className={cn(
          "absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500",
          "bg-gradient-to-r from-transparent via-white/20 to-transparent"
        )}
        style={{ filter: 'blur(1px)' }}
      />
    </motion.div>
  );
};

export { StatCard };
