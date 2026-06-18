import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  MapPin, Clock, CheckCircle, Activity,
  Image as ImageIcon, RefreshCw, FileText,
  TrendingUp, Users, X, Phone, Calendar,
  AlertTriangle, ChevronRight, BarChart2, Trash2
} from 'lucide-react';

/* ─── tiny SVG donut chart ─────────────────────────────────── */
function DonutChart({ pending, inProgress, solved, total }) {
  const r = 54;
  const circ = 2 * Math.PI * r;

  const pct = (n) => (total === 0 ? 0 : n / total);
  const pendingArc   = pct(pending)   * circ;
  const progressArc  = pct(inProgress) * circ;
  const solvedArc    = pct(solved)    * circ;

  const pendingOffset   = 0;
  const progressOffset  = circ - pendingArc;
  const solvedOffset    = circ - pendingArc - progressArc;

  return (
    <svg viewBox="0 0 120 120" width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
      {/* track */}
      <circle cx="60" cy="60" r={r} fill="none" stroke="#e2e8f0" strokeWidth="14" />
      {/* solved */}
      {solved > 0 && (
        <circle cx="60" cy="60" r={r} fill="none" stroke="#10b981" strokeWidth="14"
          strokeDasharray={`${solvedArc} ${circ}`}
          strokeDashoffset={-solvedOffset} strokeLinecap="round" />
      )}
      {/* in progress */}
      {inProgress > 0 && (
        <circle cx="60" cy="60" r={r} fill="none" stroke="#3b82f6" strokeWidth="14"
          strokeDasharray={`${progressArc} ${circ}`}
          strokeDashoffset={-progressOffset} strokeLinecap="round" />
      )}
      {/* pending */}
      {pending > 0 && (
        <circle cx="60" cy="60" r={r} fill="none" stroke="#f59e0b" strokeWidth="14"
          strokeDasharray={`${pendingArc} ${circ}`}
          strokeDashoffset={-pendingOffset} strokeLinecap="round" />
      )}
    </svg>
  );
}

/* ─── Category bar chart ────────────────────────────────────── */
function CategoryBars({ reports }) {
  const cats = {};
  reports.forEach(r => { cats[r.category] = (cats[r.category] || 0) + 1; });
  const entries = Object.entries(cats).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const max = entries[0]?.[1] || 1;

  const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

  if (entries.length === 0) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
      No data yet
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
      {entries.map(([cat, count], i) => (
        <div key={cat}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem', fontSize: '0.78rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 500, maxWidth: '70%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat}</span>
            <span style={{ color: colors[i], fontWeight: 700 }}>{count}</span>
          </div>
          <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '99px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${(count / max) * 100}%`,
              background: colors[i],
              borderRadius: '99px',
              transition: 'width 0.8s ease'
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Detail Drawer ─────────────────────────────────────────── */
function DetailDrawer({ report, onClose, onStatusChange, onDelete }) {
  if (!report) return null;

  const statusClass =
    report.status === 'In Progress' ? 'progress'
    : report.status === 'Solved' ? 'solved'
    : 'pending';

  return (
    <>
      {/* backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)',
          backdropFilter: 'blur(4px)', zIndex: 200,
          animation: 'fadeIn 0.2s ease'
        }}
      />
      {/* panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 'min(480px, 95vw)',
        background: 'var(--bg-card)',
        borderLeft: '1px solid var(--border)',
        boxShadow: '-20px 0 60px rgba(0,0,0,0.15)',
        zIndex: 201,
        overflowY: 'auto',
        animation: 'slideInRight 0.28s cubic-bezier(0.4,0,0.2,1)'
      }}>
        {/* header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, background: 'var(--bg-card)', zIndex: 1
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.2rem' }}>
              Report Details
            </div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
              {report.category} — {report.problemType}
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--border)',
            background: 'var(--bg-page)', cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)'
          }}>
            <X size={16} />
          </button>
        </div>

        {/* image */}
        {report.image ? (
          <img
            src={report.image}
            alt={report.category}
            style={{ width: '100%', height: 220, objectFit: 'cover' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div style={{
            width: '100%', height: 160,
            background: 'var(--gradient-soft)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: '0.5rem', color: 'var(--text-muted)'
          }}>
            <ImageIcon size={36} />
            <span style={{ fontSize: '0.85rem' }}>No image uploaded</span>
          </div>
        )}

        <div style={{ padding: '1.5rem' }}>

          {/* Status badge + changer */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <span className={`status-badge status-${statusClass}`}>{report.status}</span>
            <select
              className="status-select"
              value={report.status}
              onChange={(e) => onStatusChange(report.id, e.target.value)}
              style={{ flex: 1, minWidth: 140 }}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Solved">Solved</option>
            </select>
          </div>

          {/* Reporter info */}
          <div style={{
            background: 'linear-gradient(135deg, #eff6ff, #f5f3ff)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.25rem',
            marginBottom: '1.25rem'
          }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              Reporter Information
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{
                width: 42, height: 42, borderRadius: '50%',
                background: 'var(--gradient)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 700, fontSize: '1.1rem', flexShrink: 0
              }}>
                {report.name?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{report.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                  <Phone size={11} /> {report.mobile}
                </div>
              </div>
            </div>
          </div>

          {/* Complaint details */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              Complaint Details
            </div>
            <DetailRow icon={<AlertTriangle size={14} />} label="Category" value={report.category} />
            <DetailRow icon={<FileText size={14} />} label="Problem Type" value={report.problemType} />
            <DetailRow icon={<MapPin size={14} />} label="Location" value={report.location} />
            <DetailRow icon={<Calendar size={14} />} label="Submitted" value={new Date(report.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })} />
          </div>

          {/* Description */}
          {report.issue && (
            <div style={{
              background: 'var(--bg-page)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              padding: '1rem',
              marginBottom: '1.25rem'
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Description
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                "{report.issue}"
              </p>
            </div>
          )}

          {/* Delete button */}
          <button
            onClick={() => onDelete(report.id)}
            style={{
              width: '100%', padding: '0.65rem', marginTop: '0.5rem',
              background: 'var(--danger-bg)', color: 'var(--danger)',
              border: '1.5px solid #fecaca', borderRadius: 'var(--radius-sm)',
              fontFamily: 'inherit', fontWeight: 600, fontSize: '0.85rem',
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '0.4rem', transition: 'all 0.15s'
            }}
            onMouseOver={e => e.currentTarget.style.background = '#fee2e2'}
            onMouseOut={e => e.currentTarget.style.background = 'var(--danger-bg)'}
          >
            <Trash2 size={14} /> Delete Report
          </button>
        </div>
      </div>
    </>
  );
}

function DetailRow({ icon, label, value }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: '0.6rem',
      padding: '0.55rem 0', borderBottom: '1px solid var(--border)'
    }}>
      <span style={{ color: 'var(--accent)', marginTop: '0.1rem', flexShrink: 0 }}>{icon}</span>
      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', minWidth: 90 }}>{label}</span>
      <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500, flex: 1, wordBreak: 'break-word' }}>{value}</span>
    </div>
  );
}

/* ─── Main Dashboard ────────────────────────────────────────── */
function AdminDashboard() {
  const [reports, setReports]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected]     = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const navigate = useNavigate();

  const fetchReports = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const token = sessionStorage.getItem('adminToken');
      const response = await axios.get('/api/reports', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports', error);
      if (error.response?.status === 401) {
        sessionStorage.removeItem('adminToken');
        navigate('/login');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [navigate]);

  useEffect(() => {
    const token = sessionStorage.getItem('adminToken');
    if (!token) { navigate('/login'); return; }
    fetchReports();
  }, [navigate, fetchReports]);

  const updateStatus = async (id, newStatus) => {
    try {
      const token = sessionStorage.getItem('adminToken');
      await axios.put(`/api/reports/${id}/status`, { status: newStatus }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setReports(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
      if (selected?.id === id) setSelected(prev => ({ ...prev, status: newStatus }));
    } catch (error) {
      console.error('Error updating status', error);
      alert('Failed to update status. Please try again.');
    }
  };

  const stats = {
    total:      reports.length,
    pending:    reports.filter(r => r.status === 'Pending').length,
    inProgress: reports.filter(r => r.status === 'In Progress').length,
    solved:     reports.filter(r => r.status === 'Solved').length,
  };

  const filtered = filterStatus === 'All'
    ? reports
    : reports.filter(r => r.status === filterStatus);

  /* ── Loading ─────────────── */
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-dots"><span /><span /><span /></div>
        <p style={{ fontSize: '0.875rem' }}>Loading dashboard...</p>
      </div>
    );
  }

  const deleteReport = async (id) => {
    if (!window.confirm('Delete this report? This cannot be undone.')) return;
    try {
      const token = sessionStorage.getItem('adminToken');
      await axios.delete(`/api/reports/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setReports(prev => prev.filter(r => r.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch (error) {
      console.error('Error deleting report', error);
      alert('Failed to delete report.');
    }
  };
  return (
    <>

      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="text-gradient" style={{ marginBottom: '0.2rem' }}>Admin Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            Smart Civic Issue Reporting — Analytics &amp; Management
          </p>
        </div>
        <button onClick={() => fetchReports(true)} className="btn btn-secondary" disabled={refreshing} style={{ gap: '0.4rem' }}>
          <RefreshCw size={15} style={{ animation: refreshing ? 'spin 0.7s linear infinite' : 'none' }} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* ── Analytics Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '1.25rem', marginBottom: '2rem' }}>

        {/* Total */}
        <div className="card analytics-card" style={{ padding: '1.4rem 1.25rem', borderTop: '3px solid transparent', backgroundImage: 'linear-gradient(white,white), var(--gradient)', backgroundClip: 'padding-box, border-box', backgroundOrigin: 'padding-box, border-box' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <div style={{ width: 34, height: 34, borderRadius: 'var(--radius-sm)', background: 'var(--gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
              <BarChart2 size={16} />
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total</span>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.04em', background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{stats.total}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><TrendingUp size={12} /> All time</div>
        </div>

        {/* Pending */}
        <div className="card analytics-card" style={{ padding: '1.4rem 1.25rem', borderTop: '3px solid #f59e0b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <div style={{ width: 34, height: 34, borderRadius: 'var(--radius-sm)', background: '#fffbeb', border: '1px solid #fde68a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706', flexShrink: 0 }}>
              <Clock size={16} />
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pending</span>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.04em', color: '#d97706' }}>{stats.pending}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>Awaiting action</div>
        </div>

        {/* In Progress */}
        <div className="card analytics-card" style={{ padding: '1.4rem 1.25rem', borderTop: '3px solid #3b82f6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <div style={{ width: 34, height: 34, borderRadius: 'var(--radius-sm)', background: 'var(--accent-light)', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', flexShrink: 0 }}>
              <Activity size={16} />
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>In Progress</span>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--accent)' }}>{stats.inProgress}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>Being resolved</div>
        </div>

        {/* Solved */}
        <div className="card analytics-card" style={{ padding: '1.4rem 1.25rem', borderTop: '3px solid #10b981' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <div style={{ width: 34, height: 34, borderRadius: 'var(--radius-sm)', background: '#ecfdf5', border: '1px solid #a7f3d0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', flexShrink: 0 }}>
              <CheckCircle size={16} />
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Solved</span>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.04em', color: '#10b981' }}>{stats.solved}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>Completed</div>
        </div>
      </div>

      {/* ── Chart Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '2rem' }}>

        {/* Donut */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <DonutChart
              pending={stats.pending}
              inProgress={stats.inProgress}
              solved={stats.solved}
              total={stats.total}
            />
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center'
            }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, lineHeight: 1 }}>{stats.total}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL</div>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 120 }}>
            <div style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '0.95rem' }}>Status Overview</div>
            {[
              { label: 'Pending', count: stats.pending, color: '#f59e0b' },
              { label: 'In Progress', count: stats.inProgress, color: '#3b82f6' },
              { label: 'Solved', count: stats.solved, color: '#10b981' },
            ].map(({ label, count, color }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0 }} />
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', flex: 1 }}>{label}</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color }}>{count}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  ({stats.total ? Math.round((count / stats.total) * 100) : 0}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Category bars */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <BarChart2 size={16} color="var(--accent)" />
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Top Categories</span>
          </div>
          <CategoryBars reports={reports} />
        </div>
      </div>

      {/* ── Reports Table ── */}
      <div className="card" style={{ overflow: 'hidden' }}>

        {/* table header */}
        <div style={{
          padding: '1rem 1.5rem',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={16} color="var(--accent)" />
            <span style={{ fontWeight: 700, fontSize: '1rem' }}>Reports</span>
            <span style={{
              padding: '0.15rem 0.55rem', background: 'var(--accent-light)',
              color: 'var(--accent)', borderRadius: '99px', fontSize: '0.72rem', fontWeight: 700
            }}>{filtered.length}</span>
          </div>
          {/* filter tabs */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {['All', 'Pending', 'In Progress', 'Solved'].map(s => (
              <button
                key={s}
                className={`filter-tab ${filterStatus === s ? 'active' : ''}`}
                onClick={() => setFilterStatus(s)}
              >{s}</button>
            ))}
          </div>
        </div>

        {/* column labels */}
        {filtered.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 2fr 2.5fr 1.5fr 1fr 28px',
            padding: '0.55rem 1.5rem',
            background: 'var(--bg-page)',
            borderBottom: '1px solid var(--border)',
            fontSize: '0.7rem', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.06em',
            color: 'var(--text-muted)'
          }}>
            <span>Reporter</span>
            <span>Category</span>
            <span>Location</span>
            <span>Date</span>
            <span>Status</span>
            <span />
          </div>
        )}

        {/* rows */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 2rem', color: 'var(--text-muted)' }}>
            <Users size={32} style={{ marginBottom: '0.75rem', opacity: 0.4 }} />
            <p style={{ margin: 0, fontSize: '0.9rem' }}>No reports {filterStatus !== 'All' ? `with status "${filterStatus}"` : 'yet'}.</p>
          </div>
        ) : (
          <div>
            {filtered.map((report, idx) => {
              const statusClass =
                report.status === 'In Progress' ? 'progress'
                : report.status === 'Solved' ? 'solved'
                : 'pending';

              return (
                <div
                  key={report.id}
                  className="report-row"
                  onClick={() => setSelected(report)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 2fr 2.5fr 1.5fr 1fr 28px',
                    alignItems: 'center',
                    padding: '0.75rem 1.5rem',
                    borderBottom: idx < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                    background: selected?.id === report.id ? '#f0f6ff' : 'transparent',
                    gap: '0.5rem'
                  }}
                >
                  {/* Reporter */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflow: 'hidden' }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: '50%',
                      background: 'var(--gradient)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0
                    }}>
                      {report.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{report.name}</div>
                      <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{report.mobile}</div>
                    </div>
                  </div>

                  {/* Category */}
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{report.category}</div>
                    <div style={{ fontSize: '0.73rem', color: 'var(--accent)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{report.problemType}</div>
                  </div>

                  {/* Location */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', overflow: 'hidden' }}>
                    <MapPin size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{report.location}</span>
                  </div>

                  {/* Date */}
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {new Date(report.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>

                  {/* Status badge */}
                  <span className={`status-badge status-${statusClass}`} style={{ whiteSpace: 'nowrap' }}>
                    {report.status}
                  </span>

                  {/* Arrow */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexShrink: 0 }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteReport(report.id); }}
                      title="Delete report"
                      style={{
                        width: 26, height: 26, borderRadius: '50%',
                        border: '1px solid #fecaca', background: 'var(--danger-bg)',
                        color: 'var(--danger)', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, transition: 'all 0.15s', opacity: 0.75
                      }}
                      onMouseOver={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.background = '#fee2e2'; }}
                      onMouseOut={e => { e.currentTarget.style.opacity = '0.75'; e.currentTarget.style.background = 'var(--danger-bg)'; }}
                    >
                      <Trash2 size={11} />
                    </button>
                    <ChevronRight size={15} className="row-chevron" style={{ color: 'var(--accent)', flexShrink: 0 }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Detail Drawer ── */}
      <DetailDrawer
        report={selected}
        onClose={() => setSelected(null)}
        onStatusChange={updateStatus}
        onDelete={deleteReport}
      />
    </>
  );
}

export default AdminDashboard;
