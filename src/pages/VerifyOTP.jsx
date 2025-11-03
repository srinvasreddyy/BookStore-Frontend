import React, { useState } from 'react';
import { Link, useNavigate, useSearch } from '@tanstack/react-router';
import { FiMail } from 'react-icons/fi';
import { apiPost } from '../lib/api';
import toast from 'react-hot-toast';
import logo from '../assets/logo.png';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { email } = useSearch({ from: '/verify-otp' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await apiPost('/users/verify-otp', { email, otp });
      toast.success('OTP verified successfully!');
      // Navigate to reset password page with email and otp
      navigate({ to: '/reset-password', search: { email, otp } });
    } catch (error) {
      console.error('OTP verification failed:', error);
      toast.error(error.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      await apiPost('/users/forgot-password', { email });
      toast.success('OTP resent successfully!');
    } catch (error) {
      console.error('Resend OTP failed:', error);
      toast.error(error.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-flex mb-5 items-center justify-center">
            <img src={logo} alt="Logo" className="w-auto h-16 mr-2" />
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Verify OTP</h2>
          <p className="mt-2 text-sm text-gray-600">
            We've sent a 6-digit code to {email}. Enter it below to continue.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* OTP Input */}
            <div>
              <label htmlFor="otp" className="sr-only">
                OTP Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  maxLength="6"
                  className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-black focus:border-black sm:text-sm text-center text-lg tracking-widest"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // Only allow digits
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.length !== 6}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>

          <div className="text-center space-y-2">
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={isLoading}
              className="text-sm text-black hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Didn't receive the code? Resend
            </button>
            <div>
              <Link to="/forgot-password" className="text-sm font-medium text-black hover:text-gray-800">
                Use different email
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;