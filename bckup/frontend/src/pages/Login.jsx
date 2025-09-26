import React, { useState } from 'react';
import { login } from '../api';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password');
  const [err, setErr] = useState('');

  async function submit(e) {
    e.preventDefault();
    setErr('');
    try {
      const res = await login(email, password);
      onLogin(res.user, res.token);
    } catch (e) {
      setErr(e.message || 'Login failed');
    }
  }

  return (
    <form onSubmit={submit}>
      <div>
        <label>Email</label><br/>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@acme.test" required/>
      </div>
      <div>
        <label>Password</label><br/>
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" required/>
      </div>
      <button style={{ marginTop: 8 }} type="submit">Login</button>
      {err && <div style={{ color: 'red' }}>{err}</div>}
      <p>Test accounts (password = <code>password</code>): admin@acme.test, user@acme.test, admin@globex.test, user@globex.test</p>
    </form>
  );
}
