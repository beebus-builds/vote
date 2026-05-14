'use client';

export default function AdminCandidatesPage() {
  return (
    <div>
      <div className="card">
        <div className="card-hd">
          <div className="card-title">Candidates</div>
        </div>
        <div style={{ padding: '24px' }}>
          <div className="empty">
            <div className="empty-title">Pending candidate approvals</div>
            <div className="empty-text">Review nominations and approve candidates for upcoming elections.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
