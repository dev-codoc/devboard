'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/register', form);
      localStorage.setItem('token', data.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white text-black p-8 rounded-xl shadow-sm border w-full max-w-sm space-y-4">
        <h1 className="text-xl font-semibold">Create account</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input className="text-black w-full border rounded-lg px-3 py-2 text-sm" placeholder="Name"
          value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
        <input className="text-black w-full border rounded-lg px-3 py-2 text-sm" placeholder="Email" type="email"
          value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
        <input className="text-black w-full border rounded-lg px-3 py-2 text-sm" placeholder="Password" type="password"
          value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
        <button type="submit" className="w-full bg-black text-white rounded-lg py-2 text-sm font-medium">
          Register
        </button>
        <p className="text-sm text-center text-gray-500">Already have an account? <a href="/login" className="underline">Login</a></p>
      </form>
    </div>
  );
}