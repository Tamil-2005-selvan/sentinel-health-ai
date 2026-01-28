import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { StatCard } from "@/components/dashboard/StatCard";
import { PatientAlertCard } from "@/components/dashboard/PatientAlertCard";
import { VitalSignsCharts } from "@/components/dashboard/VitalSignsCharts";
import { PatientDistributionChart } from "@/components/dashboard/PatientDistributionChart";
import { PatientFilters, FilterState } from "@/components/dashboard/PatientFilters";
import { StatusType } from "@/components/ui/status-badge";
import { NotificationSimulator } from "@/components/notifications/NotificationToast";
import { Users, CheckCircle, AlertTriangle, AlertOctagon, Activity } from "lucide-react";

// Mock patient data - expanded for filtering demo
const allPatientAlerts = [
  {
    patientId: "PT-ICU-7823",
    status: "critical" as StatusType,
    riskScore: 89,
    timestamp: "2 min ago",
    verified: true,
    ward: "ICU",
    date: new Date(2026, 0, 28),
  },
  {
    patientId: "PT-EMR-9102",
    status: "critical" as StatusType,
    riskScore: 92,
    timestamp: "12 min ago",
    verified: true,
    ward: "Emergency",
    date: new Date(2026, 0, 28),
  },
  {
    patientId: "PT-CAR-4521",
    status: "warning" as StatusType,
    riskScore: 67,
    timestamp: "8 min ago",
    verified: true,
    ward: "Cardiology",
    date: new Date(2026, 0, 27),
  },
  {
    patientId: "PT-NEU-6293",
    status: "warning" as StatusType,
    riskScore: 58,
    timestamp: "22 min ago",
    verified: true,
    ward: "Neurology",
    date: new Date(2026, 0, 27),
  },
  {
    patientId: "PT-PED-1234",
    status: "normal" as StatusType,
    riskScore: 25,
    timestamp: "45 min ago",
    verified: true,
    ward: "Pediatrics",
    date: new Date(2026, 0, 26),
  },
  {
    patientId: "PT-ONC-5678",
    status: "warning" as StatusType,
    riskScore: 72,
    timestamp: "1 hr ago",
    verified: true,
    ward: "Oncology",
    date: new Date(2026, 0, 26),
  },
  {
    patientId: "PT-GEN-9999",
    status: "normal" as StatusType,
    riskScore: 15,
    timestamp: "2 hr ago",
    verified: true,
    ward: "General",
    date: new Date(2026, 0, 25),
  },
  {
    patientId: "PT-ICU-4444",
    status: "critical" as StatusType,
    riskScore: 95,
    timestamp: "3 hr ago",
    verified: true,
    ward: "ICU",
    date: new Date(2026, 0, 25),
  },
];

const Dashboard: React.FC = () => {
  const totalPatients = 1247;
  const normalCount = 1089;
  const warningCount = 112;
  const criticalCount = 46;

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: "all",
    ward: "All Wards",
    riskScoreRange: [0, 100],
    dateRange: { from: undefined, to: undefined },
  });

  const filteredPatients = useMemo(() => {
    return allPatientAlerts.filter((patient) => {
      // Search filter
      if (filters.search && !patient.patientId.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      // Status filter
      if (filters.status !== "all" && patient.status !== filters.status) {
        return false;
      }
      // Ward filter
      if (filters.ward !== "All Wards" && patient.ward !== filters.ward) {
        return false;
      }
      // Risk score filter
      if (patient.riskScore < filters.riskScoreRange[0] || patient.riskScore > filters.riskScoreRange[1]) {
        return false;
      }
      // Date range filter
      if (filters.dateRange.from && patient.date < filters.dateRange.from) {
        return false;
      }
      if (filters.dateRange.to && patient.date > filters.dateRange.to) {
        return false;
      }
      return true;
    });
  }, [filters]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <Navbar />
      <NotificationSimulator />

      <main className="container px-4 md:px-6 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">
              Patient Monitoring Dashboard
            </h1>
          </div>
          <p className="text-muted-foreground">
            Real-time AI-powered health status monitoring with blockchain verification
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Total Patients"
            value={totalPatients}
            icon={Users}
            variant="default"
            delay={0}
          />
          <StatCard
            title="Normal Status"
            value={normalCount}
            icon={CheckCircle}
            variant="normal"
            delay={1}
          />
          <StatCard
            title="Warning Status"
            value={warningCount}
            icon={AlertTriangle}
            variant="warning"
            delay={2}
          />
          <StatCard
            title="Critical Status"
            value={criticalCount}
            icon={AlertOctagon}
            variant="critical"
            delay={3}
          />
        </div>

        {/* Vital Signs Charts */}
        <VitalSignsCharts />

        {/* Analytics Charts */}
        <PatientDistributionChart />

        {/* Patient Alerts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Patient Alerts
              </h2>
              <p className="text-sm text-muted-foreground">
                AI-analyzed health predictions with blockchain verification
              </p>
            </div>
            <motion.div
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-full"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-sm font-medium text-secondary">Live Updates</span>
            </motion.div>
          </div>

          {/* Filters */}
          <PatientFilters filters={filters} onFiltersChange={setFilters} />

          <div className="space-y-4">
            {filteredPatients.length === 0 ? (
              <div className="glass-card p-8 text-center">
                <p className="text-muted-foreground">No patients match the current filters.</p>
              </div>
            ) : (
              filteredPatients.map((alert, index) => (
                <PatientAlertCard
                  key={alert.patientId}
                  patientId={alert.patientId}
                  status={alert.status}
                  riskScore={alert.riskScore}
                  timestamp={alert.timestamp}
                  verified={alert.verified}
                  index={index}
                />
              ))
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
