import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import SentimentCard from '../components/SentimentCard';
import { Filter, X, Download } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const Analysis = () => {
    const { data } = useData();
    const [searchParams] = useSearchParams();
    const [selectedIndustry, setSelectedIndustry] = useState(searchParams.get('industry') || '');
    const [selectedRole, setSelectedRole] = useState(searchParams.get('role') || '');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('sentiment') || '');
    const [searchQuery, setSearchQuery] = useState('');

    const comments = data?.comments || [];

    // Extract unique values for filters
    const industries = useMemo(() => [...new Set(comments.map(c => c.industry))], [comments]);
    const roles = useMemo(() => [...new Set(comments.map(c => c.role))], [comments]);
    const categories = useMemo(() => [...new Set(comments.map(c => c.sentiment_category))], [comments]);

    const filteredComments = comments.filter(c => {
        const matchesSearch = !searchQuery || c.text.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesIndustry = !selectedIndustry || c.industry === selectedIndustry;
        const matchesRole = !selectedRole || c.role === selectedRole;
        const matchesCategory = !selectedCategory || c.sentiment_category === selectedCategory;
        
        return matchesSearch && matchesIndustry && matchesRole && matchesCategory;
    });

    if (!data) return <div className="container" style={{ padding: '2rem' }}>Please upload a file to view analysis.</div>;

    const exportCSV = () => {
        if (filteredComments.length === 0) return;
        const headers = ['id', 'text', 'author', 'organization', 'industry', 'role', 'date', 'section', 'sentiment_category', 'sentiment_score'];
        const csvRows = [];
        csvRows.push(headers.join(','));
        filteredComments.forEach(c => {
            const values = headers.map(header => {
                let val = c[header] !== null && c[header] !== undefined ? String(c[header]) : '';
                // Escape quotes and commas
                val = val.replace(/"/g, '""');
                return `"${val}"`;
            });
            csvRows.push(values.join(','));
        });
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sentiment_analysis_filtered.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="container animate-fade-in" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                <button onClick={exportCSV} className="btn btn-secondary">
                    <Download size={18} /> Export CSV
                </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>

                {/* Sidebar Filters */}
                <div className="card" style={{ height: 'fit-content', position: 'sticky', top: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <Filter size={20} />
                        <h3 style={{ margin: 0 }}>Filters</h3>
                        {(selectedIndustry || selectedRole || selectedCategory || searchQuery) &&
                            <button
                                onClick={() => { setSelectedIndustry(''); setSelectedRole(''); setSelectedCategory(''); setSearchQuery(''); }}
                                style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'red' }}
                            >
                                <X size={16} />
                            </button>
                        }
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Search Keyword</label>
                            <input 
                                type="text"
                                placeholder="Search comments..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                            />
                        </div>
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
                        filteredComments.map(c => <SentimentCard key={c.id} comment={c} searchQuery={searchQuery} />)
                    )}
                </div>

            </div>
        </div>
    );
};

export default Analysis;
