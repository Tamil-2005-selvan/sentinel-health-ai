import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { StatusBadge, StatusType } from "@/components/ui/status-badge";
import { BlockchainBadge } from "@/components/ui/blockchain-badge";
import { Button } from "@/components/ui/button";
import { Clock, TrendingUp, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface PatientAlertCardProps {
  patientId: string;
  status: StatusType;
  riskScore: number;
  timestamp: string;
  verified: boolean;
  index?: number;
}

const PatientAlertCard: React.FC<PatientAlertCardProps> = ({
  patientId,
  status,
  riskScore,
  timestamp,
  verified,
  index = 0,
}) => {
  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-xl p-5 bg-white/70 backdrop-blur-xl",
        "border border-white/20 shadow-md hover:shadow-xl transition-all duration-300",
        status === "critical" && "border-status-critical/30 animate-pulse-critical"
      )}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ scale: 1.01, x: 4 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-lg font-semibold text-foreground">
              {patientId}
            </h3>
            <StatusBadge status={status} pulse={status === "critical"}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </StatusBadge>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              <span>Risk Score: <strong className={cn(
                status === "normal" && "text-status-normal",
                status === "warning" && "text-status-warning",
                status === "critical" && "text-status-critical"
              )}>{riskScore}%</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{timestamp}</span>
            </div>
          </div>

          <BlockchainBadge verified={verified} size="sm" />
        </div>

        <Link to={`/patient-detail?id=${patientId}`}>
          <Button
            variant="outline"
            className="gap-2 border-primary/20 hover:bg-primary/5 hover:border-primary/40"
          >
            <Eye className="w-4 h-4" />
            View Details
          </Button>
        </Link>
      </div>

      {status === "critical" && (
        <motion.div
          className="absolute left-0 top-0 bottom-0 w-1 bg-status-critical"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.4, delay: index * 0.08 + 0.2 }}
        />
      )}
    </motion.div>
  );
};

export { PatientAlertCard };
