import React, { useState } from 'react';
import axios from 'axios';
import { getAuthenticatedInstance } from './auth';
import './App.css';

const App = () => {
  const [title, setTitle] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [posts, setPosts] = useState([]);

  const kc = getAuthenticatedInstance();

  const handleLogout = () => {
    kc.logout().then(() => kc.logout());
  };

  const handlePost = async () => {
    try {
      await axios.post('http://localhost:3001/posts', { title }, {
        headers: {
          'Authorization': `Bearer ${kc.token}`
        }
      });
      setInfoMessage('Post created successfully!');
    } catch (error) {
      console.error('Post creation failed:', error);
      setInfoMessage('Post creation failed.');
    }
  };

  const handleGetPosts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/posts', {
        headers: {
          'Authorization': `Bearer ${kc.token}`
        }
      });
      setPosts(response.data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      setInfoMessage('Failed to fetch posts.');
    }
  };

  return (
    <div className="container">
      <div className="button-group">
        <button onClick={handleLogout}>Logout</button>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button onClick={handlePost}>Create Post</button>
        <button onClick={handleGetPosts}>Get Posts</button>
      </div>
      <div>
        <p>{infoMessage}</p>
      </div>
      <div className="posts">
        {posts.map((post, index) => (
          <div key={index} className="post">
            <h2>{post.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;