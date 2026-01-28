import React from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { BlockchainBadge } from "@/components/ui/blockchain-badge";
import { 
  Shield, 
  Link as LinkIcon, 
  Clock, 
  Hash,
  CheckCircle2,
  Database,
  Lock
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock audit data
const auditRecords = [
  {
    id: 1,
    patientId: "PT-****-7823",
    timestamp: "2026-01-28 14:32:15",
    txHash: "0x8f4e...3a2b",
    fullHash: "0x8f4e567890abcdef1234567890abcdef1234567890abcdef1234567890ab3a2b",
    verified: true,
    action: "Health Status Update",
  },
  {
    id: 2,
    patientId: "PT-****-4521",
    timestamp: "2026-01-28 14:30:42",
    txHash: "0x2c7d...9e1f",
    fullHash: "0x2c7d567890abcdef1234567890abcdef1234567890abcdef1234567890ab9e1f",
    verified: true,
    action: "AI Prediction Recorded",
  },
  {
    id: 3,
    patientId: "PT-****-9102",
    timestamp: "2026-01-28 14:28:19",
    txHash: "0x5a3b...7c4d",
    fullHash: "0x5a3b567890abcdef1234567890abcdef1234567890abcdef1234567890ab7c4d",
    verified: true,
    action: "Critical Alert Logged",
  },
  {
    id: 4,
    patientId: "PT-****-3847",
    timestamp: "2026-01-28 14:25:33",
    txHash: "0x9e8f...1b2a",
    fullHash: "0x9e8f567890abcdef1234567890abcdef1234567890abcdef1234567890ab1b2a",
    verified: true,
    action: "Routine Check Complete",
  },
  {
    id: 5,
    patientId: "PT-****-6293",
    timestamp: "2026-01-28 14:22:07",
    txHash: "0x3d4e...5f6g",
    fullHash: "0x3d4e567890abcdef1234567890abcdef1234567890abcdef1234567890ab5f6a",
    verified: true,
    action: "Health Status Update",
  },
  {
    id: 6,
    patientId: "PT-****-1056",
    timestamp: "2026-01-28 14:18:51",
    txHash: "0x7h8i...9j0k",
    fullHash: "0x7a8b567890abcdef1234567890abcdef1234567890abcdef1234567890ab9c0d",
    verified: true,
    action: "AI Prediction Recorded",
  },
  {
    id: 7,
    patientId: "PT-****-2847",
    timestamp: "2026-01-28 14:15:28",
    txHash: "0x1l2m...3n4o",
    fullHash: "0x1a2b567890abcdef1234567890abcdef1234567890abcdef1234567890ab3c4d",
    verified: true,
    action: "Health Status Update",
  },
  {
    id: 8,
    patientId: "PT-****-5938",
    timestamp: "2026-01-28 14:12:03",
    txHash: "0x5p6q...7r8s",
    fullHash: "0x5e6f567890abcdef1234567890abcdef1234567890abcdef1234567890ab7a8b",
    verified: true,
    action: "Routine Check Complete",
  },
];

const AuditTrail: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <Navbar />

      <main className="container px-4 md:px-6 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">
              Blockchain Audit Trail
            </h1>
          </div>
          <p className="text-muted-foreground">
            Immutable record of all patient health data transactions
          </p>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <TrustCard
            icon={Database}
            title="Distributed Ledger"
            description="Data stored across multiple nodes"
            delay={0}
          />
          <TrustCard
            icon={Lock}
            title="Cryptographic Security"
            description="SHA-256 hash verification"
            delay={1}
          />
          <TrustCard
            icon={CheckCircle2}
            title="100% Verified"
            description="All transactions validated"
            delay={2}
          />
        </motion.div>

        {/* Audit Table */}
        <motion.div
          className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Table Header */}
          <div className="hidden lg:grid grid-cols-5 gap-4 p-4 bg-muted/50 border-b border-border/50 font-medium text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Patient ID
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Timestamp
            </div>
            <div>Action</div>
            <div className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4" />
              Transaction Hash
            </div>
            <div>Status</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border/30">
            {auditRecords.map((record, index) => (
              <motion.div
                key={record.id}
                className="p-4 hover:bg-muted/30 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
              >
                {/* Mobile Layout */}
                <div className="lg:hidden space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">
                      {record.patientId}
                    </span>
                    <BlockchainBadge verified={record.verified} size="sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Timestamp:</span>
                      <p className="text-foreground">{record.timestamp}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Action:</span>
                      <p className="text-foreground">{record.action}</p>
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">TX Hash:</span>
                    <p className="font-mono text-primary text-xs truncate">
                      {record.fullHash}
                    </p>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden lg:grid grid-cols-5 gap-4 items-center">
                  <span className="font-semibold text-foreground">
                    {record.patientId}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {record.timestamp}
                  </span>
                  <span className="text-sm text-foreground">
                    {record.action}
                  </span>
                  <div className="flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-primary" />
                    <span className="font-mono text-sm text-primary">
                      {record.txHash}
                    </span>
                  </div>
                  <BlockchainBadge verified={record.verified} size="sm" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.p
          className="text-center text-sm text-muted-foreground mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          All records are immutable and cryptographically secured on the blockchain.
          No data can be altered or deleted.
        </motion.p>
      </main>
    </div>
  );
};

interface TrustCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  delay: number;
}

const TrustCard: React.FC<TrustCardProps> = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    className={cn(
      "flex items-center gap-4 p-4 rounded-xl",
      "bg-white/70 backdrop-blur-xl border border-white/20",
      "hover:shadow-lg transition-all duration-300"
    )}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: delay * 0.1 }}
    whileHover={{ scale: 1.02 }}
  >
    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10">
      <Icon className="w-6 h-6 text-primary" />
    </div>
    <div>
      <h3 className="font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </motion.div>
);

export default AuditTrail;
