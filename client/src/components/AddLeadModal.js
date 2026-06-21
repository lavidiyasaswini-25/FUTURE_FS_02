import { useState } from 'react';
import { createLead } from '../api';

const SOURCES = ['Contact Form', 'LinkedIn', 'Referral', 'Email Campaign', 'Cold Outreach', 'Other'];

export default function AddLeadModal({ onAdd, onClose }) {
  const [form, setForm]     = useState({ name: '', email: '', phone: '', source: 'Contact Form' });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.name.trim() || !form.email.trim()) return;
    setSaving(true); setError('');
    try {
      const { data } = await createLead(form);
      onAdd(data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add lead');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>Add New Lead</h2>
          <button onClick={onClose} style={styles.close}>✕</button>
        </div>
        <div style={styles.body}>
          {[
            ['Full Name *', 'name', 'text', 'Jane Smith'],
            ['Email *', 'email', 'email', 'jane@company.com'],
            ['Phone', 'phone', 'text', '555-0000'],
          ].map(([label, key, type, ph]) => (
            <div key={key} style={styles.field}>
              <label style={styles.label}>{label.toUpperCase()}</label>
              <input type={type} value={form[key]} placeholder={ph} onChange={e => set(key, e.target.value)} style={styles.input} />
            </div>
          ))}
          <div style={styles.field}>
            <label style={styles.label}>SOURCE</label>
            <select value={form.source} onChange={e => set('source', e.target.value)} style={styles.input}>
              {SOURCES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          {error && <p style={styles.error}>{error}</p>}
          <button onClick={submit} disabled={!form.name.trim() || !form.email.trim() || saving}
            style={{ ...styles.btn, opacity: (!form.name.trim() || !form.email.trim() || saving) ? 0.5 : 1 }}>
            {saving ? 'Adding…' : 'Add Lead'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', inset: 0, background: '#0008', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 },
  modal:   { background: '#fff', borderRadius: 16, width: '100%', maxWidth: 460, boxShadow: '0 24px 80px #0006', overflow: 'hidden', fontFamily: "'Inter',sans-serif" },
  header:  { padding: '24px 28px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  title:   { margin: 0, fontSize: 18, fontWeight: 800, color: '#0f172a' },
  close:   { background: '#f1f5f9', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 16, color: '#64748b' },
  body:    { padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16 },
  field:   { display: 'flex', flexDirection: 'column', gap: 6 },
  label:   { fontSize: 11, fontWeight: 700, color: '#374151', letterSpacing: '0.06em' },
  input:   { padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 14, outline: 'none', color: '#0f172a', fontFamily: 'inherit', background: '#fff', boxSizing: 'border-box' },
  error:   { color: '#DC2626', fontSize: 13, background: '#FEF2F2', padding: '8px 12px', borderRadius: 7, margin: 0 },
  btn:     { background: 'linear-gradient(135deg,#3B82F6,#8B5CF6)', color: '#fff', border: 'none', padding: 12, borderRadius: 9, fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 4 },
};
