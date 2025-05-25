'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const RegisterForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate passwords match
    if (formData.password !== formData.password2) {
      toast.error('Passwords do not match', {
        position: "top-center",
        autoClose: 3000,
      });
      setLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters', {
        position: "top-center",
        autoClose: 3000,
      });
      setLoading(false);
      return;
    }

    try {
      // Show loading toast
      const loadingToast = toast.loading('Creating your account...', {
        position: "top-center",
      });

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          password2: formData.password2,
        }),
      });

      const data = await res.json();

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      // Show success message
      toast.success('Account created successfully!', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Clear form
      setFormData({
        username: '',
        email: '',
        password: '',
        password2: '',
      });

      // Wait for 2 seconds before redirecting
      setTimeout(() => {
        router.push('/auth/signin');
      }, 2000);

    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Error during registration', {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="username" className="block mb-2 text-sm font-medium">
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          className="w-full px-3 py-2 border rounded-lg"
          placeholder="Enter your username"
          required
          value={formData.username}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="email" className="block mb-2 text-sm font-medium">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="w-full px-3 py-2 border rounded-lg"
          placeholder="Enter your email"
          required
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="password" className="block mb-2 text-sm font-medium">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          className="w-full px-3 py-2 border rounded-lg"
          placeholder="Enter your password"
          required
          minLength={6}
          value={formData.password}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="password2" className="block mb-2 text-sm font-medium">
          Confirm Password
        </label>
        <input
          type="password"
          id="password2"
          name="password2"
          className="w-full px-3 py-2 border rounded-lg"
          placeholder="Confirm your password"
          required
          minLength={6}
          value={formData.password2}
          onChange={handleChange}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50"
      >
        {loading ? 'Creating Account...' : 'Register'}
      </button>
    </form>
  );
};

export default RegisterForm; 