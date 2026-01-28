import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { StatusBadge, StatusType } from "@/components/ui/status-badge";
import { BlockchainBadge } from "@/components/ui/blockchain-badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, TrendingUp, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface PatientAlertCardProps {
  patientId: string;
  status: StatusType;
  riskScore: number;
  timestamp: string;
  verified: boolean;
  index?: number;
  selectable?: boolean;
  selected?: boolean;
  onSelectionChange?: (selected: boolean) => void;
  acknowledged?: boolean;
}

const PatientAlertCard: React.FC<PatientAlertCardProps> = ({
  patientId,
  status,
  riskScore,
  timestamp,
  verified,
  index = 0,
  selectable = false,
  selected = false,
  onSelectionChange,
  acknowledged = false,
}) => {
  const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);
  
  return (
    <motion.article
      className={cn(
        "relative overflow-hidden rounded-xl p-5 bg-white/70 backdrop-blur-xl",
        "border border-white/20 shadow-md hover:shadow-xl transition-all duration-300",
        status === "critical" && !acknowledged && "border-status-critical/30 animate-pulse-critical",
        selected && "ring-2 ring-primary border-primary/40 bg-primary/5",
        acknowledged && "opacity-60"
      )}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ scale: 1.01, x: 4 }}
      aria-label={`Patient ${patientId}, ${statusLabel} status, risk score ${riskScore}%${acknowledged ? ", acknowledged" : ""}`}
      role="article"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          {selectable && (
            <div className="pt-1">
              <Checkbox
                checked={selected}
                onCheckedChange={(checked) => onSelectionChange?.(checked as boolean)}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                aria-label={`Select patient ${patientId}`}
              />
            </div>
          )}
          
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-lg font-semibold text-foreground">
                {patientId}
              </h3>
              <StatusBadge status={status} pulse={status === "critical" && !acknowledged}>
                {statusLabel}
              </StatusBadge>
              {acknowledged && (
                <span 
                  className="text-xs px-2 py-0.5 rounded-full bg-secondary/20 text-secondary font-medium"
                  aria-label="Alert acknowledged"
                >
                  Acknowledged
                </span>
              )}
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" aria-hidden="true" />
                <span>Risk Score: <strong className={cn(
                  status === "normal" && "text-status-normal",
                  status === "warning" && "text-status-warning",
                  status === "critical" && "text-status-critical"
                )}>{riskScore}%</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" aria-hidden="true" />
                <time>{timestamp}</time>
              </div>
            </div>

            <BlockchainBadge verified={verified} size="sm" />
          </div>
        </div>

        <Link to={`/patient-detail?id=${patientId}`} aria-label={`View details for patient ${patientId}`}>
          <Button
            variant="outline"
            className="gap-2 border-primary/20 hover:bg-primary/5 hover:border-primary/40"
          >
            <Eye className="w-4 h-4" aria-hidden="true" />
            View Details
          </Button>
        </Link>
      </div>

      {status === "critical" && !acknowledged && (
        <motion.div
          className="absolute left-0 top-0 bottom-0 w-1 bg-status-critical"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.4, delay: index * 0.08 + 0.2 }}
          aria-hidden="true"
        />
      )}
    </motion.article>
  );
};

export { PatientAlertCard };
