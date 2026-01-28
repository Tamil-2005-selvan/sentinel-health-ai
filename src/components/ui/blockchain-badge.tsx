import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Shield, CheckCircle2, Link2 } from "lucide-react";

interface BlockchainBadgeProps {
  verified?: boolean;
  showIcon?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
  showChainLink?: boolean;
}

const BlockchainBadge: React.FC<BlockchainBadgeProps> = ({
  verified = true,
  showIcon = true,
  className,
  size = "md",
  showChainLink = true,
}) => {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1.5 text-xs",
    lg: "px-4 py-2 text-sm",
  };

  const iconSizes = {
    sm: 10,
    md: 12,
    lg: 14,
  };

  return (
    <motion.div
      className={cn(
        "inline-flex items-center gap-2 rounded-lg font-medium",
        "backdrop-blur-sm shadow-sm",
        verified
          ? "bg-gradient-to-r from-secondary/10 via-secondary/5 to-primary/10 text-secondary border border-secondary/20"
          : "bg-muted/80 text-muted-foreground border border-border",
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
      {showChainLink && (
        <motion.div
          className="flex items-center gap-0.5 opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.5 }}
        >
          <div className="w-1 h-1 rounded-full bg-secondary" />
          <div className="w-2 h-px bg-secondary" />
          <div className="w-1 h-1 rounded-full bg-secondary" />
          <div className="w-2 h-px bg-secondary" />
          <div className="w-1 h-1 rounded-full bg-secondary" />
        </motion.div>
      )}
      
      {showIcon && (
        <motion.div
          className="relative"
          initial={{ rotate: -180, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {verified ? (
            <CheckCircle2 size={iconSizes[size]} className="text-secondary" />
          ) : (
            <Shield size={iconSizes[size]} />
          )}
          {verified && (
            <motion.div
              className="absolute inset-0 rounded-full bg-secondary/30"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.div>
      )}
      
      <span className="font-semibold tracking-wide">
        {verified ? "Verified" : "Pending"}
      </span>
      
      {verified && (
        <Link2 size={iconSizes[size]} className="opacity-60" />
      )}
    </motion.div>
  );
};

export { BlockchainBadge };
