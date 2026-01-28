import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type StatusType = "normal" | "warning" | "critical";

interface StatusBadgeProps {
  status: StatusType;
  children: React.ReactNode;
  pulse?: boolean;
  className?: string;
}

const statusStyles: Record<StatusType, string> = {
  normal: "bg-status-normal text-white",
  warning: "bg-status-warning text-white",
  critical: "bg-status-critical text-white",
};

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  children,
  pulse = false,
  className,
}) => {
  const shouldPulse = pulse || status === "critical";

  return (
    <motion.span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold",
        statusStyles[status],
        shouldPulse && status === "critical" && "animate-pulse-critical",
        className
      )}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <span
        className={cn(
          "w-2 h-2 rounded-full mr-2",
          status === "normal" && "bg-green-300",
          status === "warning" && "bg-yellow-300",
          status === "critical" && "bg-red-300"
        )}
      />
      {children}
    </motion.span>
  );
};

export { StatusBadge, type StatusType };
