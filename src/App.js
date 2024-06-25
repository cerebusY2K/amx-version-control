import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [appsData, setAppsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        axios.get('https://amx-version-control-backend.onrender.com/api/version')
            .then(response => {
                setAppsData(response.data.apps);
                setLoading(false);
            })
            .catch(error => {
                console.error('There was an error fetching the version data!', error);
                setLoading(false);
            });
    }, []);

    const handleChange = (index, e) => {
        const { name, value, type, checked } = e.target;
        setAppsData(prevData => {
            const newData = [...prevData];
            newData[index][name] = type === 'checkbox' ? checked : value;
            return newData;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('https://amx-version-control-backend.onrender.com/api/version', { apps: appsData })
            .then(response => {
                setMessage(response.data);
            })
            .catch(error => {
                console.error('There was an error updating the version data!', error);
                setMessage('Error updating version data');
            });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="App">
            <h1>Version Management</h1>
            <form onSubmit={handleSubmit}>
                <div className="grid-container">
                    {appsData.map((app, index) => (
                        <div key={index} className="grid-item">
                            <h2>{app.name}</h2>
                            <div>
                                <label>Latest Version:</label>
                                <input
                                    type="text"
                                    name="latest_version"
                                    value={app.latest_version}
                                    onChange={e => handleChange(index, e)}
                                />
                            </div>
                            <div>
                                <label>Version Code:</label>
                                <input
                                    type="number"
                                    name="version_code"
                                    value={app.version_code}
                                    onChange={e => handleChange(index, e)}
                                />
                            </div>
                            <div>
                                <label>Force Update:</label>
                                <input
                                    type="checkbox"
                                    name="force_update"
                                    checked={app.force_update}
                                    onChange={e => handleChange(index, e)}
                                />
                            </div>
                            <div>
                                <label>Skippable:</label>
                                <input
                                    type="checkbox"
                                    name="skippable"
                                    checked={app.skippable}
                                    onChange={e => handleChange(index, e)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <button type="submit">Update Versions</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default App;
