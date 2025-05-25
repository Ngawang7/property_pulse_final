'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const SignInForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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

    try {
      console.log('Attempting to sign in with email:', formData.email);
      
      const res = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      console.log('Sign in response:', res);

      if (!res) {
        throw new Error('No response from authentication provider');
      }

      if (res.error) {
        console.error('Sign in error:', res.error);
        toast.error(res.error || 'Invalid credentials');
        return;
      }

      if (!res.ok) {
        console.error('Sign in not ok:', res);
        toast.error('Authentication failed');
        return;
      }

      console.log('Sign in successful, redirecting...');
      toast.success('Signed in successfully');
      
      // Add a small delay before redirecting
      await new Promise(resolve => setTimeout(resolve, 500));
      
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          value={formData.password}
          onChange={handleChange}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
};

export default SignInForm; 