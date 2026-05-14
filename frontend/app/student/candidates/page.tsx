'use client';

export default function StudentCandidatesPage() {
  return (
    <div>
      <div className="card">
        <div className="card-hd">
          <div className="card-title">Candidates</div>
        </div>
        <div style={{ padding: '24px' }}>
          <div className="empty">
            <div className="empty-title">Browse candidates coming soon</div>
            <div className="empty-text">This page will load candidate profiles and manifestos from the election data.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
