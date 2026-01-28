import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  ArrowRightLeft,
  AlertOctagon,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Trash2,
  Send,
  FileText,
  ClipboardList,
  MessageSquare,
  User,
  Calendar,
  Sun,
  Moon,
  Sunset,
  X,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { useHandoverStore, HandoverTask, HandoverNote } from "@/hooks/use-handover";
import { StatusBadge, StatusType } from "@/components/ui/status-badge";
import { format } from "date-fns";

// Mock critical patients data
const criticalPatientsData = [
  {
    patientId: "PT-ICU-7823",
    status: "critical" as StatusType,
    riskScore: 89,
    condition: "Acute respiratory distress, requires continuous monitoring",
    lastUpdate: "2 min ago",
  },
  {
    patientId: "PT-EMR-9102",
    status: "critical" as StatusType,
    riskScore: 92,
    condition: "Cardiac arrhythmia, awaiting cardiology consult",
    lastUpdate: "12 min ago",
  },
  {
    patientId: "PT-ICU-4444",
    status: "critical" as StatusType,
    riskScore: 95,
    condition: "Post-operative complications, hemodynamic instability",
    lastUpdate: "3 hr ago",
  },
  {
    patientId: "PT-CAR-4521",
    status: "warning" as StatusType,
    riskScore: 67,
    condition: "Elevated troponin levels, monitoring for MI",
    lastUpdate: "8 min ago",
  },
  {
    patientId: "PT-ONC-5678",
    status: "warning" as StatusType,
    riskScore: 72,
    condition: "Neutropenic fever, on broad-spectrum antibiotics",
    lastUpdate: "1 hr ago",
  },
];

const shiftTimeIcons = {
  morning: Sun,
  afternoon: Sunset,
  night: Moon,
};

const ShiftHandover: React.FC = () => {
  const {
    currentHandover,
    pendingTasks,
    createHandover,
    addTask,
    updateTaskStatus,
    removeTask,
    addNote,
    removeNote,
    addCriticalPatient,
    removeCriticalPatient,
    submitHandover,
    acknowledgeHandover,
  } = useHandoverStore();

  const [newTaskDialogOpen, setNewTaskDialogOpen] = useState(false);
  const [newNoteDialogOpen, setNewNoteDialogOpen] = useState(false);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<"morning" | "afternoon" | "night">("morning");
  const [incomingDoctorName, setIncomingDoctorName] = useState("");

  // New task form state
  const [newTask, setNewTask] = useState({
    patientId: "",
    description: "",
    priority: "medium" as HandoverTask["priority"],
  });

  // New note form state
  const [newNote, setNewNote] = useState({
    content: "",
    category: "general" as HandoverNote["category"],
  });

  const selectedCriticalPatients = useMemo(() => {
    if (!currentHandover) return [];
    return criticalPatientsData.filter((p) =>
      currentHandover.criticalPatientIds.includes(p.patientId)
    );
  }, [currentHandover]);

  const unselectedCriticalPatients = useMemo(() => {
    if (!currentHandover) return criticalPatientsData;
    return criticalPatientsData.filter(
      (p) => !currentHandover.criticalPatientIds.includes(p.patientId)
    );
  }, [currentHandover]);

  const handleStartHandover = () => {
    createHandover("Dr. Sarah Smith", selectedShift);
    toast.success("Shift handover started");
  };

  const handleAddTask = () => {
    if (!newTask.description.trim()) {
      toast.error("Please enter a task description");
      return;
    }
    addTask({
      patientId: newTask.patientId,
      description: newTask.description,
      priority: newTask.priority,
      status: "pending",
      createdBy: "Dr. Sarah Smith",
    });
    setNewTask({ patientId: "", description: "", priority: "medium" });
    setNewTaskDialogOpen(false);
    toast.success("Task added to handover");
  };

  const handleAddNote = () => {
    if (!newNote.content.trim()) {
      toast.error("Please enter note content");
      return;
    }
    addNote({
      content: newNote.content,
      category: newNote.category,
      createdBy: "Dr. Sarah Smith",
    });
    setNewNote({ content: "", category: "general" });
    setNewNoteDialogOpen(false);
    toast.success("Note added to handover");
  };

  const handleSubmitHandover = () => {
    if (!incomingDoctorName.trim()) {
      toast.error("Please specify the incoming doctor");
      return;
    }
    submitHandover(incomingDoctorName);
    setSubmitDialogOpen(false);
    toast.success("Handover submitted successfully");
  };

  const handleAcknowledge = () => {
    acknowledgeHandover();
    toast.success("Handover acknowledged and archived");
  };

  const handleExportHandover = () => {
    if (!currentHandover) return;
    
    const handoverText = `
SHIFT HANDOVER REPORT
=====================
Date: ${format(currentHandover.shiftDate, "PPP")}
Shift: ${currentHandover.shiftTime.charAt(0).toUpperCase() + currentHandover.shiftTime.slice(1)}
Outgoing Doctor: ${currentHandover.outgoingDoctor}
${currentHandover.incomingDoctor ? `Incoming Doctor: ${currentHandover.incomingDoctor}` : ""}

CRITICAL PATIENTS (${selectedCriticalPatients.length})
${selectedCriticalPatients.map(p => `- ${p.patientId}: ${p.condition} (Risk: ${p.riskScore}%)`).join("\n")}

PENDING TASKS (${currentHandover.tasks.length})
${currentHandover.tasks.map(t => `- [${t.priority.toUpperCase()}] ${t.description} (${t.status})`).join("\n")}

NOTES (${currentHandover.notes.length})
${currentHandover.notes.map(n => `- [${n.category}] ${n.content}`).join("\n")}
    `.trim();

    const blob = new Blob([handoverText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `handover-${format(currentHandover.shiftDate, "yyyy-MM-dd")}-${currentHandover.shiftTime}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Handover report exported");
  };

  const getPriorityColor = (priority: HandoverTask["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-status-critical text-white";
      case "medium":
        return "bg-status-warning text-white";
      case "low":
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getCategoryColor = (category: HandoverNote["category"]) => {
    switch (category) {
      case "critical":
        return "bg-status-critical text-white";
      case "medication":
        return "bg-primary text-primary-foreground";
      case "followup":
        return "bg-status-warning text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

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
            <ArrowRightLeft className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">
              Shift Handover
            </h1>
          </div>
          <p className="text-muted-foreground">
            Summarize critical patients and pending tasks for incoming doctors
          </p>
        </motion.div>

        {!currentHandover ? (
          /* Start Handover Section */
          <motion.div
            className="glass-card p-8 max-w-2xl mx-auto text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mx-auto mb-6">
              <ClipboardList className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Start New Shift Handover
            </h2>
            <p className="text-muted-foreground mb-6">
              Create a comprehensive handover report for the incoming shift
            </p>

            <div className="flex flex-col items-center gap-4">
              <div className="w-full max-w-xs">
                <Label htmlFor="shift-select" className="sr-only">
                  Select shift
                </Label>
                <Select
                  value={selectedShift}
                  onValueChange={(v) => setSelectedShift(v as typeof selectedShift)}
                >
                  <SelectTrigger id="shift-select">
                    <SelectValue placeholder="Select shift" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">
                      <div className="flex items-center gap-2">
                        <Sun className="w-4 h-4" />
                        Morning Shift (6AM - 2PM)
                      </div>
                    </SelectItem>
                    <SelectItem value="afternoon">
                      <div className="flex items-center gap-2">
                        <Sunset className="w-4 h-4" />
                        Afternoon Shift (2PM - 10PM)
                      </div>
                    </SelectItem>
                    <SelectItem value="night">
                      <div className="flex items-center gap-2">
                        <Moon className="w-4 h-4" />
                        Night Shift (10PM - 6AM)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleStartHandover} size="lg" className="gap-2">
                <Plus className="w-5 h-5" />
                Start Handover
              </Button>
            </div>

            {pendingTasks.length > 0 && (
              <div className="mt-8 pt-6 border-t">
                <p className="text-sm text-muted-foreground mb-2">
                  {pendingTasks.length} pending task{pendingTasks.length !== 1 ? "s" : ""} from previous shifts
                </p>
              </div>
            )}
          </motion.div>
        ) : (
          /* Active Handover Section */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Handover Info & Actions */}
            <motion.div
              className="lg:col-span-1 space-y-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Handover Status Card */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  {React.createElement(shiftTimeIcons[currentHandover.shiftTime], {
                    className: "w-6 h-6 text-primary",
                  })}
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {currentHandover.shiftTime.charAt(0).toUpperCase() +
                        currentHandover.shiftTime.slice(1)}{" "}
                      Shift
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {format(currentHandover.shiftDate, "PPP")}
                    </p>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Outgoing:</span>
                    <span className="font-medium">{currentHandover.outgoingDoctor}</span>
                  </div>
                  {currentHandover.incomingDoctor && (
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Incoming:</span>
                      <span className="font-medium">{currentHandover.incomingDoctor}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Status:</span>
                    <Badge
                      variant={
                        currentHandover.status === "draft"
                          ? "outline"
                          : currentHandover.status === "submitted"
                          ? "secondary"
                          : "default"
                      }
                    >
                      {currentHandover.status.charAt(0).toUpperCase() +
                        currentHandover.status.slice(1)}
                    </Badge>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-status-critical/10">
                    <p className="text-2xl font-bold text-status-critical">
                      {selectedCriticalPatients.length}
                    </p>
                    <p className="text-xs text-muted-foreground">Critical</p>
                  </div>
                  <div className="p-2 rounded-lg bg-status-warning/10">
                    <p className="text-2xl font-bold text-status-warning">
                      {currentHandover.tasks.filter((t) => t.status === "pending").length}
                    </p>
                    <p className="text-xs text-muted-foreground">Tasks</p>
                  </div>
                  <div className="p-2 rounded-lg bg-primary/10">
                    <p className="text-2xl font-bold text-primary">
                      {currentHandover.notes.length}
                    </p>
                    <p className="text-xs text-muted-foreground">Notes</p>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button
                    onClick={handleExportHandover}
                    variant="outline"
                    className="w-full gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export Report
                  </Button>

                  {currentHandover.status === "draft" && (
                    <Dialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full gap-2">
                          <Send className="w-4 h-4" />
                          Submit Handover
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Submit Shift Handover</DialogTitle>
                          <DialogDescription>
                            Enter the name of the incoming doctor who will receive this handover.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="incoming-doctor">Incoming Doctor</Label>
                            <Input
                              id="incoming-doctor"
                              placeholder="Dr. John Doe"
                              value={incomingDoctorName}
                              onChange={(e) => setIncomingDoctorName(e.target.value)}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setSubmitDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleSubmitHandover}>Submit</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}

                  {currentHandover.status === "submitted" && (
                    <Button onClick={handleAcknowledge} className="w-full gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Acknowledge & Archive
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Right Column - Content Tabs */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Tabs defaultValue="patients" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="patients" className="gap-2">
                    <AlertOctagon className="w-4 h-4" />
                    <span className="hidden sm:inline">Critical Patients</span>
                    <span className="sm:hidden">Patients</span>
                  </TabsTrigger>
                  <TabsTrigger value="tasks" className="gap-2">
                    <ClipboardList className="w-4 h-4" />
                    <span className="hidden sm:inline">Tasks</span>
                    <span className="sm:hidden">Tasks</span>
                  </TabsTrigger>
                  <TabsTrigger value="notes" className="gap-2">
                    <MessageSquare className="w-4 h-4" />
                    <span className="hidden sm:inline">Notes</span>
                    <span className="sm:hidden">Notes</span>
                  </TabsTrigger>
                </TabsList>

                {/* Critical Patients Tab */}
                <TabsContent value="patients">
                  <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-foreground">
                        Critical Patients to Monitor
                      </h3>
                      <Badge variant="destructive">
                        {selectedCriticalPatients.length} Selected
                      </Badge>
                    </div>

                    {/* Selected Critical Patients */}
                    <div className="space-y-3 mb-6">
                      <AnimatePresence>
                        {selectedCriticalPatients.map((patient) => (
                          <motion.div
                            key={patient.patientId}
                            className="p-4 rounded-lg border border-status-critical/30 bg-status-critical/5"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-mono font-semibold">
                                    {patient.patientId}
                                  </span>
                                  <StatusBadge status={patient.status}>{patient.status}</StatusBadge>
                                  <Badge variant="outline">Risk: {patient.riskScore}%</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {patient.condition}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Last update: {patient.lastUpdate}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeCriticalPatient(patient.patientId)}
                                aria-label={`Remove ${patient.patientId} from handover`}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      {selectedCriticalPatients.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No critical patients selected for handover
                        </p>
                      )}
                    </div>

                    {/* Available Patients to Add */}
                    {unselectedCriticalPatients.length > 0 && (
                      <>
                        <Separator className="my-4" />
                        <h4 className="text-sm font-medium text-muted-foreground mb-3">
                          Available Patients to Add
                        </h4>
                        <div className="space-y-2">
                          {unselectedCriticalPatients.map((patient) => (
                            <div
                              key={patient.patientId}
                              className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <Checkbox
                                  id={`add-${patient.patientId}`}
                                  onCheckedChange={(checked) => {
                                    if (checked) addCriticalPatient(patient.patientId);
                                  }}
                                />
                                <label
                                  htmlFor={`add-${patient.patientId}`}
                                  className="cursor-pointer"
                                >
                                  <span className="font-mono text-sm">
                                    {patient.patientId}
                                  </span>
                                  <StatusBadge status={patient.status} className="ml-2">{patient.status}</StatusBadge>
                                </label>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                Risk: {patient.riskScore}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </TabsContent>

                {/* Tasks Tab */}
                <TabsContent value="tasks">
                  <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-foreground">Pending Tasks</h3>
                      <Dialog open={newTaskDialogOpen} onOpenChange={setNewTaskDialogOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm" className="gap-2">
                            <Plus className="w-4 h-4" />
                            Add Task
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add New Task</DialogTitle>
                            <DialogDescription>
                              Create a task for the incoming shift to complete.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="task-patient">Patient ID (optional)</Label>
                              <Input
                                id="task-patient"
                                placeholder="PT-XXX-0000"
                                value={newTask.patientId}
                                onChange={(e) =>
                                  setNewTask({ ...newTask, patientId: e.target.value })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="task-description">Description</Label>
                              <Textarea
                                id="task-description"
                                placeholder="Describe the task..."
                                value={newTask.description}
                                onChange={(e) =>
                                  setNewTask({ ...newTask, description: e.target.value })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="task-priority">Priority</Label>
                              <Select
                                value={newTask.priority}
                                onValueChange={(v) =>
                                  setNewTask({
                                    ...newTask,
                                    priority: v as HandoverTask["priority"],
                                  })
                                }
                              >
                                <SelectTrigger id="task-priority">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="high">High</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="low">Low</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setNewTaskDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button onClick={handleAddTask}>Add Task</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div className="space-y-3">
                      <AnimatePresence>
                        {currentHandover.tasks.map((task) => (
                          <motion.div
                            key={task.id}
                            className="p-4 rounded-lg border"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3">
                                <Checkbox
                                  checked={task.status === "completed"}
                                  onCheckedChange={(checked) =>
                                    updateTaskStatus(
                                      task.id,
                                      checked ? "completed" : "pending"
                                    )
                                  }
                                />
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge className={getPriorityColor(task.priority)}>
                                      {task.priority}
                                    </Badge>
                                    {task.patientId && (
                                      <span className="font-mono text-xs text-muted-foreground">
                                        {task.patientId}
                                      </span>
                                    )}
                                  </div>
                                  <p
                                    className={`text-sm ${
                                      task.status === "completed"
                                        ? "line-through text-muted-foreground"
                                        : ""
                                    }`}
                                  >
                                    {task.description}
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeTask(task.id)}
                                aria-label="Remove task"
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      {currentHandover.tasks.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <ClipboardList className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p>No tasks added yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                {/* Notes Tab */}
                <TabsContent value="notes">
                  <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-foreground">Handover Notes</h3>
                      <Dialog open={newNoteDialogOpen} onOpenChange={setNewNoteDialogOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm" className="gap-2">
                            <Plus className="w-4 h-4" />
                            Add Note
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Handover Note</DialogTitle>
                            <DialogDescription>
                              Add important information for the incoming shift.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="note-category">Category</Label>
                              <Select
                                value={newNote.category}
                                onValueChange={(v) =>
                                  setNewNote({
                                    ...newNote,
                                    category: v as HandoverNote["category"],
                                  })
                                }
                              >
                                <SelectTrigger id="note-category">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="general">General</SelectItem>
                                  <SelectItem value="critical">Critical</SelectItem>
                                  <SelectItem value="followup">Follow-up</SelectItem>
                                  <SelectItem value="medication">Medication</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="note-content">Note</Label>
                              <Textarea
                                id="note-content"
                                placeholder="Enter your note..."
                                rows={4}
                                value={newNote.content}
                                onChange={(e) =>
                                  setNewNote({ ...newNote, content: e.target.value })
                                }
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setNewNoteDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button onClick={handleAddNote}>Add Note</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div className="space-y-3">
                      <AnimatePresence>
                        {currentHandover.notes.map((note) => (
                          <motion.div
                            key={note.id}
                            className="p-4 rounded-lg border"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge className={getCategoryColor(note.category)}>
                                    {note.category}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    by {note.createdBy}
                                  </span>
                                </div>
                                <p className="text-sm">{note.content}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeNote(note.id)}
                                aria-label="Remove note"
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      {currentHandover.notes.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p>No notes added yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ShiftHandover;
