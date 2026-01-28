import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useSearchParams, Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend,
} from "recharts";
import { Navbar } from "@/components/layout/Navbar";
import { StatusBadge, StatusType } from "@/components/ui/status-badge";
import { BlockchainBadge } from "@/components/ui/blockchain-badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Download,
  Heart,
  Activity,
  Droplets,
  Thermometer,
  Clock,
  Brain,
  FileText,
  TrendingUp,
  Calendar,
  User,
  Shield,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Generate mock vital history data
const generateVitalHistory = (baseValue: number, variance: number, hours: number = 24) => {
  const now = new Date();
  return Array.from({ length: hours * 4 }, (_, i) => {
    const time = new Date(now.getTime() - (hours * 4 - 1 - i) * 15 * 60 * 1000);
    return {
      time: time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      fullTime: time.toLocaleString(),
      value: Math.round(baseValue + (Math.random() - 0.5) * variance + Math.sin(i / 10) * (variance / 3)),
    };
  });
};

// Mock patient data
const getPatientData = (id: string) => ({
  id,
  name: "Patient " + id.slice(-4),
  age: 58,
  gender: "Male",
  admissionDate: "2026-01-25",
  ward: "ICU-3",
  bed: "Bed 12",
  attendingPhysician: "Dr. Emily Chen",
  status: "critical" as StatusType,
  currentRiskScore: 89,
  bloodType: "A+",
  allergies: ["Penicillin", "Sulfa drugs"],
  conditions: ["Hypertension", "Type 2 Diabetes", "Coronary Artery Disease"],
});

// Mock medical records
const medicalRecords = [
  {
    id: 1,
    timestamp: "2026-01-28 14:32:00",
    type: "AI Prediction",
    status: "critical" as StatusType,
    riskScore: 89,
    title: "Cardiac Stress Alert",
    description: "ML model detected elevated heart rate patterns indicating potential cardiac stress. Recommended immediate evaluation.",
    verified: true,
  },
  {
    id: 2,
    timestamp: "2026-01-28 10:15:00",
    type: "Lab Results",
    status: "warning" as StatusType,
    riskScore: 67,
    title: "Blood Work Analysis",
    description: "Troponin levels slightly elevated (0.08 ng/mL). BNP within normal range. Lipid panel shows elevated LDL.",
    verified: true,
  },
  {
    id: 3,
    timestamp: "2026-01-27 22:45:00",
    type: "Vital Alert",
    status: "warning" as StatusType,
    riskScore: 58,
    title: "Blood Pressure Fluctuation",
    description: "Systolic BP reached 165 mmHg. AI model recommends medication adjustment review.",
    verified: true,
  },
  {
    id: 4,
    timestamp: "2026-01-27 14:00:00",
    type: "Medication",
    status: "normal" as StatusType,
    riskScore: 25,
    title: "Medication Administered",
    description: "Metoprolol 50mg administered as scheduled. Patient vitals stable post-administration.",
    verified: true,
  },
  {
    id: 5,
    timestamp: "2026-01-26 09:30:00",
    type: "Imaging",
    status: "normal" as StatusType,
    riskScore: 30,
    title: "ECG Analysis Complete",
    description: "12-lead ECG performed. AI analysis shows normal sinus rhythm with occasional PVCs.",
    verified: true,
  },
];

const PatientDetail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get("id") || "PT-****-7823";
  const patient = getPatientData(patientId);
  const reportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const [heartRateData] = useState(() => generateVitalHistory(78, 25, 24));
  const [bpSystolicData] = useState(() => generateVitalHistory(125, 20, 24));
  const [bpDiastolicData] = useState(() => generateVitalHistory(82, 12, 24));
  const [oxygenData] = useState(() => generateVitalHistory(96, 4, 24));
  const [tempData] = useState(() => generateVitalHistory(98.6, 1.5, 24));
  const [respiratoryData] = useState(() => generateVitalHistory(16, 4, 24));

  // Combine BP data
  const bpCombinedData = bpSystolicData.map((item, i) => ({
    ...item,
    systolic: item.value,
    diastolic: bpDiastolicData[i]?.value || 80,
  }));

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${patientId}-medical-report-${new Date().toISOString().split("T")[0]}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <Navbar />

      <main className="container px-4 md:px-6 py-8">
        {/* Navigation & Actions */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link to="/dashboard">
            <Button variant="ghost" className="gap-2 hover:bg-primary/5">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>

          <Button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {isExporting ? "Generating PDF..." : "Export Report"}
          </Button>
        </motion.div>

        {/* Report Content (for PDF export) */}
        <div ref={reportRef} className="space-y-6">
          {/* Patient Header Card */}
          <motion.div
            className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-glow">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <h1 className="text-2xl font-bold text-foreground">{patient.id}</h1>
                    <StatusBadge status={patient.status} pulse>
                      {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                    </StatusBadge>
                    <BlockchainBadge verified size="md" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Age:</span>{" "}
                      <span className="font-medium">{patient.age} years</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Gender:</span>{" "}
                      <span className="font-medium">{patient.gender}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Blood Type:</span>{" "}
                      <span className="font-medium">{patient.bloodType}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Ward:</span>{" "}
                      <span className="font-medium">{patient.ward}, {patient.bed}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">Current Risk Score</p>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-status-critical" />
                    <span className="text-4xl font-bold text-status-critical">
                      {patient.currentRiskScore}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Admitted: {patient.admissionDate}</span>
                </div>
              </div>
            </div>

            {/* Conditions & Allergies */}
            <div className="mt-6 pt-6 border-t border-border/50 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Known Conditions</p>
                <div className="flex flex-wrap gap-2">
                  {patient.conditions.map((condition) => (
                    <span
                      key={condition}
                      className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full"
                    >
                      {condition}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Allergies</p>
                <div className="flex flex-wrap gap-2">
                  {patient.allergies.map((allergy) => (
                    <span
                      key={allergy}
                      className="px-3 py-1 text-xs font-medium bg-status-critical/10 text-status-critical rounded-full"
                    >
                      {allergy}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Vital Signs Charts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Tabs defaultValue="heart" className="w-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Activity className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">
                    Vital Signs History (24h)
                  </h2>
                </div>
                <TabsList className="bg-white/50">
                  <TabsTrigger value="heart" className="gap-1.5">
                    <Heart className="w-4 h-4" /> Heart Rate
                  </TabsTrigger>
                  <TabsTrigger value="bp" className="gap-1.5">
                    <Activity className="w-4 h-4" /> Blood Pressure
                  </TabsTrigger>
                  <TabsTrigger value="oxygen" className="gap-1.5">
                    <Droplets className="w-4 h-4" /> SpO2
                  </TabsTrigger>
                  <TabsTrigger value="temp" className="gap-1.5">
                    <Thermometer className="w-4 h-4" /> Temperature
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-lg">
                <TabsContent value="heart" className="mt-0">
                  <VitalChart
                    data={heartRateData}
                    dataKey="value"
                    color="hsl(0, 84%, 60%)"
                    gradientId="heartGradient"
                    unit="BPM"
                    title="Heart Rate"
                    normalRange={{ min: 60, max: 100 }}
                  />
                </TabsContent>

                <TabsContent value="bp" className="mt-0">
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={bpCombinedData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis
                          dataKey="time"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                          interval="preserveStartEnd"
                        />
                        <YAxis
                          domain={[60, 180]}
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="systolic"
                          stroke="hsl(217, 91%, 60%)"
                          strokeWidth={2}
                          dot={false}
                          name="Systolic (mmHg)"
                        />
                        <Line
                          type="monotone"
                          dataKey="diastolic"
                          stroke="hsl(173, 80%, 40%)"
                          strokeWidth={2}
                          dot={false}
                          name="Diastolic (mmHg)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>

                <TabsContent value="oxygen" className="mt-0">
                  <VitalChart
                    data={oxygenData}
                    dataKey="value"
                    color="hsl(173, 80%, 40%)"
                    gradientId="oxygenGradient2"
                    unit="%"
                    title="Oxygen Saturation"
                    normalRange={{ min: 95, max: 100 }}
                  />
                </TabsContent>

                <TabsContent value="temp" className="mt-0">
                  <VitalChart
                    data={tempData}
                    dataKey="value"
                    color="hsl(32, 95%, 44%)"
                    gradientId="tempGradient"
                    unit="°F"
                    title="Body Temperature"
                    normalRange={{ min: 97, max: 99.5 }}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </motion.div>

          {/* Medical Records Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                Medical Records & AI Predictions
              </h2>
            </div>

            <div className="relative">
              <motion.div
                className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-muted"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.8 }}
              />

              <div className="space-y-4">
                {medicalRecords.map((record, index) => (
                  <MedicalRecordCard key={record.id} record={record} index={index} />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

// Vital Chart Component
interface VitalChartProps {
  data: Array<{ time: string; value: number }>;
  dataKey: string;
  color: string;
  gradientId: string;
  unit: string;
  title: string;
  normalRange: { min: number; max: number };
}

const VitalChart: React.FC<VitalChartProps> = ({
  data,
  dataKey,
  color,
  gradientId,
  unit,
  title,
  normalRange,
}) => {
  const currentValue = data[data.length - 1]?.value || 0;
  const avgValue = Math.round(data.reduce((sum, d) => sum + d.value, 0) / data.length);
  const minValue = Math.min(...data.map((d) => d.value));
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-6">
          <div>
            <p className="text-sm text-muted-foreground">Current</p>
            <p className="text-2xl font-bold" style={{ color }}>
              {currentValue} {unit}
            </p>
          </div>
          <div className="text-sm">
            <p className="text-muted-foreground">
              Avg: <span className="font-medium text-foreground">{avgValue} {unit}</span>
            </p>
            <p className="text-muted-foreground">
              Range: <span className="font-medium text-foreground">{minValue}-{maxValue} {unit}</span>
            </p>
          </div>
        </div>
        <div className="text-sm text-right">
          <p className="text-muted-foreground">Normal Range</p>
          <p className="font-medium text-foreground">
            {normalRange.min} - {normalRange.max} {unit}
          </p>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
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
              domain={[normalRange.min - 15, normalRange.max + 15]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              formatter={(value: number) => [`${value} ${unit}`, title]}
            />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              dot={false}
              activeDot={{ r: 4, fill: color, stroke: "white", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Medical Record Card Component
interface MedicalRecordCardProps {
  record: {
    id: number;
    timestamp: string;
    type: string;
    status: StatusType;
    riskScore: number;
    title: string;
    description: string;
    verified: boolean;
  };
  index: number;
}

const MedicalRecordCard: React.FC<MedicalRecordCardProps> = ({ record, index }) => {
  const typeIcon = {
    "AI Prediction": Brain,
    "Lab Results": FileText,
    "Vital Alert": Activity,
    Medication: Shield,
    Imaging: FileText,
  }[record.type] || FileText;

  const Icon = typeIcon;

  return (
    <motion.div
      className="relative pl-16"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <motion.div
        className={cn(
          "absolute left-4 w-5 h-5 rounded-full border-4 border-background shadow-md",
          record.status === "critical" && "bg-status-critical",
          record.status === "warning" && "bg-status-warning",
          record.status === "normal" && "bg-status-normal"
        )}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 + index * 0.1, type: "spring" }}
      />

      <div className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-xl",
                record.status === "critical" && "bg-status-critical/10",
                record.status === "warning" && "bg-status-warning/10",
                record.status === "normal" && "bg-status-normal/10"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5",
                  record.status === "critical" && "text-status-critical",
                  record.status === "warning" && "text-status-warning",
                  record.status === "normal" && "text-status-normal"
                )}
              />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{record.title}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="px-2 py-0.5 bg-muted rounded text-xs font-medium">
                  {record.type}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <StatusBadge status={record.status}>
              Risk: {record.riskScore}%
            </StatusBadge>
            <BlockchainBadge verified={record.verified} size="sm" />
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-3">{record.description}</p>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          <span>{record.timestamp}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default PatientDetail;
