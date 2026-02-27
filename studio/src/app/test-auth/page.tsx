'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function TestAuthPage() {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8081/api';

  const testLogin = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      console.log('Testing login to:', `${API_BASE}/auth/login`);
      console.log('Credentials:', { email, password: '***' });

      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      console.log('Response status:', res.status);
      console.log('Response headers:', Object.fromEntries(res.headers.entries()));

      const data = await res.json();
      console.log('Response data:', data);

      if (!res.ok) {
        setError(`Error ${res.status}: ${data.error || data.message || 'Unknown error'}`);
      } else {
        setResult(data);
      }
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>🔍 Authentication Debug Tool</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>API Base URL</Label>
            <Input value={API_BASE} readOnly className="font-mono text-sm" />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
            />
          </div>

          <Button onClick={testLogin} disabled={loading} className="w-full">
            {loading ? 'Testing...' : 'Test Login'}
          </Button>

          {error && (
            <div className="p-4 bg-red-100 border border-red-400 rounded text-red-700">
              <strong>Error:</strong> {error}
            </div>
          )}

          {result && (
            <div className="space-y-2">
              <div className="p-4 bg-green-100 border border-green-400 rounded">
                <strong className="text-green-700">✅ Login Successful!</strong>
              </div>
              <div className="p-4 bg-gray-100 rounded">
                <h3 className="font-semibold mb-2">User Details:</h3>
                <pre className="text-xs overflow-auto">
                  {JSON.stringify(result.user, null, 2)}
                </pre>
              </div>
              <div className="p-4 bg-gray-100 rounded">
                <h3 className="font-semibold mb-2">Token:</h3>
                <pre className="text-xs overflow-auto break-all">
                  {result.token}
                </pre>
              </div>
            </div>
          )}

          <div className="pt-4 border-t">
            <h3 className="font-semibold mb-2">Quick Test Accounts:</h3>
            <div className="space-y-2 text-sm">
              <button
                onClick={() => {
                  setEmail('admin@example.com');
                  setPassword('admin123');
                }}
                className="block w-full text-left p-2 hover:bg-gray-100 rounded"
              >
                👤 Admin: admin@example.com / admin123
              </button>
              <button
                onClick={() => {
                  setEmail('user@example.com');
                  setPassword('user123');
                }}
                className="block w-full text-left p-2 hover:bg-gray-100 rounded"
              >
                👤 User: user@example.com / user123
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
