import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm]       = useState({ name: '', email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    setError(''); setLoading(true);
    try {
      if (isLogin) await login(form.email, form.password);
      else         await register(form.name, form.email, form.password);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>⚡</div>
        <h1 style={styles.title}>LeadFlow CRM</h1>
        <p style={styles.sub}>{isLogin ? 'Sign in to your admin portal' : 'Create your admin account'}</p>

        <div style={styles.form}>
          {!isLogin && (
            <div style={styles.field}>
              <label style={styles.label}>FULL NAME</label>
              <input value={form.name} onChange={e => set('name', e.target.value)}
                placeholder="John Smith" style={styles.input} />
            </div>
          )}
          <div style={styles.field}>
            <label style={styles.label}>EMAIL</label>
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
              placeholder="admin@company.com" style={styles.input} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>PASSWORD</label>
            <input type="password" value={form.password} onChange={e => set('password', e.target.value)}
              placeholder="••••••••" style={styles.input}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
          </div>
          {error && <p style={styles.error}>{error}</p>}
          <button onClick={handleSubmit} disabled={loading} style={styles.btn}>
            {loading ? 'Please wait…' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </div>

        <p style={styles.toggle}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => { setIsLogin(!isLogin); setError(''); }} style={styles.link}>
            {isLogin ? 'Register' : 'Sign In'}
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page:  { minHeight: '100vh', background: 'linear-gradient(135deg,#0f172a,#1e3a5f)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter',sans-serif" },
  card:  { background: '#fff', borderRadius: 18, padding: '48px 40px', width: 380, boxShadow: '0 24px 80px #0006' },
  logo:  { width: 52, height: 52, background: 'linear-gradient(135deg,#3B82F6,#8B5CF6)', borderRadius: 14, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 },
  title: { textAlign: 'center', fontSize: 24, fontWeight: 800, color: '#0f172a', margin: 0 },
  sub:   { textAlign: 'center', color: '#64748b', fontSize: 14, margin: '6px 0 28px' },
  form:  { display: 'flex', flexDirection: 'column', gap: 14 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 11, fontWeight: 700, color: '#374151', letterSpacing: '0.06em' },
  input: { padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: 9, fontSize: 14, outline: 'none', color: '#0f172a', fontFamily: 'inherit' },
  error: { color: '#DC2626', fontSize: 13, background: '#FEF2F2', padding: '8px 12px', borderRadius: 7, margin: 0 },
  btn:   { background: 'linear-gradient(135deg,#3B82F6,#8B5CF6)', color: '#fff', border: 'none', padding: 13, borderRadius: 9, fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 4 },
  toggle:{ textAlign: 'center', fontSize: 13, color: '#64748b', marginTop: 20 },
  link:  { color: '#3B82F6', fontWeight: 700, cursor: 'pointer' },
};
