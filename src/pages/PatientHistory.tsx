import React from "react";
import { motion } from "framer-motion";
import { useSearchParams, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { StatusBadge, StatusType } from "@/components/ui/status-badge";
import { BlockchainBadge } from "@/components/ui/blockchain-badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Clock, 
  TrendingUp, 
  Brain, 
  FileText,
  Activity
} from "lucide-react";

// Mock history data
const patientHistory = [
  {
    id: 1,
    timestamp: "2026-01-28 14:32:00",
    status: "critical" as StatusType,
    riskScore: 89,
    reason: "Elevated heart rate patterns detected. ML model predicts potential cardiac stress.",
    verified: true,
  },
  {
    id: 2,
    timestamp: "2026-01-28 12:15:00",
    status: "warning" as StatusType,
    riskScore: 62,
    reason: "Blood pressure variance detected. Monitoring for hypertension indicators.",
    verified: true,
  },
  {
    id: 3,
    timestamp: "2026-01-28 08:45:00",
    status: "normal" as StatusType,
    riskScore: 28,
    reason: "All vital signs within normal parameters. Regular monitoring continues.",
    verified: true,
  },
  {
    id: 4,
    timestamp: "2026-01-27 22:10:00",
    status: "warning" as StatusType,
    riskScore: 55,
    reason: "Oxygen saturation fluctuation observed. AI recommends increased monitoring.",
    verified: true,
  },
  {
    id: 5,
    timestamp: "2026-01-27 16:30:00",
    status: "normal" as StatusType,
    riskScore: 18,
    reason: "Routine health check complete. Patient status stable.",
    verified: true,
  },
  {
    id: 6,
    timestamp: "2026-01-27 10:00:00",
    status: "normal" as StatusType,
    riskScore: 22,
    reason: "Morning vital signs recorded. All metrics within expected ranges.",
    verified: true,
  },
];

const PatientHistory: React.FC = () => {
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get("id") || "PT-****-7823";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <Navbar />

      <main className="container px-4 md:px-6 py-8">
        {/* Back Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link to="/dashboard">
            <Button
              variant="ghost"
              className="mb-6 gap-2 hover:bg-primary/5"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>
        </motion.div>

        {/* Patient Header */}
        <motion.div
          className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-8 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-glow">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{patientId}</h1>
                <p className="text-muted-foreground">Medical History Timeline</p>
              </div>
            </div>
            <BlockchainBadge verified size="lg" />
          </div>
        </motion.div>

        {/* Timeline Header */}
        <motion.div
          className="flex items-center gap-3 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Brain className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">
            AI/ML Health Predictions
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <motion.div
            className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-muted"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          />

          <div className="space-y-6">
            {patientHistory.map((record, index) => (
              <motion.div
                key={record.id}
                className="relative pl-16"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              >
                {/* Timeline Dot */}
                <motion.div
                  className={`absolute left-4 w-5 h-5 rounded-full border-4 border-background shadow-md ${
                    record.status === "critical"
                      ? "bg-status-critical"
                      : record.status === "warning"
                      ? "bg-status-warning"
                      : "bg-status-normal"
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1, type: "spring" }}
                />

                {/* Card */}
                <div className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3 flex-wrap">
                      <StatusBadge status={record.status}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </StatusBadge>
                      <BlockchainBadge verified={record.verified} size="sm" />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4" />
                        <span>Risk: <strong className={
                          record.status === "critical"
                            ? "text-status-critical"
                            : record.status === "warning"
                            ? "text-status-warning"
                            : "text-status-normal"
                        }>{record.riskScore}%</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>{record.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <p className="text-foreground">{record.reason}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientHistory;
