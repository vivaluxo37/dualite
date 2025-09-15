import { useUser } from '@clerk/clerk-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Mail, Phone, Calendar, Shield, Edit2, Save, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function ProfilePage() {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: ''
  });

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    navigate('/');
    return null;
  }

  const handleEdit = () => {
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      username: user.username || ''
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await user.update({
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatDate = (dateValue: string | Date | null) => {
    if (!dateValue) return 'Never';
    return new Date(dateValue).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account information and preferences</p>
        </div>

        <div className="grid gap-6">
          {/* Profile Overview Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user.imageUrl} alt={user.fullName || ''} />
                    <AvatarFallback className="text-lg">
                      {user.firstName && user.lastName
                        ? getInitials(user.firstName, user.lastName)
                        : user.emailAddresses[0]?.emailAddress.charAt(0).toUpperCase() || 'U'
                      }
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-xl text-gray-900">{user.fullName || 'User'}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1 text-gray-600">
                      <Mail className="h-4 w-4" />
                      {user.emailAddresses[0]?.emailAddress}
                    </CardDescription>
                  </div>
                </div>

                {!isEditing ? (
                  <Button onClick={handleEdit} variant="outline">
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button onClick={handleCancel} variant="outline">
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-gray-900">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="Enter your first name"
                      className="bg-white border-gray-300 text-gray-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-gray-900">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Enter your last name"
                      className="bg-white border-gray-300 text-gray-900"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="username" className="text-gray-900">Username</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      placeholder="Choose a username"
                      className="bg-white border-gray-300 text-gray-900"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">First Name:</span>
                    <span className="font-medium text-gray-900">{user.firstName || 'Not set'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Last Name:</span>
                    <span className="font-medium text-gray-900">{user.lastName || 'Not set'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Username:</span>
                    <span className="font-medium text-gray-900">{user.username || 'Not set'}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Account Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Member Since:</span>
                  <span className="font-medium text-gray-900">{formatDate(user.createdAt)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Last Login:</span>
                  <span className="font-medium text-gray-900">{formatDate(user.lastSignInAt)}</span>
                </div>
              </div>

              {user.publicMetadata && Object.keys(user.publicMetadata).length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Account Type</h4>
                  <div className="flex flex-wrap gap-2">
                    {(user.publicMetadata as any).role && (
                      <Badge className="bg-gray-100 text-gray-800">
                        {String((user.publicMetadata as any).role)}
                      </Badge>
                    )}
                    {(user.publicMetadata as any).isSuperAdmin && (
                      <Badge className="bg-blue-100 text-blue-800">
                        Super Admin
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Email Addresses Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Addresses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {user.emailAddresses.map((email) => (
                  <div key={email.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <div>
                        <span className="font-medium text-gray-900">{email.emailAddress}</span>
                        {email.verification?.status === 'verified' && (
                          <Badge variant="outline" className="ml-2 border-gray-300 text-gray-700">
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                    {email.id === user.primaryEmailAddressId && (
                      <Badge variant="default" className="bg-blue-600">Primary</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Security Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium text-gray-900">Two-Factor Authentication</span>
                    <p className="text-sm text-gray-600">
                      {user.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                  <Badge
                    variant={user.twoFactorEnabled ? 'default' : 'secondary'}
                    className={user.twoFactorEnabled ? 'bg-green-600' : 'bg-gray-200 text-gray-700'}
                  >
                    {user.twoFactorEnabled ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium text-gray-900">Password Protection</span>
                    <p className="text-sm text-gray-600">
                      {user.passwordEnabled ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                  <Badge
                    variant={user.passwordEnabled ? 'default' : 'secondary'}
                    className={user.passwordEnabled ? 'bg-green-600' : 'bg-gray-200 text-gray-700'}
                  >
                    {user.passwordEnabled ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}