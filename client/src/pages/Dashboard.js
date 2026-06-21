import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchLeads, updateStatus, deleteLead as deleteLeadAPI } from '../api';
import NotesPanel from '../components/NotesPanel';
import AddLeadModal from '../components/AddLeadModal';
import Toast from '../components/Toast';

const STATUS = {
  new:       { label: 'New',       color: '#3B82F6', bg: '#EFF6FF' },
  contacted: { label: 'Contacted', color: '#D97706', bg: '#FFFBEB' },
  converted: { label: 'Converted', color: '#059669', bg: '#ECFDF5' },
  lost:      { label: 'Lost',      color: '#DC2626', bg: '#FEF2F2' },
};

const fmt = d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [leads, setLeads]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd]   = useState(false);
  const [search, setSearch]     = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [toast, setToast]       = useState('');

  const showToast = (msg) => setToast(msg);

  const loadLeads = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await fetchLeads({
        status: filterStatus !== 'all' ? filterStatus : undefined,
        search: search || undefined,
      });
      setLeads(data);
    } catch (err) {
      showToast('Failed to load leads');
    } finally {
      setLoading(false);
    }
  }, [filterStatus, search]);

  useEffect(() => {
    const t = setTimeout(loadLeads, 300); // debounce search
    return () => clearTimeout(t);
  }, [loadLeads]);

  const handleStatusChange = async (id, status) => {
    const { data } = await updateStatus(id, status);
    setLeads(ls => ls.map(l => (l._id === id ? data : l)));
    if (selected?._id === id) setSelected(data);
    showToast(`Status updated to "${STATUS[status].label}"`);
  };

  const handleAddLead = (lead) => {
    setLeads(ls => [lead, ...ls]);
    showToast(`Lead "${lead.name}" added`);
  };

  const handleDelete = async (id) => {
    await deleteLeadAPI(id);
    setLeads(ls => ls.filter(l => l._id !== id));
    showToast('Lead removed');
  };

  const handleNotesUpdate = (updatedLead) => {
    setLeads(ls => ls.map(l => (l._id === updatedLead._id ? updatedLead : l)));
    setSelected(updatedLead);
  };

  const counts = Object.keys(STATUS).reduce((acc, k) => ({ ...acc, [k]: leads.filter(l => l.status === k).length }), {});

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <div style={styles.brand}>
          <div style={styles.logo}>⚡</div>
          <span style={styles.brandName}>LeadFlow CRM</span>
        </div>
        <div style={styles.navRight}>
          <span style={styles.userTag}>👤 {user?.name}</span>
          <button onClick={logout} style={styles.logoutBtn}>Sign Out</button>
        </div>
      </nav>

      <div style={styles.container}>
        <div style={styles.statsGrid}>
          {[
            { label: 'Total Leads', value: leads.length, icon: '👥', color: '#3B82F6', bg: '#EFF6FF' },
            ...Object.entries(STATUS).map(([k, s]) => ({
              label: s.label, value: counts[k],
              icon: k === 'new' ? '🆕' : k === 'contacted' ? '📞' : k === 'converted' ? '✅' : '❌',
              color: s.color, bg: s.bg,
            })),
          ].map(s => (
            <div key={s.label} style={styles.statCard}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={styles.toolbar}>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email, source…" style={styles.search} />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={styles.filterSelect}>
            <option value="all">All Status</option>
            {Object.entries(STATUS).map(([k, s]) => <option key={k} value={k}>{s.label}</option>)}
          </select>
          <button onClick={() => setShowAdd(true)} style={styles.addBtn}>+ Add Lead</button>
        </div>

        <div style={styles.tableWrap}>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.theadRow}>
                  {['Name & Email', 'Phone', 'Source', 'Status', 'Added', 'Actions'].map(h => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} style={styles.emptyCell}>Loading leads…</td></tr>
                ) : leads.length === 0 ? (
                  <tr><td colSpan={6} style={styles.emptyCell}>No leads found. Try a different search or add a new lead.</td></tr>
                ) : leads.map((lead, i) => (
                  <tr key={lead._id} style={{ ...styles.tr, background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                    <td style={styles.td}>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{lead.name}</div>
                      <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{lead.email}</div>
                    </td>
                    <td style={styles.td}>{lead.phone || '—'}</td>
                    <td style={styles.td}>
                      <span style={styles.sourceTag}>{lead.source}</span>
                    </td>
                    <td style={styles.td}>
                      <select value={lead.status} onChange={e => handleStatusChange(lead._id, e.target.value)}
                        style={{ ...styles.statusSelect, color: STATUS[lead.status].color, background: STATUS[lead.status].bg, borderColor: `${STATUS[lead.status].color}55` }}>
                        {Object.entries(STATUS).map(([k, s]) => <option key={k} value={k}>{s.label}</option>)}
                      </select>
                    </td>
                    <td style={{ ...styles.td, color: '#64748b', fontSize: 13 }}>{fmt(lead.createdAt)}</td>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => setSelected(lead)} style={styles.notesBtn}>
                          📝 Notes {lead.notes.length > 0 && `(${lead.notes.length})`}
                        </button>
                        <button onClick={() => handleDelete(lead._id)} style={styles.deleteBtn}>🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={styles.tableFooter}>Showing {leads.length} leads</div>
        </div>
      </div>

      {selected && <NotesPanel lead={selected} onUpdate={handleNotesUpdate} onClose={() => setSelected(null)} />}
      {showAdd && <AddLeadModal onAdd={handleAddLead} onClose={() => setShowAdd(false)} />}
      {toast && <Toast msg={toast} onClose={() => setToast('')} />}
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter',sans-serif" },
  nav: { background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60, position: 'sticky', top: 0, zIndex: 50 },
  brand: { display: 'flex', alignItems: 'center', gap: 10 },
  logo: { width: 34, height: 34, background: 'linear-gradient(135deg,#3B82F6,#8B5CF6)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 },
  brandName: { fontWeight: 800, fontSize: 16, color: '#0f172a' },
  navRight: { display: 'flex', alignItems: 'center', gap: 14 },
  userTag: { fontSize: 13, color: '#64748b' },
  logoutBtn: { background: 'none', border: '1px solid #e2e8f0', padding: '6px 14px', borderRadius: 7, fontSize: 13, cursor: 'pointer', color: '#64748b' },
  container: { maxWidth: 1200, margin: '0 auto', padding: '28px 24px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 14, marginBottom: 28 },
  statCard: { background: '#fff', borderRadius: 12, padding: '18px 20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px #0001' },
  toolbar: { display: 'flex', gap: 12, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' },
  search: { flex: 1, minWidth: 200, padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 9, fontSize: 14, outline: 'none', background: '#fff', color: '#0f172a' },
  filterSelect: { padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 9, fontSize: 14, background: '#fff', outline: 'none', color: '#0f172a' },
  addBtn: { background: 'linear-gradient(135deg,#3B82F6,#8B5CF6)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 9, fontSize: 14, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' },
  tableWrap: { background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 4px #0001' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 14 },
  theadRow: { background: '#f8fafc', borderBottom: '1px solid #e2e8f0' },
  th: { padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '14px 16px' },
  emptyCell: { padding: 40, textAlign: 'center', color: '#94a3b8', fontSize: 15 },
  sourceTag: { background: '#f1f5f9', color: '#374151', padding: '3px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600 },
  statusSelect: { padding: '5px 10px', border: '1.5px solid', borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: 'pointer', outline: 'none' },
  notesBtn: { background: '#EFF6FF', color: '#3B82F6', border: 'none', padding: '6px 12px', borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: 'pointer' },
  deleteBtn: { background: '#FEF2F2', color: '#DC2626', border: 'none', padding: '6px 10px', borderRadius: 7, fontSize: 12, cursor: 'pointer' },
  tableFooter: { padding: '12px 16px', borderTop: '1px solid #f1f5f9', fontSize: 13, color: '#94a3b8' },
};
