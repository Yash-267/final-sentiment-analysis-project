import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import SentimentCard from '../components/SentimentCard';
import { Filter, X } from 'lucide-react';

const Analysis = () => {
    const { data } = useData();
    const [selectedIndustry, setSelectedIndustry] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const comments = data?.comments || [];

    // Extract unique values for filters
    const industries = useMemo(() => [...new Set(comments.map(c => c.industry))], [comments]);
    const roles = useMemo(() => [...new Set(comments.map(c => c.role))], [comments]);
    const categories = useMemo(() => [...new Set(comments.map(c => c.sentiment_category))], [comments]);

    const filteredComments = comments.filter(c => {
        return (
            (!selectedIndustry || c.industry === selectedIndustry) &&
            (!selectedRole || c.role === selectedRole) &&
            (!selectedCategory || c.sentiment_category === selectedCategory)
        );
    });

    if (!data) return <div className="container" style={{ padding: '2rem' }}>Please upload a file to view analysis.</div>;

    return (
        <div className="container animate-fade-in" style={{ padding: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>

                {/* Sidebar Filters */}
                <div className="card" style={{ height: 'fit-content', position: 'sticky', top: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <Filter size={20} />
                        <h3 style={{ margin: 0 }}>Filters</h3>
                        {(selectedIndustry || selectedRole || selectedCategory) &&
                            <button
                                onClick={() => { setSelectedIndustry(''); setSelectedRole(''); setSelectedCategory(''); }}
                                style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'red' }}
                            >
                                <X size={16} />
                            </button>
                        }
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Sentiment</label>
                            <select
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="">All Sentiments</option>
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Industry</label>
                            <select
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                                value={selectedIndustry}
                                onChange={(e) => setSelectedIndustry(e.target.value)}
                            >
                                <option value="">All Industries</option>
                                {industries.map(i => <option key={i} value={i}>{i}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Role</label>
                            <select
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                            >
                                <option value="">All Roles</option>
                                {roles.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                    </div>

                    <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                        Showing <strong>{filteredComments.length}</strong> comments
                    </div>
                </div>

                {/* Feed */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {filteredComments.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>No comments match criteria</div>
                    ) : (
                        filteredComments.map(c => <SentimentCard key={c.id} comment={c} />)
                    )}
                </div>

            </div>
        </div>
    );
};

export default Analysis;
