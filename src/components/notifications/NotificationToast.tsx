import React, { useEffect, useRef } from "react";
import { toast } from "sonner";
import { AlertOctagon, AlertTriangle, CheckCircle, ExternalLink } from "lucide-react";
import { useNotificationStore } from "@/hooks/use-notifications";
import { StatusType } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils";

const statusConfig = {
  critical: {
    icon: AlertOctagon,
    bgColor: "bg-status-critical/10",
    textColor: "text-status-critical",
    borderColor: "border-status-critical/30",
  },
  warning: {
    icon: AlertTriangle,
    bgColor: "bg-status-warning/10",
    textColor: "text-status-warning",
    borderColor: "border-status-warning/30",
  },
  normal: {
    icon: CheckCircle,
    bgColor: "bg-status-normal/10",
    textColor: "text-status-normal",
    borderColor: "border-status-normal/30",
  },
};

export const showPatientAlert = (
  patientId: string,
  status: StatusType,
  message: string,
  riskScore: number
) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  toast.custom(
    (t) => (
      <div
        className={cn(
          "flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-xl",
          "bg-white/95 max-w-md",
          config.borderColor,
          status === "critical" && "animate-pulse-critical"
        )}
      >
        <div
          className={cn(
            "flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl",
            config.bgColor
          )}
        >
          <Icon className={cn("w-5 h-5", config.textColor)} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-foreground">{patientId}</span>
            <span
              className={cn(
                "text-xs font-medium px-2 py-0.5 rounded-full",
                config.bgColor,
                config.textColor
              )}
            >
              Risk: {riskScore}%
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{message}</p>
          <button
            className={cn(
              "flex items-center gap-1 mt-2 text-xs font-medium",
              config.textColor
            )}
            onClick={() => toast.dismiss(t)}
          >
            <ExternalLink className="w-3 h-3" />
            View Details
          </button>
        </div>
      </div>
    ),
    {
      duration: status === "critical" ? 10000 : 5000,
      position: "top-right",
    }
  );
};

// Component that simulates real-time notifications
const NotificationSimulator: React.FC = () => {
  const { addNotification } = useNotificationStore();
  const hasSimulated = useRef(false);

  useEffect(() => {
    if (hasSimulated.current) return;
    hasSimulated.current = true;

    // Simulate a critical alert after 5 seconds
    const timer1 = setTimeout(() => {
      const notification = {
        patientId: "PT-****-8472",
        status: "critical" as StatusType,
        message: "Severe arrhythmia detected - cardiac monitoring alert",
        riskScore: 94,
      };
      
      addNotification(notification);
      showPatientAlert(
        notification.patientId,
        notification.status,
        notification.message,
        notification.riskScore
      );
    }, 8000);

    // Simulate a warning after 15 seconds
    const timer2 = setTimeout(() => {
      const notification = {
        patientId: "PT-****-3291",
        status: "warning" as StatusType,
        message: "Elevated blood glucose levels detected",
        riskScore: 58,
      };
      
      addNotification(notification);
      showPatientAlert(
        notification.patientId,
        notification.status,
        notification.message,
        notification.riskScore
      );
    }, 18000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [addNotification]);

  return null;
};

export { NotificationSimulator };
