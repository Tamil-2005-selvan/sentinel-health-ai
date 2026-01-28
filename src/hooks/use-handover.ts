import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface HandoverTask {
  id: string;
  patientId: string;
  description: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "in-progress" | "completed";
  createdAt: Date;
  createdBy: string;
  assignedTo?: string;
}

export interface HandoverNote {
  id: string;
  content: string;
  createdAt: Date;
  createdBy: string;
  category: "general" | "critical" | "followup" | "medication";
}

export interface ShiftHandover {
  id: string;
  outgoingDoctor: string;
  incomingDoctor: string;
  shiftDate: Date;
  shiftTime: "morning" | "afternoon" | "night";
  tasks: HandoverTask[];
  notes: HandoverNote[];
  criticalPatientIds: string[];
  status: "draft" | "submitted" | "acknowledged";
  createdAt: Date;
  acknowledgedAt?: Date;
}

interface HandoverState {
  currentHandover: ShiftHandover | null;
  handoverHistory: ShiftHandover[];
  pendingTasks: HandoverTask[];
  
  // Actions
  createHandover: (outgoingDoctor: string, shiftTime: "morning" | "afternoon" | "night") => void;
  addTask: (task: Omit<HandoverTask, "id" | "createdAt">) => void;
  updateTaskStatus: (taskId: string, status: HandoverTask["status"]) => void;
  removeTask: (taskId: string) => void;
  addNote: (note: Omit<HandoverNote, "id" | "createdAt">) => void;
  removeNote: (noteId: string) => void;
  addCriticalPatient: (patientId: string) => void;
  removeCriticalPatient: (patientId: string) => void;
  submitHandover: (incomingDoctor: string) => void;
  acknowledgeHandover: () => void;
  clearCurrentHandover: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 11);

export const useHandoverStore = create<HandoverState>()(
  persist(
    (set, get) => ({
      currentHandover: null,
      handoverHistory: [],
      pendingTasks: [],

      createHandover: (outgoingDoctor, shiftTime) => {
        const newHandover: ShiftHandover = {
          id: generateId(),
          outgoingDoctor,
          incomingDoctor: "",
          shiftDate: new Date(),
          shiftTime,
          tasks: [],
          notes: [],
          criticalPatientIds: [],
          status: "draft",
          createdAt: new Date(),
        };
        set({ currentHandover: newHandover });
      },

      addTask: (taskData) => {
        const task: HandoverTask = {
          ...taskData,
          id: generateId(),
          createdAt: new Date(),
        };
        set((state) => ({
          currentHandover: state.currentHandover
            ? {
                ...state.currentHandover,
                tasks: [...state.currentHandover.tasks, task],
              }
            : null,
          pendingTasks: [...state.pendingTasks, task],
        }));
      },

      updateTaskStatus: (taskId, status) => {
        set((state) => ({
          currentHandover: state.currentHandover
            ? {
                ...state.currentHandover,
                tasks: state.currentHandover.tasks.map((t) =>
                  t.id === taskId ? { ...t, status } : t
                ),
              }
            : null,
          pendingTasks: state.pendingTasks.map((t) =>
            t.id === taskId ? { ...t, status } : t
          ),
        }));
      },

      removeTask: (taskId) => {
        set((state) => ({
          currentHandover: state.currentHandover
            ? {
                ...state.currentHandover,
                tasks: state.currentHandover.tasks.filter((t) => t.id !== taskId),
              }
            : null,
          pendingTasks: state.pendingTasks.filter((t) => t.id !== taskId),
        }));
      },

      addNote: (noteData) => {
        const note: HandoverNote = {
          ...noteData,
          id: generateId(),
          createdAt: new Date(),
        };
        set((state) => ({
          currentHandover: state.currentHandover
            ? {
                ...state.currentHandover,
                notes: [...state.currentHandover.notes, note],
              }
            : null,
        }));
      },

      removeNote: (noteId) => {
        set((state) => ({
          currentHandover: state.currentHandover
            ? {
                ...state.currentHandover,
                notes: state.currentHandover.notes.filter((n) => n.id !== noteId),
              }
            : null,
        }));
      },

      addCriticalPatient: (patientId) => {
        set((state) => ({
          currentHandover: state.currentHandover
            ? {
                ...state.currentHandover,
                criticalPatientIds: [
                  ...new Set([...state.currentHandover.criticalPatientIds, patientId]),
                ],
              }
            : null,
        }));
      },

      removeCriticalPatient: (patientId) => {
        set((state) => ({
          currentHandover: state.currentHandover
            ? {
                ...state.currentHandover,
                criticalPatientIds: state.currentHandover.criticalPatientIds.filter(
                  (id) => id !== patientId
                ),
              }
            : null,
        }));
      },

      submitHandover: (incomingDoctor) => {
        set((state) => ({
          currentHandover: state.currentHandover
            ? {
                ...state.currentHandover,
                incomingDoctor,
                status: "submitted",
              }
            : null,
        }));
      },

      acknowledgeHandover: () => {
        const { currentHandover } = get();
        if (currentHandover) {
          const acknowledgedHandover: ShiftHandover = {
            ...currentHandover,
            status: "acknowledged",
            acknowledgedAt: new Date(),
          };
          set((state) => ({
            currentHandover: null,
            handoverHistory: [acknowledgedHandover, ...state.handoverHistory],
            pendingTasks: state.pendingTasks.filter(
              (t) => !currentHandover.tasks.some((ct) => ct.id === t.id)
            ),
          }));
        }
      },

      clearCurrentHandover: () => {
        set({ currentHandover: null });
      },
    }),
    {
      name: "isms-shift-handover",
      partialize: (state) => ({
        handoverHistory: state.handoverHistory,
        pendingTasks: state.pendingTasks,
      }),
    }
  )
);
