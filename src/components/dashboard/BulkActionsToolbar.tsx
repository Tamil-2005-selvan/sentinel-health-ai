import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle, 
  Building, 
  Download, 
  X, 
  CheckCheck,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface BulkActionsToolbarProps {
  selectedCount: number;
  selectedIds: string[];
  onClearSelection: () => void;
  onAcknowledge: (ids: string[]) => void;
  onAssignWard: (ids: string[], ward: string) => void;
  onExport: (ids: string[]) => void;
}

const wards = [
  "ICU",
  "Emergency",
  "Cardiology",
  "Neurology",
  "Pediatrics",
  "Oncology",
  "General",
];

export const BulkActionsToolbar: React.FC<BulkActionsToolbarProps> = ({
  selectedCount,
  selectedIds,
  onClearSelection,
  onAcknowledge,
  onAssignWard,
  onExport,
}) => {
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedWard, setSelectedWard] = useState<string>("");
  const [isExporting, setIsExporting] = useState(false);
  const [isAcknowledging, setIsAcknowledging] = useState(false);

  const handleAcknowledge = async () => {
    setIsAcknowledging(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    onAcknowledge(selectedIds);
    setIsAcknowledging(false);
    toast.success(`${selectedCount} alert(s) acknowledged`, {
      description: "Alerts have been marked as reviewed"
    });
    onClearSelection();
  };

  const handleAssignWard = () => {
    if (!selectedWard) {
      toast.error("Please select a ward");
      return;
    }
    onAssignWard(selectedIds, selectedWard);
    toast.success(`${selectedCount} patient(s) assigned to ${selectedWard}`, {
      description: "Ward assignments have been updated"
    });
    setShowAssignDialog(false);
    setSelectedWard("");
    onClearSelection();
  };

  const handleExport = async () => {
    setIsExporting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate CSV content
    const headers = ["Patient ID", "Status", "Risk Score", "Ward", "Timestamp"];
    const csvContent = [
      headers.join(","),
      ...selectedIds.map(id => `"${id}","Critical","89%","ICU","${new Date().toISOString()}"`)
    ].join("\n");
    
    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `patient-export-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setIsExporting(false);
    onExport(selectedIds);
    toast.success(`${selectedCount} patient(s) exported`, {
      description: "CSV file has been downloaded"
    });
  };

  return (
    <>
      <AnimatePresence>
        {selectedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mb-4"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
                  <CheckCheck className="w-4 h-4" />
                </div>
                <span className="font-medium text-foreground">
                  {selectedCount} patient{selectedCount !== 1 ? "s" : ""} selected
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearSelection}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAcknowledge}
                  disabled={isAcknowledging}
                  className="gap-2 border-secondary/30 hover:bg-secondary/10 hover:border-secondary"
                >
                  {isAcknowledging ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-secondary" />
                  )}
                  Acknowledge
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAssignDialog(true)}
                  className="gap-2 border-primary/30 hover:bg-primary/10 hover:border-primary"
                >
                  <Building className="w-4 h-4 text-primary" />
                  Assign Ward
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  disabled={isExporting}
                  className="gap-2 border-muted-foreground/30 hover:bg-muted"
                >
                  {isExporting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  Export CSV
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Assign Ward Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building className="w-5 h-5 text-primary" />
              Assign to Ward
            </DialogTitle>
            <DialogDescription>
              Assign {selectedCount} selected patient{selectedCount !== 1 ? "s" : ""} to a ward.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Select value={selectedWard} onValueChange={setSelectedWard}>
              <SelectTrigger>
                <SelectValue placeholder="Select a ward..." />
              </SelectTrigger>
              <SelectContent>
                {wards.map((ward) => (
                  <SelectItem key={ward} value={ward}>
                    {ward}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAssignDialog(false);
                setSelectedWard("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAssignWard} disabled={!selectedWard}>
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
