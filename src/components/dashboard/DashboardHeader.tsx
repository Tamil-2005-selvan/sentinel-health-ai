import React from "react";
import { motion } from "framer-motion";
import { Activity, Shield, Brain, Cpu } from "lucide-react";
import { BlockchainBadge } from "@/components/ui/blockchain-badge";

export const DashboardHeader: React.FC = () => {
  return (
    <motion.div
      className="mb-10"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Brand and Title */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-4">
        <div>
          {/* System badge */}
          <motion.div 
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-1">
              <Brain className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium text-primary">AI-Powered</span>
            </div>
            <div className="w-px h-3 bg-primary/30" />
            <div className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-secondary" />
              <span className="text-xs font-medium text-secondary">Blockchain Secured</span>
            </div>
          </motion.div>

          {/* Main title */}
          <div className="flex items-center gap-3 mb-2">
            <div className="relative">
              <motion.div
                className="absolute inset-0 rounded-xl bg-primary/20 blur-xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary shadow-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
                <span className="text-foreground">ISMS</span>
                <span className="text-muted-foreground font-medium"> Dashboard</span>
              </h1>
              <p className="text-sm text-muted-foreground hidden sm:block">
                Intelligent Secure Patient Health Monitoring System
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Subheading with metrics bar */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-white/40 backdrop-blur-sm border border-white/50 shadow-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-sm text-muted-foreground flex-1">
          Real-time monitoring of patient vital signs with{" "}
          <span className="font-medium text-primary">machine learning predictions</span> and{" "}
          <span className="font-medium text-secondary">immutable audit trails</span>
        </p>
      </motion.div>
    </motion.div>
  );
};
