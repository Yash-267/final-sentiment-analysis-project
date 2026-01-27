import React from 'react';

const SentimentCard = ({ comment }) => {
    const getBadgeClass = (sentiment) => {
        if (sentiment.includes('Positive')) return 'badge-positive';
        if (sentiment.includes('Supportive')) return 'badge-supportive';
        if (sentiment.includes('Critical')) return 'badge-critical';
        if (sentiment.includes('Concerned')) return 'badge-concerned';
        if (sentiment.includes('Negative')) return 'badge-negative';
        return '';
    };

    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span className={`badge ${getBadgeClass(comment.sentiment_category)}`}>
                        {comment.sentiment_category}
                    </span>
                    <span className="badge" style={{ background: '#f1f5f9', color: '#475569' }}>
                        {comment.industry}
                    </span>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{comment.date}</span>
            </div>

            <p style={{ margin: 0, lineHeight: '1.6' }}>{comment.text}</p>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#64748b' }}>
                <div>
                    <strong style={{ color: '#334155' }}>{comment.author}</strong> — {comment.role}
                </div>
                <div>
                    {comment.organization}
                </div>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Ref: {comment.section}</div>
        </div>
    );
};

export default SentimentCard;
