import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [data, setData] = useState(null); // { comments: [], stats: {}, summaries: [] }
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const uploadFile = async (file) => {
        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            // Assuming backend is at localhost:8000
            // Connect to Live Backend
            const res = await axios.post('http://127.0.0.1:8000/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // After upload, fetch all data
            await fetchData();
            return true;
        } catch (err) {
            setError(err.response?.data?.detail || err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const fetchData = async () => {
        try {
            const [commentsRes, statsRes, sumRes] = await Promise.all([
                axios.get('http://127.0.0.1:8000/comments'),
                axios.get('http://127.0.0.1:8000/stats'),
                axios.get('http://127.0.0.1:8000/summary')
            ]);

            setData({
                comments: commentsRes.data,
                stats: statsRes.data,
                summaries: sumRes.data
            });
        } catch (err) {
            console.error("Failed to fetch data", err);
        }
    };

    return (
        <DataContext.Provider value={{ data, loading, error, uploadFile }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);
