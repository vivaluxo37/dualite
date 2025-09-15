import React, { useState } from 'react';
import { useClerkAuthContext } from '@/contexts/ClerkAuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Bell, User, Shield, Mail, Phone, Globe, Save, X } from 'lucide-react';
import { toast } from 'sonner';

interface UserSettings {
  email_notifications: boolean;
  push_notifications: boolean;
  marketing_emails: boolean;
  weekly_digest: boolean;
  price_alerts: boolean;
  broker_updates: boolean;
  educational_content: boolean;
  language: string;
  timezone: string;
  currency: string;
}

interface UserProfile {
  display_name: string;
  email: string;
  phone?: string;
  bio?: string;
  trading_experience: 'beginner' | 'intermediate' | 'advanced';
  trading_style: 'scalping' | 'day_trading' | 'swing_trading' | 'position_trading';
  risk_tolerance: 'low' | 'medium' | 'high';
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { userId, signOut } = useClerkAuthContext();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);

  // Settings state
  const [settings, setSettings] = useState<UserSettings>({
    email_notifications: true,
    push_notifications: true,
    marketing_emails: false,
    weekly_digest: true,
    price_alerts: true,
    broker_updates: true,
    educational_content: true,
    language: 'en',
    timezone: 'UTC',
    currency: 'USD'
  });

  // Profile state
  const [profile, setProfile] = useState<UserProfile>({
    display_name: '',
    email: '',
    phone: '',
    bio: '',
    trading_experience: 'beginner',
    trading_style: 'day_trading',
    risk_tolerance: 'medium'
  });

  const handleSettingsChange = (key: keyof UserSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleProfileChange = (key: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    setIsLoading(true);
    try {
      // Save to localStorage for now (in production, this would go to database)
      localStorage.setItem('user_settings', JSON.stringify(settings));
      localStorage.setItem('user_profile', JSON.stringify(profile));
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <Settings className="h-6 w-6" />
            <h2 className="text-2xl font-bold">Settings</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex h-[calc(90vh-120px)]">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 p-4 border-r">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-1 h-auto bg-transparent space-y-1">
                <TabsTrigger value="profile" className="w-full justify-start data-[state=active]:bg-white">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="notifications" className="w-full justify-start data-[state=active]:bg-white">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="preferences" className="w-full justify-start data-[state=active]:bg-white">
                  <Settings className="h-4 w-4 mr-2" />
                  Preferences
                </TabsTrigger>
                <TabsTrigger value="security" className="w-full justify-start data-[state=active]:bg-white">
                  <Shield className="h-4 w-4 mr-2" />
                  Security
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal information and trading preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="display_name">Display Name</Label>
                        <Input
                          id="display_name"
                          value={profile.display_name}
                          onChange={(e) => handleProfileChange('display_name', e.target.value)}
                          placeholder="Enter your name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => handleProfileChange('email', e.target.value)}
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone (Optional)</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => handleProfileChange('phone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <textarea
                        id="bio"
                        className="w-full p-2 border rounded-md"
                        rows={3}
                        value={profile.bio}
                        onChange={(e) => handleProfileChange('bio', e.target.value)}
                        placeholder="Tell us about your trading experience..."
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Trading Experience</Label>
                        <select
                          className="w-full p-2 border rounded-md"
                          value={profile.trading_experience}
                          onChange={(e) => handleProfileChange('trading_experience', e.target.value)}
                        >
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                        </select>
                      </div>
                      <div>
                        <Label>Trading Style</Label>
                        <select
                          className="w-full p-2 border rounded-md"
                          value={profile.trading_style}
                          onChange={(e) => handleProfileChange('trading_style', e.target.value)}
                        >
                          <option value="scalping">Scalping</option>
                          <option value="day_trading">Day Trading</option>
                          <option value="swing_trading">Swing Trading</option>
                          <option value="position_trading">Position Trading</option>
                        </select>
                      </div>
                      <div>
                        <Label>Risk Tolerance</Label>
                        <select
                          className="w-full p-2 border rounded-md"
                          value={profile.risk_tolerance}
                          onChange={(e) => handleProfileChange('risk_tolerance', e.target.value)}
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Choose what notifications you want to receive</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <div>
                          <div className="font-medium">Email Notifications</div>
                          <div className="text-sm text-gray-500">Receive notifications via email</div>
                        </div>
                      </div>
                      <Switch
                        checked={settings.email_notifications}
                        onCheckedChange={(checked) => handleSettingsChange('email_notifications', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <div>
                          <div className="font-medium">Push Notifications</div>
                          <div className="text-sm text-gray-500">Receive push notifications in browser</div>
                        </div>
                      </div>
                      <Switch
                        checked={settings.push_notifications}
                        onCheckedChange={(checked) => handleSettingsChange('push_notifications', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Bell className="h-4 w-4" />
                        <div>
                          <div className="font-medium">Price Alerts</div>
                          <div className="text-sm text-gray-500">Get notified about price changes</div>
                        </div>
                      </div>
                      <Switch
                        checked={settings.price_alerts}
                        onCheckedChange={(checked) => handleSettingsChange('price_alerts', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4" />
                        <div>
                          <div className="font-medium">Broker Updates</div>
                          <div className="text-sm text-gray-500">Updates about your saved brokers</div>
                        </div>
                      </div>
                      <Switch
                        checked={settings.broker_updates}
                        onCheckedChange={(checked) => handleSettingsChange('broker_updates', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Settings className="h-4 w-4" />
                        <div>
                          <div className="font-medium">Educational Content</div>
                          <div className="text-sm text-gray-500">New courses and learning materials</div>
                        </div>
                      </div>
                      <Switch
                        checked={settings.educational_content}
                        onCheckedChange={(checked) => handleSettingsChange('educational_content', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <div>
                          <div className="font-medium">Weekly Digest</div>
                          <div className="text-sm text-gray-500">Weekly summary of market activity</div>
                        </div>
                      </div>
                      <Switch
                        checked={settings.weekly_digest}
                        onCheckedChange={(checked) => handleSettingsChange('weekly_digest', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Bell className="h-4 w-4" />
                        <div>
                          <div className="font-medium">Marketing Emails</div>
                          <div className="text-sm text-gray-500">Promotional offers and updates</div>
                        </div>
                      </div>
                      <Switch
                        checked={settings.marketing_emails}
                        onCheckedChange={(checked) => handleSettingsChange('marketing_emails', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preferences" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>App Preferences</CardTitle>
                    <CardDescription>Customize your app experience</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Language</Label>
                        <select
                          className="w-full p-2 border rounded-md"
                          value={settings.language}
                          onChange={(e) => handleSettingsChange('language', e.target.value)}
                        >
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                        </select>
                      </div>
                      <div>
                        <Label>Timezone</Label>
                        <select
                          className="w-full p-2 border rounded-md"
                          value={settings.timezone}
                          onChange={(e) => handleSettingsChange('timezone', e.target.value)}
                        >
                          <option value="UTC">UTC</option>
                          <option value="EST">Eastern Time</option>
                          <option value="PST">Pacific Time</option>
                          <option value="GMT">GMT</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <Label>Currency</Label>
                      <select
                        className="w-full p-2 border rounded-md"
                        value={settings.currency}
                        onChange={(e) => handleSettingsChange('currency', e.target.value)}
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="JPY">JPY (¥)</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Manage your account security</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">Account Status</div>
                        <div className="text-sm text-gray-500">Your account is secure and active</div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">Two-Factor Authentication</div>
                        <div className="text-sm text-gray-500">Add an extra layer of security</div>
                      </div>
                      <Button variant="outline" size="sm">
                        Enable 2FA
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">Change Password</div>
                        <div className="text-sm text-gray-500">Update your account password</div>
                      </div>
                      <Button variant="outline" size="sm">
                        Change Password
                      </Button>
                    </div>
                    <div className="pt-4 border-t">
                      <Button variant="destructive" onClick={handleSignOut} className="w-full">
                        Sign Out
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-500">
            Changes are saved automatically
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={saveSettings} disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};