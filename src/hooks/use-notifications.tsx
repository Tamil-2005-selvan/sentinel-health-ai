import { create } from 'zustand';
import { StatusType } from '@/components/ui/status-badge';

export interface Notification {
  id: string;
  patientId: string;
  status: StatusType;
  message: string;
  timestamp: Date;
  read: boolean;
  riskScore: number;
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  soundEnabled: boolean;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  toggleSound: () => void;
}

// Create notification sound
const playNotificationSound = (status: StatusType) => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  // Different sounds for different severity
  if (status === 'critical') {
    // Urgent double beep
    oscillator.frequency.value = 880;
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
    
    // Second beep
    setTimeout(() => {
      const osc2 = audioContext.createOscillator();
      const gain2 = audioContext.createGain();
      osc2.connect(gain2);
      gain2.connect(audioContext.destination);
      osc2.frequency.value = 880;
      osc2.type = 'sine';
      gain2.gain.setValueAtTime(0.3, audioContext.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      osc2.start(audioContext.currentTime);
      osc2.stop(audioContext.currentTime + 0.1);
    }, 150);
  } else if (status === 'warning') {
    // Single alert tone
    oscillator.frequency.value = 660;
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.15);
  } else {
    // Soft notification
    oscillator.frequency.value = 520;
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  }
};

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [
    {
      id: '1',
      patientId: 'PT-****-7823',
      status: 'critical',
      message: 'Critical heart rate detected - immediate attention required',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      read: false,
      riskScore: 89,
    },
    {
      id: '2',
      patientId: 'PT-****-9102',
      status: 'critical',
      message: 'Oxygen saturation dropped below threshold',
      timestamp: new Date(Date.now() - 12 * 60 * 1000),
      read: false,
      riskScore: 92,
    },
    {
      id: '3',
      patientId: 'PT-****-4521',
      status: 'warning',
      message: 'Blood pressure variance detected',
      timestamp: new Date(Date.now() - 8 * 60 * 1000),
      read: true,
      riskScore: 67,
    },
  ],
  unreadCount: 2,
  soundEnabled: true,
  
  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };
    
    set((state) => ({
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
    
    // Play sound if enabled
    if (get().soundEnabled) {
      playNotificationSound(notification.status);
    }
  },
  
  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - (state.notifications.find(n => n.id === id && !n.read) ? 1 : 0)),
    }));
  },
  
  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },
  
  clearNotifications: () => {
    set({ notifications: [], unreadCount: 0 });
  },
  
  toggleSound: () => {
    set((state) => ({ soundEnabled: !state.soundEnabled }));
  },
}));
