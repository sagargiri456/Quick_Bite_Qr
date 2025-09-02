'use client';
import React, { useState, FormEvent } from 'react';
import { MapPin, Phone, Mail, User, Calendar, QrCode, CreditCard, Edit, Save, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Restaurant, RestaurantProfileProps, ValidationErrors } from '@/types/restaurant'; // CORRECTED IMPORT
import { formatDate, getInitials } from '@/lib/utils'; // CORRECTED IMPORT

const RestaurantProfile: React.FC<RestaurantProfileProps> = ({ restaurant, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState({
    owner_name: restaurant.owner_name,
    restaurant_name: restaurant.restaurant_name,
    email: restaurant.email,
    phone: restaurant.phone,
    address: restaurant.address,
    upi_id: restaurant.upi_id,
    logo_url: restaurant.logo_url || "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    if (formData.owner_name.length < 2) newErrors.owner_name = "Owner name must be at least 2 characters";
    if (formData.restaurant_name.length < 2) newErrors.restaurant_name = "Restaurant name must be at least 2 characters";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Please enter a valid email address";
    if (!/^\+?[1-9]\d{9,14}$/.test(formData.phone)) newErrors.phone = "Please enter a valid phone number";
    if (formData.address.length < 10) newErrors.address = "Address must be at least 10 characters long";
    if (!/^[\w.-]+@[\w.-]+$/.test(formData.upi_id)) newErrors.upi_id = "Please enter a valid UPI ID (e.g., name@bank)";
    if (formData.logo_url && !/^https?:\/\/.+/.test(formData.logo_url)) newErrors.logo_url = "Please enter a valid URL";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleEditToggle = () => {
    const isCurrentlyEditing = !isEditing;
    setIsEditing(isCurrentlyEditing);
    // If we are canceling the edit, reset the form data
    if (!isCurrentlyEditing) {
        setFormData({
            owner_name: restaurant.owner_name,
            restaurant_name: restaurant.restaurant_name,
            email: restaurant.email,
            phone: restaurant.phone,
            address: restaurant.address,
            upi_id: restaurant.upi_id,
            logo_url: restaurant.logo_url || "",
        });
        setErrors({});
    }
  };
  
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error for the field being edited
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showNotification('error', 'Please correct the errors before saving.');
      return;
    }
    if (!onUpdate) return;

    setIsLoading(true);
    setNotification(null);
    try {
      await onUpdate({
        ...formData,
        logo_url: formData.logo_url || null, // Convert empty string to null for the database
      });
      setIsEditing(false);
      showNotification('success', 'Your profile has been updated successfully!');
    } catch (error: any) {
      showNotification('error', `Update failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {notification && (
          <Alert variant={notification.type === 'error' ? 'destructive' : 'default'} className="animate-in fade-in">
            {notification.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <AlertDescription>{notification.message}</AlertDescription>
          </Alert>
        )}
        
        <Card className="overflow-hidden border-0 shadow-xl">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                  <AvatarImage src={formData.logo_url || ""} alt={formData.restaurant_name} />
                  <AvatarFallback className="text-orange-500 text-lg font-bold">
                    {getInitials(formData.restaurant_name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">{formData.restaurant_name}</h1>
                  <p className="text-orange-100 text-lg">Owner: {formData.owner_name}</p>
                  <Badge variant="secondary" className="mt-2 bg-white/20 text-white">
                    <Calendar className="mr-1 h-3 w-3" />
                    Since {formatDate(restaurant.created_at)}
                  </Badge>
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleEditToggle}
                className="bg-white/20 hover:bg-white/30 border-0"
                disabled={isLoading}
              >
                {isEditing ? <X className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>
          </div>
        </Card>

        {isEditing ? (
            <Card className="shadow-lg animate-in fade-in">
                 <CardHeader>
                     <CardTitle>Edit Restaurant Information</CardTitle>
                     <CardDescription>Update your restaurant details below.</CardDescription>
                 </CardHeader>
                 <CardContent>
                     <form onSubmit={handleSubmit} className="space-y-6">
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="restaurant_name" className="text-sm font-medium">Restaurant Name</label>
                                <Input id="restaurant_name" value={formData.restaurant_name} onChange={e => handleInputChange('restaurant_name', e.target.value)} aria-invalid={!!errors.restaurant_name} />
                                {errors.restaurant_name && <p className="text-sm text-red-500">{errors.restaurant_name}</p>}
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="owner_name" className="text-sm font-medium">Owner Name</label>
                                <Input id="owner_name" value={formData.owner_name} onChange={e => handleInputChange('owner_name', e.target.value)} aria-invalid={!!errors.owner_name} />
                                {errors.owner_name && <p className="text-sm text-red-500">{errors.owner_name}</p>}
                            </div>
                         </div>
                         <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                            <Input id="email" type="email" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} aria-invalid={!!errors.email} />
                            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                         </div>
                         <div className="space-y-2">
                            <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                            <Input id="phone" value={formData.phone} onChange={e => handleInputChange('phone', e.target.value)} aria-invalid={!!errors.phone} />
                            {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                         </div>
                         <div className="space-y-2">
                            <label htmlFor="address" className="text-sm font-medium">Restaurant Address</label>
                            <Textarea id="address" value={formData.address} onChange={e => handleInputChange('address', e.target.value)} aria-invalid={!!errors.address} />
                            {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                         </div>
                         <div className="space-y-2">
                            <label htmlFor="upi_id" className="text-sm font-medium">UPI ID</label>
                            <Input id="upi_id" value={formData.upi_id} onChange={e => handleInputChange('upi_id', e.target.value)} aria-invalid={!!errors.upi_id} />
                            {errors.upi_id && <p className="text-sm text-red-500">{errors.upi_id}</p>}
                         </div>
                         <div className="space-y-2">
                            <label htmlFor="logo_url" className="text-sm font-medium">Logo URL (Optional)</label>
                            <Input id="logo_url" value={formData.logo_url} onChange={e => handleInputChange('logo_url', e.target.value)} aria-invalid={!!errors.logo_url} />
                            {errors.logo_url && <p className="text-sm text-red-500">{errors.logo_url}</p>}
                         </div>
                         <Separator />
                         <div className="flex justify-end gap-3">
                            <Button type="button" variant="outline" onClick={handleEditToggle} disabled={isLoading}>Cancel</Button>
                            <Button type="submit" disabled={isLoading} className="bg-orange-500 hover:bg-orange-600">
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                Save Changes
                            </Button>
                         </div>
                     </form>
                 </CardContent>
            </Card>
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-slate-800">
                                <User className="h-5 w-5 text-orange-500" /> Restaurant Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 text-sm">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div><p className="text-muted-foreground">Owner Name</p><p className="font-medium text-base">{restaurant.owner_name}</p></div>
                                <div><p className="text-muted-foreground">Phone</p><p className="font-medium text-base">{restaurant.phone}</p></div>
                            </div>
                            <div><p className="text-muted-foreground">Email Address</p><p className="font-medium text-base">{restaurant.email}</p></div>
                            <div><p className="text-muted-foreground">Address</p><p className="font-medium text-base">{restaurant.address}</p></div>
                            <div><p className="text-muted-foreground">UPI ID</p><Badge variant="outline">{restaurant.upi_id}</Badge></div>
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-6">
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-slate-800">
                                <QrCode className="h-5 w-5 text-orange-500" /> Payment QR Code
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <div className="inline-block p-4 bg-gray-50 rounded-lg border">
                                <img src={restaurant.qr_url} alt="Payment QR Code" className="w-40 h-40 mx-auto" />
                            </div>
                            <Badge variant="secondary" className="mt-4 font-mono">{restaurant.upi_id}</Badge>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantProfile;

