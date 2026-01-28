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
  Area,
  AreaChart,
} from "recharts";
import { Heart, Activity, Droplets } from "lucide-react";
import { cn } from "@/lib/utils";

interface VitalDataPoint {
  time: string;
  value: number;
}

interface VitalChartProps {
  title: string;
  icon: React.ElementType;
  data: VitalDataPoint[];
  color: string;
  gradientId: string;
  unit: string;
  normalRange: { min: number; max: number };
  currentValue: number;
  delay?: number;
}

const VitalChart: React.FC<VitalChartProps> = ({
  title,
  icon: Icon,
  data,
  color,
  gradientId,
  unit,
  normalRange,
  currentValue,
  delay = 0,
}) => {
  const isNormal = currentValue >= normalRange.min && currentValue <= normalRange.max;

  return (
    <motion.div
      className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl p-5 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-xl"
            style={{ backgroundColor: `${color}15` }}
          >
            <Icon className="w-5 h-5" style={{ color }} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground">
              Normal: {normalRange.min}-{normalRange.max} {unit}
            </p>
          </div>
        </div>
        <div className="text-right">
          <motion.span
            className="text-2xl font-bold"
            style={{ color: isNormal ? color : "hsl(var(--status-warning))" }}
            key={currentValue}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {currentValue}
          </motion.span>
          <span className="text-sm text-muted-foreground ml-1">{unit}</span>
          <div className="flex items-center justify-end gap-1 mt-1">
            <span
              className={cn(
                "w-2 h-2 rounded-full",
                isNormal ? "bg-status-normal" : "bg-status-warning animate-pulse"
              )}
            />
            <span className="text-xs text-muted-foreground">
              {isNormal ? "Normal" : "Attention"}
            </span>
          </div>
        </div>
      </div>

      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[normalRange.min - 10, normalRange.max + 10]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
              formatter={(value: number) => [`${value} ${unit}`, title]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              dot={false}
              activeDot={{ r: 4, fill: color, stroke: "white", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

// Generate initial data
const generateInitialData = (baseValue: number, variance: number): VitalDataPoint[] => {
  const now = new Date();
  return Array.from({ length: 20 }, (_, i) => {
    const time = new Date(now.getTime() - (19 - i) * 3000);
    return {
      time: time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      value: Math.round(baseValue + (Math.random() - 0.5) * variance),
    };
  });
};

const VitalSignsCharts: React.FC = () => {
  const [heartRateData, setHeartRateData] = useState<VitalDataPoint[]>(() =>
    generateInitialData(75, 20)
  );
  const [bloodPressureData, setBloodPressureData] = useState<VitalDataPoint[]>(() =>
    generateInitialData(120, 15)
  );
  const [oxygenData, setOxygenData] = useState<VitalDataPoint[]>(() =>
    generateInitialData(97, 4)
  );

  // Real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      setHeartRateData((prev) => {
        const lastValue = prev[prev.length - 1]?.value || 75;
        const newValue = Math.max(60, Math.min(100, lastValue + (Math.random() - 0.5) * 8));
        return [...prev.slice(1), { time: timeStr, value: Math.round(newValue) }];
      });

      setBloodPressureData((prev) => {
        const lastValue = prev[prev.length - 1]?.value || 120;
        const newValue = Math.max(100, Math.min(140, lastValue + (Math.random() - 0.5) * 6));
        return [...prev.slice(1), { time: timeStr, value: Math.round(newValue) }];
      });

      setOxygenData((prev) => {
        const lastValue = prev[prev.length - 1]?.value || 97;
        const newValue = Math.max(94, Math.min(100, lastValue + (Math.random() - 0.5) * 2));
        return [...prev.slice(1), { time: timeStr, value: Math.round(newValue) }];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const currentHeartRate = heartRateData[heartRateData.length - 1]?.value || 75;
  const currentBP = bloodPressureData[bloodPressureData.length - 1]?.value || 120;
  const currentO2 = oxygenData[oxygenData.length - 1]?.value || 97;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Real-Time Vital Signs
          </h2>
          <p className="text-sm text-muted-foreground">
            Aggregated patient vitals monitoring (updates every 3s)
          </p>
        </div>
        <motion.div
          className="flex items-center gap-2 px-3 py-1.5 bg-status-normal/10 rounded-full"
          animate={{ opacity: [1, 0.7, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="w-2 h-2 rounded-full bg-status-normal" />
          <span className="text-xs font-medium text-status-normal">Live Data</span>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <VitalChart
          title="Heart Rate"
          icon={Heart}
          data={heartRateData}
          color="hsl(0, 84%, 60%)"
          gradientId="heartRateGradient"
          unit="BPM"
          normalRange={{ min: 60, max: 100 }}
          currentValue={currentHeartRate}
          delay={0}
        />
        <VitalChart
          title="Blood Pressure (Systolic)"
          icon={Activity}
          data={bloodPressureData}
          color="hsl(217, 91%, 60%)"
          gradientId="bloodPressureGradient"
          unit="mmHg"
          normalRange={{ min: 90, max: 140 }}
          currentValue={currentBP}
          delay={1}
        />
        <VitalChart
          title="Oxygen Saturation"
          icon={Droplets}
          data={oxygenData}
          color="hsl(173, 80%, 40%)"
          gradientId="oxygenGradient"
          unit="%"
          normalRange={{ min: 95, max: 100 }}
          currentValue={currentO2}
          delay={2}
        />
      </div>
    </motion.div>
  );
};

export { VitalSignsCharts };
