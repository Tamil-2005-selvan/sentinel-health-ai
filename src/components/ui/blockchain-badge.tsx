import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Shield, CheckCircle2 } from "lucide-react";

interface BlockchainBadgeProps {
  verified?: boolean;
  showIcon?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const BlockchainBadge: React.FC<BlockchainBadgeProps> = ({
  verified = true,
  showIcon = true,
  className,
  size = "md",
}) => {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  return (
    <motion.div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        verified
          ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20"
          : "bg-muted text-muted-foreground border border-border",
        sizeClasses[size],
        className
      )}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        duration: 0.4, 
        type: "spring", 
        stiffness: 200,
        delay: 0.2 
      }}
    >
      {showIcon && (
        <motion.div
          initial={{ rotate: -180, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {verified ? (
            <CheckCircle2 size={iconSizes[size]} className="text-secondary" />
          ) : (
            <Shield size={iconSizes[size]} />
          )}
        </motion.div>
      )}
      <span>{verified ? "Blockchain Verified" : "Pending"}</span>
    </motion.div>
  );
};

export { BlockchainBadge };
