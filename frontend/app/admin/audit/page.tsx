'use client';

export default function AdminAuditPage() {
  return (
    <div>
      <div className="card">
        <div className="card-hd">
          <div className="card-title">Audit Logs</div>
        </div>
        <div style={{ padding: '24px' }}>
          <div className="empty">
            <div className="empty-title">Audit trail will appear here</div>
            <div className="empty-text">Inspect election activity, user actions, and timeline data.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
