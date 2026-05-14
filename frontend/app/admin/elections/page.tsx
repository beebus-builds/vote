'use client';

export default function AdminElectionsPage() {
  return (
    <div>
      <div className="card">
        <div className="card-hd">
          <div className="card-title">Elections</div>
        </div>
        <div style={{ padding: '24px' }}>
          <div className="empty">
            <div className="empty-title">Manage elections from here</div>
            <div className="empty-text">Create, lock candidates, publish results, and review elections.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
