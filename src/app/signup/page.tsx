'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signUpWithRestaurant, SignUpData } from '@/lib/auth/signup';
import { Loader2 } from 'lucide-react';

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
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await signUpWithRestaurant(formData);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 p-4 sm:p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 text-center">Create Your Account</h1>
          <p className="text-gray-600 mt-2 text-center">Set up your restaurant profile to get started.</p>

          {success ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-green-600">Registration Successful!</h2>
              <p className="mt-2 text-gray-700">Please check your email to confirm your account before logging in.</p>
              <Link href="/signup/login" className="mt-6 inline-block bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg">
                Go to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              {/* --- MODIFICATION: Added 'text-gray-900' to all inputs --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input name="owner_name" type="text" placeholder="Owner's Name" value={formData.owner_name} onChange={handleChange} required className="w-full p-3 border-2 rounded-lg text-gray-900" />
                <input name="restaurant_name" type="text" placeholder="Restaurant Name" value={formData.restaurant_name} onChange={handleChange} required className="w-full p-3 border-2 rounded-lg text-gray-900" />
                <input name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required className="w-full p-3 border-2 rounded-lg text-gray-900" />
                <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="w-full p-3 border-2 rounded-lg text-gray-900" />
                <input name="phone" type="tel" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required className="w-full p-3 border-2 rounded-lg text-gray-900" />
                <input name="address" type="text" placeholder="Address" value={formData.address} onChange={handleChange} required className="w-full p-3 border-2 rounded-lg text-gray-900" />
              </div>
              <input name="upi_id" type="text" placeholder="UPI ID (for payments)" value={formData.upi_id} onChange={handleChange} required className="w-full p-3 border-2 rounded-lg text-gray-900" />
              
              {error && <p className="text-red-500 text-center">{error}</p>}

              <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold p-3 rounded-lg flex items-center justify-center disabled:opacity-50">
                {isSubmitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                {isSubmitting ? 'Registering...' : 'Create Account'}
              </button>
              <p className="text-center text-gray-600">
                Already have an account?{' '}
                <Link href="/signup/login" className="font-semibold text-indigo-600 hover:underline">
                  Log In
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
