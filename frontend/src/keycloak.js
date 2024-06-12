import Keycloak from 'keycloak-js';

let keycloakInstance;

export function getKeycloakInstance() {
  if (!keycloakInstance) {
    keycloakInstance = new Keycloak({
        url: 'http://localhost:8080/',
        realm: 'master',
        clientId: 'react-client',
    });
  }

  return keycloakInstance;
}