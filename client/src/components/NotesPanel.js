import { useState } from 'react';
import { addNote } from '../api';

const STATUS = {
  new:       { label: 'New',       color: '#3B82F6', bg: '#EFF6FF' },
  contacted: { label: 'Contacted', color: '#D97706', bg: '#FFFBEB' },
  converted: { label: 'Converted', color: '#059669', bg: '#ECFDF5' },
  lost:      { label: 'Lost',      color: '#DC2626', bg: '#FEF2F2' },
};

const fmt = d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export default function NotesPanel({ lead, onUpdate, onClose }) {
  const [text, setText]     = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!text.trim()) return;
    setSaving(true);
    try {
      const { data } = await addNote(lead._id, text.trim());
      onUpdate(data);
      setText('');
    } finally {
      setSaving(false);
    }
  };

  const s = STATUS[lead.status];

  return (
    <div style={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={styles.panel}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.name}>{lead.name}</h2>
            <p style={styles.meta}>{lead.email} · {lead.source}</p>
            <span style={{ ...styles.badge, background: s.bg, color: s.color, border: `1px solid ${s.color}44` }}>
              {s.label}
            </span>
          </div>
          <button onClick={onClose} style={styles.close}>✕</button>
        </div>

        <div style={styles.notesList}>
          <h3 style={styles.sectionTitle}>Notes & Follow-ups</h3>
          {lead.notes.length === 0
            ? <p style={styles.empty}>No notes yet. Add one below.</p>
            : [...lead.notes].reverse().map(n => (
              <div key={n._id} style={styles.noteCard}>
                <p style={styles.noteText}>{n.text}</p>
                <p style={styles.noteDate}>{fmt(n.createdAt)}</p>
              </div>
            ))}
        </div>

        <div style={styles.addNote}>
          <textarea value={text} onChange={e => setText(e.target.value)}
            placeholder="Write a note or follow-up action…" rows={3} style={styles.textarea} />
          <button onClick={submit} disabled={!text.trim() || saving}
            style={{ ...styles.saveBtn, opacity: (!text.trim() || saving) ? 0.5 : 1 }}>
            {saving ? 'Saving…' : 'Save Note'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay:      { position: 'fixed', inset: 0, background: '#0008', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 },
  panel:        { background: '#fff', borderRadius: 16, width: '100%', maxWidth: 520, maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 80px #0006', overflow: 'hidden', fontFamily: "'Inter',sans-serif" },
  header:       { padding: '24px 28px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  name:         { margin: 0, fontSize: 18, fontWeight: 800, color: '#0f172a' },
  meta:         { margin: '4px 0 10px', fontSize: 13, color: '#64748b' },
  badge:        { padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' },
  close:        { background: '#f1f5f9', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 16, color: '#64748b' },
  notesList:    { flex: 1, overflowY: 'auto', padding: '20px 28px' },
  sectionTitle: { margin: '0 0 14px', fontSize: 12, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.06em' },
  empty:        { color: '#94a3b8', fontSize: 14, fontStyle: 'italic' },
  noteCard:     { background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '12px 14px', marginBottom: 10 },
  noteText:     { margin: 0, fontSize: 14, color: '#1e293b', lineHeight: 1.5 },
  noteDate:     { margin: '6px 0 0', fontSize: 11, color: '#94a3b8' },
  addNote:      { padding: '16px 28px 24px', borderTop: '1px solid #f1f5f9' },
  textarea:     { width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: 9, fontSize: 14, resize: 'none', outline: 'none', fontFamily: 'inherit', color: '#1e293b', boxSizing: 'border-box' },
  saveBtn:      { marginTop: 10, background: '#3B82F6', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer' },
};
