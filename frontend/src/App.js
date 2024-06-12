import React, { useState } from 'react';
import axios from 'axios';
import { getAuthenticatedInstance } from './auth';

const App = () => {
  const [title, setTitle] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  const kc = getAuthenticatedInstance();

  const handleLogout = () => {
    kc.logout().then(() => kc.logout());
  };

  const handlePost = async () => {
    try {
      await axios.post('/posts', { title });
      setInfoMessage('Post created successfully!');
    } catch (error) {
      console.error('Post creation failed:', error);
      setInfoMessage('Post creation failed.');
    }
  };

  return (
    <div>
        <div>
          <button onClick={handleLogout}>Logout</button>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button onClick={handlePost}>Create Post</button>
          <div>
            <p>{infoMessage}</p>
          </div>
        </div>
    </div>
  );
};

export default App;