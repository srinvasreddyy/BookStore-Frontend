import React, { useState } from 'react';
import { apiPost } from '../lib/api';
import toast from 'react-hot-toast';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleShow = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    
    try {
      await apiPost('/users/change-password', {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword
      });
      toast.success("Password changed successfully.");
      setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.message || "Failed to change password.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-center">Change Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Old Password */}
        <div className="relative">
            <label className="block text-sm font-medium mb-1">Old Password</label>
            <input
              type={showPassword.old ? "text" : "password"}
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-black focus:border-black"
              required
            />
             <button type="button" onClick={() => toggleShow('old')} className="absolute right-3 top-9 text-gray-500">
                {showPassword.old ? <FiEyeOff /> : <FiEye />}
             </button>
        </div>

        {/* New Password */}
        <div className="relative">
            <label className="block text-sm font-medium mb-1">New Password</label>
            <input
              type={showPassword.new ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-black focus:border-black"
              required
            />
            <button type="button" onClick={() => toggleShow('new')} className="absolute right-3 top-9 text-gray-500">
                {showPassword.new ? <FiEyeOff /> : <FiEye />}
             </button>
        </div>

        {/* Confirm Password */}
        <div className="relative">
            <label className="block text-sm font-medium mb-1">Confirm New Password</label>
            <input
              type={showPassword.confirm ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-black focus:border-black"
              required
            />
            <button type="button" onClick={() => toggleShow('confirm')} className="absolute right-3 top-9 text-gray-500">
                {showPassword.confirm ? <FiEyeOff /> : <FiEye />}
             </button>
        </div>

        <button type="submit" className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition">
          Update Password
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;