import React, { useState, useMemo } from "react";
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
  ReferenceLine,
  Area,
  AreaChart,
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Heart,
  Activity,
  Droplets,
  Thermometer,
  Calendar as CalendarIcon,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge, StatusType } from "@/components/ui/status-badge";
import { format, subDays, subHours, isWithinInterval, startOfDay, endOfDay } from "date-fns";

interface VitalDataPoint {
  timestamp: Date;
  time: string;
  heartRate: number;
  bloodPressure: number;
  oxygenSat: number;
  temperature: number;
}

interface PatientInfo {
  patientId: string;
  name: string;
  age: number;
  ward: string;
  status: StatusType;
}

interface PatientVitalsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: PatientInfo;
}

// Generate extended historical data for a patient
const generateHistoricalData = (
  patient: PatientInfo,
  days: number = 7
): VitalDataPoint[] => {
  const now = new Date();
  const dataPoints: VitalDataPoint[] = [];
  const hoursTotal = days * 24;
  
  // Base values vary by patient status
  const baseHR = patient.status === "critical" ? 95 : patient.status === "warning" ? 82 : 72;
  const baseBP = patient.status === "critical" ? 145 : patient.status === "warning" ? 130 : 118;
  const baseO2 = patient.status === "critical" ? 93 : patient.status === "warning" ? 96 : 98;
  const baseTemp = patient.status === "critical" ? 38.4 : patient.status === "warning" ? 37.6 : 36.9;
  
  for (let i = hoursTotal; i >= 0; i -= 1) {
    const timestamp = subHours(now, i);
    // Add some daily pattern variation
    const hourOfDay = timestamp.getHours();
    const dailyVariation = Math.sin((hourOfDay / 24) * Math.PI * 2) * 5;
    
    dataPoints.push({
      timestamp,
      time: format(timestamp, "MMM d, HH:mm"),
      heartRate: Math.round(baseHR + dailyVariation + (Math.random() - 0.5) * 15),
      bloodPressure: Math.round(baseBP + dailyVariation + (Math.random() - 0.5) * 12),
      oxygenSat: Math.round(Math.min(100, Math.max(88, baseO2 + (Math.random() - 0.5) * 4))),
      temperature: Math.round((baseTemp + (Math.random() - 0.5) * 0.8) * 10) / 10,
    });
  }
  
  return dataPoints;
};

// Calculate trend analysis
const calculateTrend = (data: number[]): { direction: "up" | "down" | "stable"; percentage: number } => {
  if (data.length < 2) return { direction: "stable", percentage: 0 };
  
  const firstHalf = data.slice(0, Math.floor(data.length / 2));
  const secondHalf = data.slice(Math.floor(data.length / 2));
  
  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  
  const percentChange = ((secondAvg - firstAvg) / firstAvg) * 100;
  
  if (Math.abs(percentChange) < 2) return { direction: "stable", percentage: Math.abs(percentChange) };
  return {
    direction: percentChange > 0 ? "up" : "down",
    percentage: Math.abs(percentChange),
  };
};

const TrendIndicator: React.FC<{ 
  trend: { direction: "up" | "down" | "stable"; percentage: number };
  positiveIsGood?: boolean;
}> = ({ trend, positiveIsGood = false }) => {
  const isGood = trend.direction === "stable" || 
    (positiveIsGood && trend.direction === "up") || 
    (!positiveIsGood && trend.direction === "down");
  
  return (
    <div className={cn(
      "flex items-center gap-1 text-sm font-medium",
      isGood ? "text-status-normal" : "text-status-warning"
    )}>
      {trend.direction === "up" && <TrendingUp className="w-4 h-4" />}
      {trend.direction === "down" && <TrendingDown className="w-4 h-4" />}
      {trend.direction === "stable" && <Minus className="w-4 h-4" />}
      <span>{trend.percentage.toFixed(1)}%</span>
    </div>
  );
};

type DateRangePreset = "24h" | "48h" | "7d" | "14d" | "30d" | "custom";

const PatientVitalsModal: React.FC<PatientVitalsModalProps> = ({
  open,
  onOpenChange,
  patient,
}) => {
  const [dateRangePreset, setDateRangePreset] = useState<DateRangePreset>("7d");
  const [customDateRange, setCustomDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [selectedVital, setSelectedVital] = useState<"heartRate" | "bloodPressure" | "oxygenSat" | "temperature">("heartRate");

  // Generate historical data
  const allData = useMemo(() => generateHistoricalData(patient, 30), [patient]);

  // Filter data based on date range
  const filteredData = useMemo(() => {
    let fromDate: Date;
    let toDate = new Date();

    switch (dateRangePreset) {
      case "24h":
        fromDate = subHours(toDate, 24);
        break;
      case "48h":
        fromDate = subHours(toDate, 48);
        break;
      case "7d":
        fromDate = subDays(toDate, 7);
        break;
      case "14d":
        fromDate = subDays(toDate, 14);
        break;
      case "30d":
        fromDate = subDays(toDate, 30);
        break;
      case "custom":
        fromDate = customDateRange.from || subDays(toDate, 7);
        toDate = customDateRange.to || new Date();
        break;
      default:
        fromDate = subDays(toDate, 7);
    }

    return allData.filter((point) =>
      isWithinInterval(point.timestamp, { start: startOfDay(fromDate), end: endOfDay(toDate) })
    );
  }, [allData, dateRangePreset, customDateRange]);

  // Calculate statistics
  const statistics = useMemo(() => {
    const hrValues = filteredData.map((d) => d.heartRate);
    const bpValues = filteredData.map((d) => d.bloodPressure);
    const o2Values = filteredData.map((d) => d.oxygenSat);
    const tempValues = filteredData.map((d) => d.temperature);

    const calcStats = (values: number[]) => ({
      min: Math.min(...values),
      max: Math.max(...values),
      avg: Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10,
      trend: calculateTrend(values),
    });

    return {
      heartRate: calcStats(hrValues),
      bloodPressure: calcStats(bpValues),
      oxygenSat: calcStats(o2Values),
      temperature: calcStats(tempValues),
    };
  }, [filteredData]);

  const vitalConfig = {
    heartRate: {
      label: "Heart Rate",
      unit: "BPM",
      color: "hsl(0, 84%, 60%)",
      icon: Heart,
      normalRange: { min: 60, max: 100 },
      positiveIsGood: false,
    },
    bloodPressure: {
      label: "Blood Pressure (Systolic)",
      unit: "mmHg",
      color: "hsl(217, 91%, 60%)",
      icon: Activity,
      normalRange: { min: 90, max: 140 },
      positiveIsGood: false,
    },
    oxygenSat: {
      label: "Oxygen Saturation",
      unit: "%",
      color: "hsl(173, 80%, 40%)",
      icon: Droplets,
      normalRange: { min: 95, max: 100 },
      positiveIsGood: true,
    },
    temperature: {
      label: "Body Temperature",
      unit: "°C",
      color: "hsl(32, 95%, 44%)",
      icon: Thermometer,
      normalRange: { min: 36.5, max: 37.5 },
      positiveIsGood: false,
    },
  };

  const currentConfig = vitalConfig[selectedVital];
  const currentStats = statistics[selectedVital];

  const handleExport = () => {
    const csvContent = [
      "Timestamp,Heart Rate,Blood Pressure,SpO2,Temperature",
      ...filteredData.map(
        (d) => `${d.time},${d.heartRate},${d.bloodPressure},${d.oxygenSat},${d.temperature}`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${patient.patientId}-vitals-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
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
                <DialogTitle className="flex items-center gap-2">
                  {patient.name}
                  <StatusBadge status={patient.status}>{patient.status}</StatusBadge>
                </DialogTitle>
                <p className="text-sm text-muted-foreground">
                  {patient.patientId} • {patient.ward} • Age {patient.age}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>
        </DialogHeader>

        {/* Date Range Selection */}
        <div className="flex flex-wrap items-center gap-2 py-4 border-b">
          <span className="text-sm font-medium text-muted-foreground">Time Range:</span>
          <div className="flex flex-wrap gap-2">
            {(["24h", "48h", "7d", "14d", "30d"] as DateRangePreset[]).map((preset) => (
              <Button
                key={preset}
                variant={dateRangePreset === preset ? "default" : "outline"}
                size="sm"
                onClick={() => setDateRangePreset(preset)}
              >
                {preset}
              </Button>
            ))}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={dateRangePreset === "custom" ? "default" : "outline"}
                  size="sm"
                  className="gap-2"
                  onClick={() => setDateRangePreset("custom")}
                >
                  <CalendarIcon className="w-4 h-4" />
                  Custom
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={{ from: customDateRange.from, to: customDateRange.to }}
                  onSelect={(range) => {
                    setCustomDateRange({ from: range?.from, to: range?.to });
                    setDateRangePreset("custom");
                  }}
                  numberOfMonths={2}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Vital Signs Tabs */}
        <Tabs value={selectedVital} onValueChange={(v) => setSelectedVital(v as typeof selectedVital)}>
          <TabsList className="grid w-full grid-cols-4">
            {Object.entries(vitalConfig).map(([key, config]) => (
              <TabsTrigger key={key} value={key} className="gap-2">
                <config.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{config.label.split(" ")[0]}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(vitalConfig).map(([key, config]) => (
            <TabsContent key={key} value={key} className="space-y-4">
              {/* Statistics Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.div
                  className="p-4 rounded-lg border bg-card"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0 }}
                >
                  <p className="text-xs text-muted-foreground mb-1">Average</p>
                  <p className="text-2xl font-bold" style={{ color: config.color }}>
                    {statistics[key as keyof typeof statistics].avg}
                    <span className="text-sm font-normal text-muted-foreground ml-1">{config.unit}</span>
                  </p>
                </motion.div>
                <motion.div
                  className="p-4 rounded-lg border bg-card"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                >
                  <p className="text-xs text-muted-foreground mb-1">Min / Max</p>
                  <p className="text-xl font-bold text-foreground">
                    {statistics[key as keyof typeof statistics].min} - {statistics[key as keyof typeof statistics].max}
                    <span className="text-sm font-normal text-muted-foreground ml-1">{config.unit}</span>
                  </p>
                </motion.div>
                <motion.div
                  className="p-4 rounded-lg border bg-card"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <p className="text-xs text-muted-foreground mb-1">Trend</p>
                  <TrendIndicator 
                    trend={statistics[key as keyof typeof statistics].trend}
                    positiveIsGood={config.positiveIsGood}
                  />
                </motion.div>
                <motion.div
                  className="p-4 rounded-lg border bg-card"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <p className="text-xs text-muted-foreground mb-1">Normal Range</p>
                  <p className="text-lg font-medium text-foreground">
                    {config.normalRange.min} - {config.normalRange.max}
                    <span className="text-sm font-normal text-muted-foreground ml-1">{config.unit}</span>
                  </p>
                </motion.div>
              </div>

              {/* Alert Banner */}
              {(statistics[key as keyof typeof statistics].avg < config.normalRange.min ||
                statistics[key as keyof typeof statistics].avg > config.normalRange.max) && (
                <motion.div
                  className="flex items-center gap-3 p-3 rounded-lg bg-status-warning/10 border border-status-warning/30"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <AlertTriangle className="w-5 h-5 text-status-warning" />
                  <p className="text-sm text-status-warning">
                    Average {config.label.toLowerCase()} is outside the normal range. Consider medical review.
                  </p>
                </motion.div>
              )}

              {/* Main Chart */}
              <motion.div
                className="h-80 p-4 rounded-lg border bg-card"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={filteredData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={config.color} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={config.color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="time"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      domain={[
                        config.normalRange.min - 15,
                        config.normalRange.max + 15,
                      ]}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                      formatter={(value: number) => [`${value} ${config.unit}`, config.label]}
                    />
                    <ReferenceLine
                      y={config.normalRange.min}
                      stroke="hsl(var(--status-warning))"
                      strokeDasharray="5 5"
                      label={{ value: "Min", fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                    />
                    <ReferenceLine
                      y={config.normalRange.max}
                      stroke="hsl(var(--status-warning))"
                      strokeDasharray="5 5"
                      label={{ value: "Max", fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                    />
                    <Area
                      type="monotone"
                      dataKey={key}
                      stroke={config.color}
                      strokeWidth={2}
                      fill={`url(#gradient-${key})`}
                      dot={false}
                      activeDot={{ r: 5, fill: config.color, stroke: "white", strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Data Points Count */}
              <p className="text-xs text-muted-foreground text-center">
                Showing {filteredData.length} data points from {dateRangePreset === "custom" && customDateRange.from 
                  ? format(customDateRange.from, "PPP")
                  : format(filteredData[0]?.timestamp || new Date(), "PPP")} to {format(filteredData[filteredData.length - 1]?.timestamp || new Date(), "PPP")}
              </p>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export { PatientVitalsModal };
export type { PatientInfo };
