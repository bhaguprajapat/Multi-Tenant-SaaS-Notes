import React, { useEffect, useState } from 'react';
import { getNotes, createNote, deleteNote, upgradeTenant } from '../api';
import NoteItem from '../components/NoteItem';

export default function Notes({ user, onLogout }) {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [msg, setMsg] = useState('');

  async function load() {
    try {
      const res = await getNotes();
      setNotes(res);
    } catch (e) {
      setMsg('Error loading notes: ' + e.message);
    }
  }

  useEffect(() => { load(); }, []);

  async function add(e) {
    e.preventDefault();
    try {
      await createNote({ title, body });
      setTitle(''); setBody('');
      await load();
    } catch (err) {
      setMsg(err.message || 'Create failed');
    }
  }

  async function remove(id) {
    try {
      await deleteNote(id);
      await load();
    } catch (err) {
      setMsg(err.message || 'Delete failed');
    }
  }

  async function upgrade() {
    try {
      await upgradeTenant(user.tenantSlug);
      setMsg('Upgraded to Pro. You can create unlimited notes.');
      await load();
    } catch (err) {
      setMsg(err.message || 'Upgrade failed');
    }
  }

  const reachedLimit = notes.length >= 3 && user.tenantPlan === 'free';

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <strong>{user.email}</strong> — <em>{user.tenantSlug}</em> — role: {user.role}
        </div>
        <div>
          <button onClick={onLogout}>Logout</button>
        </div>
      </div>

      <h2>Notes</h2>
      {msg && <div style={{ color: 'green' }}>{msg}</div>}
      <div>
        {notes.map(n => <NoteItem key={n._id} note={n} onDelete={remove} />)}
      </div>

      <h3>Create note</h3>
      {reachedLimit ? (
        <div>
          <p>You reached the Free plan limit of 3 notes.</p>
          {user.role === 'admin' ? <button onClick={upgrade}>Upgrade to Pro</button> : <div>Ask an admin to upgrade.</div>}
        </div>
      ) : (
        <form onSubmit={add}>
          <div><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" required/></div>
          <div><textarea value={body} onChange={e=>setBody(e.target.value)} placeholder="Body" /></div>
          <button type="submit">Create</button>
        </form>
      )}
    </div>
  );
}
