'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { signUpWithRestaurant, SignUpData } from '@/lib/auth/signup';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

// Lazy load loader icon
const Loader2 = dynamic(() => import('lucide-react').then(m => m.Loader2));

export default function SignUpPage() {
  const [formData, setFormData] = useState<SignUpData>({
    email: '',
    password: '',
    owner_name: '',
    restaurant_name: '',
    phone: '',
    address: '',
    upi_id: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  // Detect offline/online
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isOffline) return;

    setError(null);
    setIsSubmitting(true);

    try {
      await signUpWithRestaurant(formData);
      setSuccess(true);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 p-4 sm:p-8 flex items-center justify-center">
      <motion.div
        className="max-w-2xl w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 text-center">Create Your Account</h1>
          <p className="text-gray-600 mt-2 text-center">
            Set up your restaurant profile to get started.
          </p>

          {isOffline && (
            <p className="mt-3 text-center text-sm text-red-600 font-medium bg-red-100 p-2 rounded-lg">
              You’re offline. Please reconnect to continue.
            </p>
          )}

          {success ? (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-semibold text-green-600">
                Registration Successful!
              </h2>
              <p className="mt-2 text-gray-700">
                Please check your email to confirm your account before logging in.
              </p>
              <Link
                href="/login"
                className="mt-6 inline-block bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg"
              >
                Go to Login
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input name="owner_name" type="text" placeholder="Owner's Name" value={formData.owner_name} onChange={handleChange} required className="w-full p-3 border-2 rounded-lg text-gray-900" disabled={isOffline}/>
                <input name="restaurant_name" type="text" placeholder="Restaurant Name" value={formData.restaurant_name} onChange={handleChange} required className="w-full p-3 border-2 rounded-lg text-gray-900" disabled={isOffline}/>
                <input name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required className="w-full p-3 border-2 rounded-lg text-gray-900" disabled={isOffline}/>
                <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="w-full p-3 border-2 rounded-lg text-gray-900" disabled={isOffline}/>
                <input name="phone" type="tel" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required className="w-full p-3 border-2 rounded-lg text-gray-900" disabled={isOffline}/>
                <input name="address" type="text" placeholder="Address" value={formData.address} onChange={handleChange} required className="w-full p-3 border-2 rounded-lg text-gray-900" disabled={isOffline}/>
              </div>
              <input name="upi_id" type="text" placeholder="UPI ID (for payments)" value={formData.upi_id} onChange={handleChange} required className="w-full p-3 border-2 rounded-lg text-gray-900" disabled={isOffline}/>
              
              {error && (
                <motion.p
                  className="text-red-500 text-center"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {error}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={isSubmitting || isOffline}
                className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold p-3 rounded-lg flex items-center justify-center disabled:opacity-50"
              >
                {isSubmitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                {isSubmitting ? 'Registering...' : 'Create Account'}
              </button>

              <p className="text-center text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="font-semibold text-indigo-600 hover:underline">
                  Log In
                </Link>
              </p>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
