import React, { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Bell,
  Shield,
  Settings,
  Camera,
  Mail,
  Phone,
  MapPin,
  Building,
  Stethoscope,
  Volume2,
  VolumeX,
  AlertTriangle,
  AlertOctagon,
  CheckCircle,
  Save,
  Lock,
  Eye,
  EyeOff,
  Accessibility,
} from "lucide-react";
import { toast } from "sonner";
import { useNotificationStore } from "@/hooks/use-notifications";
import AccessibilityPreferences from "@/components/settings/AccessibilityPreferences";

const DoctorProfile: React.FC = () => {
  const { soundEnabled, toggleSound } = useNotificationStore();
  
  // Profile state
  const [profile, setProfile] = useState({
    firstName: "Sarah",
    lastName: "Smith",
    email: "dr.smith@hospital.com",
    phone: "+1 (555) 123-4567",
    department: "Cardiology",
    specialization: "Interventional Cardiology",
    licenseNumber: "MD-2024-78945",
    hospitalId: "HSP-001",
    address: "123 Medical Center Drive, Suite 400",
  });

  // Notification preferences
  const [notifications, setNotifications] = useState({
    criticalAlerts: true,
    warningAlerts: true,
    normalUpdates: false,
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    quietHoursEnabled: false,
    quietHoursStart: "22:00",
    quietHoursEnd: "07:00",
    alertFrequency: "immediate",
  });

  // Password state
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleSaveProfile = () => {
    toast.success("Profile updated successfully");
  };

  const handleSaveNotifications = () => {
    toast.success("Notification preferences saved");
  };

  const handleChangePassword = () => {
    if (passwords.new !== passwords.confirm) {
      toast.error("New passwords do not match");
      return;
    }
    if (passwords.new.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    toast.success("Password changed successfully");
    setPasswords({ current: "", new: "", confirm: "" });
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
            <Settings className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">
              Account Settings
            </h1>
          </div>
          <p className="text-muted-foreground">
            Manage your profile, notification preferences, and account security
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Profile Card */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="glass-card p-6 text-center">
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <User className="w-12 h-12 text-white" />
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-background border-2 border-primary flex items-center justify-center hover:bg-primary/10 transition-colors">
                  <Camera className="w-4 h-4 text-primary" />
                </button>
              </div>
              <h2 className="text-xl font-bold text-foreground">
                Dr. {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-muted-foreground text-sm mb-3">
                {profile.specialization}
              </p>
              <Badge variant="secondary" className="mb-4">
                <Shield className="w-3 h-3 mr-1" />
                Admin Access
              </Badge>
              <Separator className="my-4" />
              <div className="space-y-2 text-left text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building className="w-4 h-4" />
                  <span>{profile.department}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Stethoscope className="w-4 h-4" />
                  <span>{profile.licenseNumber}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Settings Tabs */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="profile" className="gap-2">
                  <User className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Profile</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="gap-2">
                  <Bell className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Notifications</span>
                </TabsTrigger>
                <TabsTrigger value="accessibility" className="gap-2">
                  <Accessibility className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Accessibility</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="gap-2">
                  <Shield className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Security</span>
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <div className="glass-card p-6">
                  <h3 className="text-lg font-semibold mb-6">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profile.firstName}
                        onChange={(e) =>
                          setProfile({ ...profile, firstName: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profile.lastName}
                        onChange={(e) =>
                          setProfile({ ...profile, lastName: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) =>
                            setProfile({ ...profile, email: e.target.value })
                          }
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          value={profile.phone}
                          onChange={(e) =>
                            setProfile({ ...profile, phone: e.target.value })
                          }
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Select
                        value={profile.department}
                        onValueChange={(value) =>
                          setProfile({ ...profile, department: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cardiology">Cardiology</SelectItem>
                          <SelectItem value="Neurology">Neurology</SelectItem>
                          <SelectItem value="Emergency">Emergency</SelectItem>
                          <SelectItem value="ICU">ICU</SelectItem>
                          <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                          <SelectItem value="Oncology">Oncology</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specialization">Specialization</Label>
                      <Input
                        id="specialization"
                        value={profile.specialization}
                        onChange={(e) =>
                          setProfile({ ...profile, specialization: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="address"
                          value={profile.address}
                          onChange={(e) =>
                            setProfile({ ...profile, address: e.target.value })
                          }
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-6">
                    <Button onClick={handleSaveProfile} className="gap-2">
                      <Save className="w-4 h-4" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications">
                <div className="glass-card p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Alert Preferences</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                        <div className="flex items-center gap-3">
                          <AlertOctagon className="w-5 h-5 text-destructive" />
                          <div>
                            <p className="font-medium">Critical Alerts</p>
                            <p className="text-sm text-muted-foreground">
                              Immediate notification for critical patients
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={notifications.criticalAlerts}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, criticalAlerts: checked })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-lg bg-warning/5 border border-warning/20">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="w-5 h-5 text-warning" />
                          <div>
                            <p className="font-medium">Warning Alerts</p>
                            <p className="text-sm text-muted-foreground">
                              Notify when patients need attention
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={notifications.warningAlerts}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, warningAlerts: checked })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/5 border border-secondary/20">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-secondary" />
                          <div>
                            <p className="font-medium">Normal Updates</p>
                            <p className="text-sm text-muted-foreground">
                              Regular status updates for stable patients
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={notifications.normalUpdates}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, normalUpdates: checked })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Delivery Channels</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <Bell className="w-5 h-5 text-primary" />
                          <span>Push</span>
                        </div>
                        <Switch
                          checked={notifications.pushNotifications}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, pushNotifications: checked })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-primary" />
                          <span>Email</span>
                        </div>
                        <Switch
                          checked={notifications.emailNotifications}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, emailNotifications: checked })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-primary" />
                          <span>SMS</span>
                        </div>
                        <Switch
                          checked={notifications.smsNotifications}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, smsNotifications: checked })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Sound Settings</h3>
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center gap-3">
                        {soundEnabled ? (
                          <Volume2 className="w-5 h-5 text-primary" />
                        ) : (
                          <VolumeX className="w-5 h-5 text-muted-foreground" />
                        )}
                        <div>
                          <p className="font-medium">Sound Notifications</p>
                          <p className="text-sm text-muted-foreground">
                            Play audio alerts for critical notifications
                          </p>
                        </div>
                      </div>
                      <Switch checked={soundEnabled} onCheckedChange={toggleSound} />
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Quiet Hours</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-lg border">
                        <div>
                          <p className="font-medium">Enable Quiet Hours</p>
                          <p className="text-sm text-muted-foreground">
                            Silence non-critical notifications during specified hours
                          </p>
                        </div>
                        <Switch
                          checked={notifications.quietHoursEnabled}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, quietHoursEnabled: checked })
                          }
                        />
                      </div>
                      {notifications.quietHoursEnabled && (
                        <div className="grid grid-cols-2 gap-4 pl-4">
                          <div className="space-y-2">
                            <Label>Start Time</Label>
                            <Input
                              type="time"
                              value={notifications.quietHoursStart}
                              onChange={(e) =>
                                setNotifications({
                                  ...notifications,
                                  quietHoursStart: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>End Time</Label>
                            <Input
                              type="time"
                              value={notifications.quietHoursEnd}
                              onChange={(e) =>
                                setNotifications({
                                  ...notifications,
                                  quietHoursEnd: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSaveNotifications} className="gap-2">
                      <Save className="w-4 h-4" />
                      Save Preferences
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Accessibility Tab */}
              <TabsContent value="accessibility">
                <div className="glass-card p-6">
                  <h3 className="text-lg font-semibold mb-6">Accessibility Preferences</h3>
                  <AccessibilityPreferences />
                </div>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security">
                <div className="glass-card p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                    <div className="space-y-4 max-w-md">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="currentPassword"
                            type={showCurrentPassword ? "text" : "password"}
                            value={passwords.current}
                            onChange={(e) =>
                              setPasswords({ ...passwords, current: e.target.value })
                            }
                            className="pl-10 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            value={passwords.new}
                            onChange={(e) =>
                              setPasswords({ ...passwords, new: e.target.value })
                            }
                            className="pl-10 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showNewPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={passwords.confirm}
                            onChange={(e) =>
                              setPasswords({ ...passwords, confirm: e.target.value })
                            }
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <Button onClick={handleChangePassword} className="gap-2">
                        <Lock className="w-4 h-4" />
                        Change Password
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Two-Factor Authentication</h3>
                    <div className="flex items-center justify-between p-4 rounded-lg border max-w-md">
                      <div>
                        <p className="font-medium">2FA Status</p>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security
                        </p>
                      </div>
                      <Badge variant="outline" className="text-secondary border-secondary">
                        Enabled
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Active Sessions</h3>
                    <div className="space-y-3 max-w-md">
                      <div className="flex items-center justify-between p-4 rounded-lg border bg-primary/5">
                        <div>
                          <p className="font-medium">Current Session</p>
                          <p className="text-sm text-muted-foreground">
                            Chrome on Windows • Active now
                          </p>
                        </div>
                        <Badge variant="secondary">Current</Badge>
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-lg border">
                        <div>
                          <p className="font-medium">Mobile App</p>
                          <p className="text-sm text-muted-foreground">
                            iOS • Last active 2h ago
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Revoke
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default DoctorProfile;
