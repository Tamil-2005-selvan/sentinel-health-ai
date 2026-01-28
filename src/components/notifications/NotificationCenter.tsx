import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Bell,
  Volume2,
  VolumeX,
  CheckCheck,
  Trash2,
  AlertOctagon,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotificationStore, Notification } from "@/hooks/use-notifications";
import { cn } from "@/lib/utils";

const NotificationCenter: React.FC = () => {
  const {
    notifications,
    unreadCount,
    soundEnabled,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    toggleSound,
  } = useNotificationStore();

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    return date.toLocaleDateString();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-primary/5"
        >
          <Bell className="w-5 h-5 text-muted-foreground" />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-status-critical rounded-full"
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-96 p-0 bg-white/95 backdrop-blur-xl border border-white/20 shadow-xl rounded-xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50 bg-muted/30">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium bg-status-critical/10 text-status-critical rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={toggleSound}
              title={soundEnabled ? "Mute sounds" : "Enable sounds"}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-secondary" />
              ) : (
                <VolumeX className="w-4 h-4 text-muted-foreground" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={markAllAsRead}
              title="Mark all as read"
            >
              <CheckCheck className="w-4 h-4 text-muted-foreground" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={clearNotifications}
              title="Clear all"
            >
              <Trash2 className="w-4 h-4 text-muted-foreground" />
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <ScrollArea className="max-h-96">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Bell className="w-12 h-12 mb-3 opacity-20" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              <AnimatePresence>
                {notifications.map((notification, index) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onRead={() => markAsRead(notification.id)}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-border/50 bg-muted/20">
            <Link to="/dashboard">
              <Button
                variant="ghost"
                className="w-full text-sm text-primary hover:bg-primary/5"
              >
                View All Alerts
              </Button>
            </Link>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface NotificationItemProps {
  notification: Notification;
  onRead: () => void;
  index: number;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onRead,
  index,
}) => {
  const { status, patientId, message, timestamp, read, riskScore } = notification;

  const StatusIcon =
    status === "critical"
      ? AlertOctagon
      : status === "warning"
      ? AlertTriangle
      : CheckCircle;

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      onClick={onRead}
      className={cn(
        "relative p-4 cursor-pointer transition-colors hover:bg-muted/50",
        !read && "bg-primary/5",
        status === "critical" && !read && "bg-status-critical/5"
      )}
    >
      {/* Unread indicator */}
      {!read && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={cn(
            "absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full",
            status === "critical"
              ? "bg-status-critical"
              : status === "warning"
              ? "bg-status-warning"
              : "bg-status-normal"
          )}
        />
      )}

      <div className="flex gap-3 pl-3">
        <div
          className={cn(
            "flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl",
            status === "critical" && "bg-status-critical/10",
            status === "warning" && "bg-status-warning/10",
            status === "normal" && "bg-status-normal/10"
          )}
        >
          <StatusIcon
            className={cn(
              "w-5 h-5",
              status === "critical" && "text-status-critical",
              status === "warning" && "text-status-warning",
              status === "normal" && "text-status-normal"
            )}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-semibold text-sm text-foreground">
              {patientId}
            </span>
            <span
              className={cn(
                "text-xs font-medium px-2 py-0.5 rounded-full",
                status === "critical" &&
                  "bg-status-critical/10 text-status-critical",
                status === "warning" &&
                  "bg-status-warning/10 text-status-warning",
                status === "normal" && "bg-status-normal/10 text-status-normal"
              )}
            >
              Risk: {riskScore}%
            </span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{message}</p>
          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{formatTime(timestamp)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export { NotificationCenter };
