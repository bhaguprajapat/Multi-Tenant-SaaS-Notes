import React from 'react';

export default function NoteItem({ note, onDelete }) {
  return (
    <div style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
      <h3>{note.title}</h3>
      <p>{note.body}</p>
      <small>Created: {new Date(note.createdAt).toLocaleString()}</small><br/>
      <button onClick={() => onDelete(note._id)} style={{ marginTop: 6 }}>Delete</button>
    </div>
  );
}
