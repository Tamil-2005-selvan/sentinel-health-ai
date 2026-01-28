import React, { useState, useMemo, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { StatCard } from "@/components/dashboard/StatCard";
import { PatientAlertCard } from "@/components/dashboard/PatientAlertCard";
import { VitalSignsCharts } from "@/components/dashboard/VitalSignsCharts";
import { PatientDistributionChart } from "@/components/dashboard/PatientDistributionChart";
import { PatientFilters, FilterState } from "@/components/dashboard/PatientFilters";
import { BulkActionsToolbar, BulkActionsToolbarRef } from "@/components/dashboard/BulkActionsToolbar";
import { KeyboardShortcutsHelp } from "@/components/dashboard/KeyboardShortcutsHelp";
import { StatusType } from "@/components/ui/status-badge";
import { NotificationSimulator } from "@/components/notifications/NotificationToast";
import { Checkbox } from "@/components/ui/checkbox";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
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

  const [selectedPatients, setSelectedPatients] = useState<Set<string>>(new Set());
  const [acknowledgedPatients, setAcknowledgedPatients] = useState<Set<string>>(new Set());
  const [patientWards, setPatientWards] = useState<Record<string, string>>({});
  
  const bulkActionsRef = useRef<BulkActionsToolbarRef>(null);

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
      // Ward filter - check both original and assigned ward
      const currentWard = patientWards[patient.patientId] || patient.ward;
      if (filters.ward !== "All Wards" && currentWard !== filters.ward) {
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
  }, [filters, patientWards]);

  const handleSelectPatient = useCallback((patientId: string, selected: boolean) => {
    setSelectedPatients(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(patientId);
      } else {
        newSet.delete(patientId);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      setSelectedPatients(new Set(filteredPatients.map(p => p.patientId)));
    } else {
      setSelectedPatients(new Set());
    }
  }, [filteredPatients]);

  const handleClearSelection = useCallback(() => {
    setSelectedPatients(new Set());
  }, []);

  const handleAcknowledge = useCallback((ids: string[]) => {
    setAcknowledgedPatients(prev => {
      const newSet = new Set(prev);
      ids.forEach(id => newSet.add(id));
      return newSet;
    });
  }, []);

  const handleAssignWard = useCallback((ids: string[], ward: string) => {
    setPatientWards(prev => {
      const updated = { ...prev };
      ids.forEach(id => {
        updated[id] = ward;
      });
      return updated;
    });
  }, []);

  const handleExport = useCallback((ids: string[]) => {
    console.log("Exported patients:", ids);
  }, []);

  const allSelected = filteredPatients.length > 0 && filteredPatients.every(p => selectedPatients.has(p.patientId));
  const someSelected = filteredPatients.some(p => selectedPatients.has(p.patientId)) && !allSelected;

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onSelectAll: () => handleSelectAll(true),
    onAcknowledge: () => bulkActionsRef.current?.triggerAcknowledge(),
    onExport: () => bulkActionsRef.current?.triggerExport(),
    onClearSelection: handleClearSelection,
    hasSelection: selectedPatients.size > 0,
  });

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
              <h2 className="text-xl font-semibold text-foreground" id="patient-alerts-heading">
                Patient Alerts
              </h2>
              <p className="text-sm text-muted-foreground">
                AI-analyzed health predictions with blockchain verification
              </p>
            </div>
            <div className="flex items-center gap-2">
              <KeyboardShortcutsHelp />
              <motion.div
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-full"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                aria-label="Live updates indicator"
              >
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" aria-hidden="true" />
                <span className="text-sm font-medium text-secondary">Live Updates</span>
              </motion.div>
            </div>
          </div>

          {/* Filters */}
          <PatientFilters filters={filters} onFiltersChange={setFilters} />

          {/* Bulk Actions Toolbar */}
          <BulkActionsToolbar
            ref={bulkActionsRef}
            selectedCount={selectedPatients.size}
            selectedIds={Array.from(selectedPatients)}
            onClearSelection={handleClearSelection}
            onAcknowledge={handleAcknowledge}
            onAssignWard={handleAssignWard}
            onExport={handleExport}
          />

          {/* Select All Header */}
          {filteredPatients.length > 0 && (
            <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-muted/30">
              <Checkbox
                checked={allSelected}
                ref={(el) => {
                  if (el) {
                    (el as HTMLButtonElement & { indeterminate?: boolean }).indeterminate = someSelected;
                  }
                }}
                onCheckedChange={handleSelectAll}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <span className="text-sm text-muted-foreground">
                {allSelected 
                  ? `All ${filteredPatients.length} patients selected` 
                  : someSelected 
                    ? `${selectedPatients.size} of ${filteredPatients.length} selected`
                    : "Select all patients"}
              </span>
            </div>
          )}

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
                  selectable={true}
                  selected={selectedPatients.has(alert.patientId)}
                  onSelectionChange={(selected) => handleSelectPatient(alert.patientId, selected)}
                  acknowledged={acknowledgedPatients.has(alert.patientId)}
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
