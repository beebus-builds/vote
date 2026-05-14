'use client';

import { useEffect, useState } from 'react';
import { fetchAdminElections, fetchAdminStats, fetchPendingCandidates, fetchPendingStudents, verifyStudent } from '../../../lib/api';
import { formatDateShort, statusLabel, getStatusBadgeClass } from '../../../lib/utils';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [elections, setElections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const [statsData, studentsData, candidatesData, electionsData] = await Promise.all([
          fetchAdminStats(),
          fetchPendingStudents(),
          fetchPendingCandidates(),
          fetchAdminElections()
        ]);
        setStats(statsData);
        setStudents(studentsData || []);
        setCandidates(candidatesData || []);
        setElections(electionsData || []);
      } catch (err: any) {
        setError(err?.message || 'Unable to load dashboard');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  async function onVerifyStudent(studentId: number) {
    try {
      await verifyStudent(studentId);
      setStudents((prev) => prev.filter((student) => student.id !== studentId));
    } catch (err: any) {
      setError(err?.message || 'Unable to verify student');
    }
  }

  return (
    <div>
      {error ? <div className="alert alert-danger"><span>✕</span><span>{error}</span></div> : null}
      <div className="stats-grid" style={{ marginBottom: 22 }}>
        {[
          { label: 'Total Students', value: stats?.total_students ?? '—', color: 'navy' },
          { label: 'Pending Verification', value: stats?.pending_verifications ?? '—', color: 'red' },
          { label: 'Active Elections', value: stats?.active_elections ?? '—', color: 'gold' },
          { label: 'Votes Cast', value: stats?.total_votes_cast ?? '—', color: 'green' }
        ].map((item) => (
          <div key={item.label} className={`stat-card ${item.color}`}>
            <div className="stat-value">{loading ? <span>&nbsp;</span> : item.value}</div>
            <div className="stat-label">{item.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, marginBottom: 22 }}>
        <div className="card">
          <div className="card-hd">
            <div className="card-title">Pending Verifications</div>
            <a href="/admin/students" className="btn btn-sm btn-outline">View All</a>
          </div>
          <div style={{ minHeight: 80 }}>
            {loading ? (
              <div className="skeleton" style={{ height: 120, borderRadius: 18 }} />
            ) : students.length ? (
              students.slice(0, 5).map((student, index) => (
                <div key={student.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 20px', borderBottom: index < Math.min(students.length, 5) - 1 ? '1px solid var(--g100)' : 'none' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{student.full_name}</div>
                    <div style={{ fontSize: 12, color: 'var(--g400)' }}>{student.faculty} · Year {student.year} · {student.tu_registration_number}</div>
                  </div>
                  <button className="btn btn-sm btn-success" type="button" onClick={() => onVerifyStudent(student.id)}>✓ Verify</button>
                </div>
              ))
            ) : (
              <div className="empty" style={{ padding: 24 }}>
                <div className="empty-title" style={{ fontSize: 14 }}>No pending verifications</div>
              </div>
            )}
          </div>
        </div>
        <div className="card">
          <div className="card-hd">
            <div className="card-title">Pending Candidates</div>
            <a href="/admin/candidates" className="btn btn-sm btn-outline">View All</a>
          </div>
          <div style={{ minHeight: 80 }}>
            {loading ? (
              <div className="skeleton" style={{ height: 120, borderRadius: 18 }} />
            ) : candidates.length ? (
              candidates.slice(0, 5).map((candidate, index) => (
                <div key={candidate.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 20px', borderBottom: index < Math.min(candidates.length, 5) - 1 ? '1px solid var(--g100)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,var(--navy),var(--navy-mid))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 13 }}>{candidate.user?.full_name?.[0] || '–'}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{candidate.user?.full_name}</div>
                      <div style={{ fontSize: 12, color: 'var(--g400)' }}>{candidate.position?.name || '—'} · {candidate.user?.faculty}</div>
                    </div>
                  </div>
                  <a href="/admin/candidates" className="btn btn-sm btn-outline">Review →</a>
                </div>
              ))
            ) : (
              <div className="empty" style={{ padding: 24 }}>
                <div className="empty-title" style={{ fontSize: 14 }}>No pending candidates</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-hd">
          <div className="card-title">All Elections</div>
          <a href="/admin/elections" className="btn btn-sm btn-primary">+ New Election</a>
        </div>
        <div style={{ padding: '0 18px 18px' }}>
          {loading ? (
            <div className="skeleton" style={{ height: 220, borderRadius: 18 }} />
          ) : elections.length ? (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Election</th>
                    <th>Voting Period</th>
                    <th>Status</th>
                    <th>HE Keys</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {elections.map((election) => (
                    <tr key={election.id}>
                      <td>
                        <strong>{election.name}</strong>
                        <div style={{ fontSize: 12, color: 'var(--g400)' }}>{election.positions?.length ?? 0} position(s)</div>
                      </td>
                      <td style={{ fontSize: 13 }}>{formatDateShort(election.voting_start)} → {formatDateShort(election.voting_end)}</td>
                      <td><span className={getStatusBadgeClass(election.status)}>{statusLabel(election.status)}</span></td>
                      <td>{election.he_key_fingerprint ? <span className="he-badge">…{election.he_key_fingerprint.slice(-16)}</span> : <span style={{ fontSize: 12, color: 'var(--g400)' }}>—</span>}</td>
                      <td><a href="/admin/elections" className="btn btn-sm btn-outline">Manage</a></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty">
              <div className="empty-title">No elections yet</div>
              <div className="empty-text">Create your first election on the Elections page</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
