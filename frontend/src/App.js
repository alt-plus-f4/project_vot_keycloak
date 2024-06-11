import React, { useState } from 'react';
import axios from 'axios';
import { ReactKeycloakProvider, useKeycloak } from '@react-keycloak/web';
import keycloak from './keycloak';

const App = () => {
  const { initialized } = useKeycloak();
  const [title, setTitle] = useState('');

  const handleLogin = async () => {
    if (!keycloak.authenticated) {
      keycloak.login();
    }
  };

  const handlePost = async () => {
    try {
      await axios.post('/posts', { title }, {
        headers: {
          Authorization: `Bearer ${keycloak.token}`
        }
      });
    } catch (error) {
      console.error('Post creation failed:', error);
    }
  };

  if (!initialized) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {!keycloak.authenticated ? (
        <button onClick={handleLogin}>Login</button>
      ) : (
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button onClick={handlePost}>Create Post</button>
        </div>
      )}
    </div>
  );
};

const AppWrapper = () => (
  <ReactKeycloakProvider authClient={keycloak}>
    <App />
  </ReactKeycloakProvider>
);

export default AppWrapper;