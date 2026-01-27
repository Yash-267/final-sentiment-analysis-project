import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText } from 'lucide-react';
import { useData } from '../context/DataContext';

const Header = () => {
    const { uploadFile, loading, error } = useData();
    const fileInputRef = useRef(null);

    const navigate = useNavigate();

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const success = await uploadFile(file);
            if (success) {
                navigate('/analysis');
            }
        }
    };

    return (
        <header style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '1rem 2rem' }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 'none', padding: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ background: 'var(--color-primary)', padding: '0.5rem', borderRadius: '8px', color: 'white' }}>
                        <FileText size={24} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--color-text-main)' }}>MCA e-Consultation Dashboard</h1>
                        <p style={{ fontSize: '0.875rem', margin: 0, color: 'var(--color-text-muted)' }}>Powered by Next_code AI</p>
                    </div>
                </div>

                <button
                    className="btn btn-primary"
                    onClick={() => fileInputRef.current.click()}
                    disabled={loading}
                >
                    <UploadCloud size={20} />
                    {loading ? 'Processing...' : 'Upload Draft Legislation'}
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".csv, .xlsx, .xls"
                    style={{ display: 'none' }}
                />
                {error && (
                    <div style={{
                        position: 'absolute',
                        top: '80px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: '#fee2e2',
                        color: '#991b1b',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        border: '1px solid #fecaca',
                        zIndex: 100
                    }}>
                        Error: {error}
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
