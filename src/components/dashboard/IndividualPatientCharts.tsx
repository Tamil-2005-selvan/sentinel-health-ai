import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { User, Heart, Activity, Droplets, Thermometer } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge, StatusType } from "@/components/ui/status-badge";

interface PatientVitalDataPoint {
  time: string;
  heartRate: number;
  bloodPressure: number;
  oxygenSat: number;
  temperature: number;
}

interface PatientData {
  patientId: string;
  name: string;
  age: number;
  ward: string;
  status: StatusType;
  vitals: PatientVitalDataPoint[];
}

// Generate patient-specific vital data with unique patterns
const generatePatientVitals = (
  baseHR: number,
  baseBP: number,
  baseO2: number,
  baseTemp: number,
  varianceMultiplier: number = 1
): PatientVitalDataPoint[] => {
  const now = new Date();
  return Array.from({ length: 12 }, (_, i) => {
    const time = new Date(now.getTime() - (11 - i) * 5 * 60000); // 5-minute intervals
    return {
      time: time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      heartRate: Math.round(baseHR + (Math.random() - 0.5) * 15 * varianceMultiplier),
      bloodPressure: Math.round(baseBP + (Math.random() - 0.5) * 12 * varianceMultiplier),
      oxygenSat: Math.round(Math.min(100, baseO2 + (Math.random() - 0.5) * 3 * varianceMultiplier)),
      temperature: Math.round((baseTemp + (Math.random() - 0.5) * 0.8 * varianceMultiplier) * 10) / 10,
    };
  });
};

// Three specific patients with unique data
const initialPatients: PatientData[] = [
  {
    patientId: "PT-ICU-7823",
    name: "John Morrison",
    age: 67,
    ward: "ICU",
    status: "critical",
    vitals: generatePatientVitals(92, 145, 94, 38.2, 1.5),
  },
  {
    patientId: "PT-CAR-4521",
    name: "Emily Chen",
    age: 54,
    ward: "Cardiology",
    status: "warning",
    vitals: generatePatientVitals(78, 128, 96, 37.4, 1.2),
  },
  {
    patientId: "PT-GEN-9999",
    name: "Michael Roberts",
    age: 42,
    ward: "General",
    status: "normal",
    vitals: generatePatientVitals(72, 118, 98, 36.8, 0.8),
  },
];

interface PatientVitalGraphProps {
  patient: PatientData;
  delay?: number;
}

const PatientVitalGraph: React.FC<PatientVitalGraphProps> = ({ patient, delay = 0 }) => {
  const [vitals, setVitals] = useState<PatientVitalDataPoint[]>(patient.vitals);

  // Real-time updates for this specific patient
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
      
      setVitals((prev) => {
        const lastVital = prev[prev.length - 1];
        const varianceMultiplier = patient.status === "critical" ? 1.5 : patient.status === "warning" ? 1.2 : 0.8;
        
        const newVital: PatientVitalDataPoint = {
          time: timeStr,
          heartRate: Math.round(Math.max(55, Math.min(120, lastVital.heartRate + (Math.random() - 0.5) * 8 * varianceMultiplier))),
          bloodPressure: Math.round(Math.max(90, Math.min(160, lastVital.bloodPressure + (Math.random() - 0.5) * 6 * varianceMultiplier))),
          oxygenSat: Math.round(Math.max(90, Math.min(100, lastVital.oxygenSat + (Math.random() - 0.5) * 2 * varianceMultiplier))),
          temperature: Math.round(Math.max(36, Math.min(39.5, lastVital.temperature + (Math.random() - 0.5) * 0.3 * varianceMultiplier)) * 10) / 10,
        };
        
        return [...prev.slice(1), newVital];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [patient.status]);

  const latestVitals = vitals[vitals.length - 1];
  
  const getVitalStatus = (type: string, value: number): "normal" | "warning" | "critical" => {
    switch (type) {
      case "heartRate":
        if (value < 60 || value > 100) return value < 50 || value > 110 ? "critical" : "warning";
        return "normal";
      case "bloodPressure":
        if (value < 90 || value > 140) return value < 80 || value > 160 ? "critical" : "warning";
        return "normal";
      case "oxygenSat":
        if (value < 95) return value < 92 ? "critical" : "warning";
        return "normal";
      case "temperature":
        if (value < 36.5 || value > 37.5) return value < 35.5 || value > 38.5 ? "critical" : "warning";
        return "normal";
      default:
        return "normal";
    }
  };

  const getStatusColor = (status: "normal" | "warning" | "critical") => {
    switch (status) {
      case "critical": return "text-status-critical";
      case "warning": return "text-status-warning";
      default: return "text-status-normal";
    }
  };

  return (
    <motion.div
      className="glass-card p-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.15 }}
    >
      {/* Patient Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex items-center justify-center w-12 h-12 rounded-full",
            patient.status === "critical" ? "bg-status-critical/15" :
            patient.status === "warning" ? "bg-status-warning/15" : "bg-status-normal/15"
          )}>
            <User className={cn(
              "w-6 h-6",
              patient.status === "critical" ? "text-status-critical" :
              patient.status === "warning" ? "text-status-warning" : "text-status-normal"
            )} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground">{patient.name}</h3>
              <StatusBadge status={patient.status}>{patient.status}</StatusBadge>
            </div>
            <p className="text-xs text-muted-foreground">
              {patient.patientId} • {patient.ward} • Age {patient.age}
            </p>
          </div>
        </div>
      </div>

      {/* Current Vitals Summary */}
      <div className="grid grid-cols-4 gap-2 mb-4 p-3 rounded-lg bg-muted/30">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Heart className="w-3.5 h-3.5 text-red-500" />
            <span className="text-xs text-muted-foreground">HR</span>
          </div>
          <p className={cn("text-lg font-bold", getStatusColor(getVitalStatus("heartRate", latestVitals.heartRate)))}>
            {latestVitals.heartRate}
          </p>
          <p className="text-[10px] text-muted-foreground">BPM</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Activity className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs text-muted-foreground">BP</span>
          </div>
          <p className={cn("text-lg font-bold", getStatusColor(getVitalStatus("bloodPressure", latestVitals.bloodPressure)))}>
            {latestVitals.bloodPressure}
          </p>
          <p className="text-[10px] text-muted-foreground">mmHg</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Droplets className="w-3.5 h-3.5 text-secondary" />
            <span className="text-xs text-muted-foreground">SpO₂</span>
          </div>
          <p className={cn("text-lg font-bold", getStatusColor(getVitalStatus("oxygenSat", latestVitals.oxygenSat)))}>
            {latestVitals.oxygenSat}%
          </p>
          <p className="text-[10px] text-muted-foreground">Sat</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Thermometer className="w-3.5 h-3.5 text-orange-500" />
            <span className="text-xs text-muted-foreground">Temp</span>
          </div>
          <p className={cn("text-lg font-bold", getStatusColor(getVitalStatus("temperature", latestVitals.temperature)))}>
            {latestVitals.temperature}°
          </p>
          <p className="text-[10px] text-muted-foreground">Celsius</p>
        </div>
      </div>

      {/* Vital Signs Chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={vitals} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
              interval="preserveStartEnd"
            />
            <YAxis
              yAxisId="left"
              domain={[50, 130]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[88, 102]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
              hide
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                fontSize: "12px",
              }}
              labelStyle={{ color: "hsl(var(--foreground))", fontWeight: "bold" }}
            />
            <Legend 
              wrapperStyle={{ fontSize: "10px" }}
              iconSize={8}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="heartRate"
              name="Heart Rate"
              stroke="hsl(0, 84%, 60%)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 3 }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="bloodPressure"
              name="Blood Pressure"
              stroke="hsl(217, 91%, 60%)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 3 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="oxygenSat"
              name="SpO₂"
              stroke="hsl(173, 80%, 40%)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

const IndividualPatientCharts: React.FC = () => {
  const [patients] = useState<PatientData[]>(initialPatients);

  return (
    <motion.div
      className="mt-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Individual Patient Vitals
          </h2>
          <p className="text-sm text-muted-foreground">
            Raw patient-specific vital signs data (not aggregated)
          </p>
        </div>
        <motion.div
          className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full"
          animate={{ opacity: [1, 0.7, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-xs font-medium text-primary">Live Updates</span>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {patients.map((patient, index) => (
          <PatientVitalGraph
            key={patient.patientId}
            patient={patient}
            delay={index}
          />
        ))}
      </div>
    </motion.div>
  );
};

export { IndividualPatientCharts };
