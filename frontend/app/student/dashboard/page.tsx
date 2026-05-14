'use client';

import { useEffect, useState } from 'react';
import { api, getStoredUser } from '../../../lib/api';
import { formatDate, formatDateShort, timeRemaining, statusLabel, getStatusBadgeClass } from '../../../lib/utils';

export default function StudentDashboardPage() {
  const [elections, setElections] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [published, setPublished] = useState<any[]>([]);
  const [votingEvent, setVotingEvent] = useState<any | null>(null);
  const [voted, setVoted] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const [electionData, candidacyData] = await Promise.all([
          api('/api/elections'),
          api('/api/my-candidacy').catch(() => [])
        ]);
        setElections(electionData || []);
        setApplications(candidacyData || []);
        const publishedList = (electionData || []).filter((item: any) => item.status === 'results_published');
        setPublished(publishedList);
        const openVote = (electionData || []).find((item: any) => item.status === 'voting_open');
        setVotingEvent(openVote || null);
        if (openVote) {
          const user = getStoredUser();
          if (user?.is_verified) {
            const voteStatus = await api(`/api/elections/${openVote.id}/has-voted`);
            setVoted(voteStatus);
          }
        }
      } catch (err: any) {
        setError(err?.message || 'Unable to load dashboard');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div>
      {error ? <div className="alert alert-danger"><span>✕</span><span>{error}</span></div> : null}
      <div id="unverified-banner" style={{ display: getStoredUser()?.is_verified ? 'none' : 'flex' }} className="alert alert-warning">
        Your account is <strong>pending verification</strong> by the Election Head. You will be notified by email once approved.
      </div>
      <div id="dash-content">
        <div className="e-hero" style={{ marginBottom: 24 }}>
          <div className="e-hero-bg" />
          <div className="e-hero-inner" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <div className="e-hero-label">{votingEvent ? (voted?.has_voted ? 'Vote Recorded' : 'Voting is OPEN') : published.length ? 'Results Available' : 'Campus Elections'}</div>
              <div className="e-hero-name">{votingEvent ? votingEvent.name : published.length ? published[0].name : 'Stay engaged with all campus polls'}</div>
              <div className="e-hero-sub">
                {votingEvent
                  ? `${votingEvent.positions.length} position(s) · Closes ${formatDate(votingEvent.voting_end)}`
                  : published.length
                  ? 'Election results have been published'
                  : 'Review candidates, cast your vote, and follow the process.'}
              </div>
              {voted?.has_voted ? (
                <div style={{ marginTop: 12, background: 'rgba(255,255,255,.1)', borderRadius: 8, padding: '8px 14px', display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
                  <span style={{ color: 'rgba(255,255,255,.5)' }}>Confirmation:</span>
                  <code style={{ fontFamily: 'monospace', color: 'var(--gold)', letterSpacing: '1px' }}>{voted.confirmation_code}</code>
                </div>
              ) : null}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: 220, gap: 12 }}>
              {votingEvent ? (
                <>
                  <div className="e-hero-timer">{timeRemaining(votingEvent.voting_end)}</div>
                  <div className="e-hero-timer-lbl">Remaining</div>
                  {voted?.has_voted ? (
                    <span style={{ background: 'rgba(255,255,255,.12)', color: 'white', border: '1px solid rgba(255,255,255,.2)', borderRadius: 20, padding: '7px 18px', fontSize: 13, fontWeight: 600 }}>Vote Cast</span>
                  ) : getStoredUser()?.is_verified ? (
                    <a href="/student/vote" className="btn btn-gold btn-lg">Cast Your Vote →</a>
                  ) : (
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,.4)' }}>Verify account to vote</span>
                  )}
                </>
              ) : published.length ? (
                <a href="/student/results" className="btn btn-gold btn-lg">View Results →</a>
              ) : null}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18, marginBottom: 24 }}>
          <div className="stat-card navy"><div className="stat-value">{loading ? '—' : elections.length}</div><div className="stat-label">Elections</div></div>
          <div className="stat-card red"><div className="stat-value">{loading ? '—' : applications.length}</div><div className="stat-label">My Applications</div></div>
          <div className="stat-card gold"><div className="stat-value">{loading ? '—' : published.length}</div><div className="stat-label">Published Results</div></div>
        </div>

        <div className="action-grid" style={{ marginBottom: 24 }}>
          <a href="/student/candidates" className="action-tile"><div className="action-tile-lbl">Browse Candidates</div><div className="action-tile-sub">Explore profiles & manifestos</div></a>
          <a href="/student/vote" className={`action-tile${!votingEvent || (voted?.has_voted ? ' dim' : '') ? ' dim' : ''}`}><div className="action-tile-lbl">Cast My Vote</div><div className="action-tile-sub">{votingEvent ? (voted?.has_voted ? 'Already voted' : 'Voting is open!') : 'No active voting'}</div></a>
          <a href="/student/results" className={`action-tile${published.length === 0 ? ' dim' : ''}`}><div className="action-tile-lbl">View Results</div><div className="action-tile-sub">{published.length ? `${published.length} result(s) available` : 'Not yet published'}</div></a>
          <a href="/student/candidacy" className={`action-tile${!elections.some((item) => item.status === 'nomination_open') ? ' dim' : ''}`}><div className="action-tile-lbl">Run for Office</div><div className="action-tile-sub">{elections.some((item) => item.status === 'nomination_open') ? 'Nominations open now!' : 'No nominations open'}</div></a>
        </div>

        <div className="card">
          <div className="card-hd"><div className="card-title">All Elections</div></div>
          <div style={{ padding: '18px' }}>
            {loading ? (
              <div className="skeleton" style={{ height: 220, borderRadius: 18 }} />
            ) : elections.length ? (
              elections.map((election, index) => (
                <div key={election.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 22px', gap: 12, flexWrap: 'wrap', borderBottom: index < elections.length - 1 ? '1px solid var(--g100)' : 'none' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{election.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--g400)' }}>Voting: {formatDateShort(election.voting_start)} → {formatDateShort(election.voting_end)}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className={getStatusBadgeClass(election.status)}>{statusLabel(election.status)}</span>
                    {election.status === 'voting_open' ? <a href="/student/vote" className="btn btn-sm btn-primary">Vote</a> : null}
                    {election.status === 'results_published' ? <a href="/student/results" className="btn btn-sm btn-gold">Results</a> : null}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty"><div className="empty-title">No elections are available.</div></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
