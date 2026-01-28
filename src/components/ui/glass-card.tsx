import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  variant?: "default" | "elevated" | "bordered";
  hover?: boolean;
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, children, variant = "default", hover = true, ...props }, ref) => {
    const variants = {
      default: "bg-white/70 backdrop-blur-xl border border-white/20",
      elevated: "bg-white/80 backdrop-blur-xl border border-white/30 shadow-lg",
      bordered: "bg-white/60 backdrop-blur-xl border-2 border-primary/20",
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "rounded-xl p-6",
          variants[variant],
          hover && "transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = "GlassCard";

export { GlassCard };
