import { getKeycloakInstance } from './keycloak';
import { httpClient } from './HttpClient';

let kc = getKeycloakInstance();

kc.init({
  onLoad: 'login-required',
  checkLoginIframe: true,
  pkceMethod: 'S256'
}).then((auth) => {
  if (!auth) {
    window.location.reload();
  } else {
    console.info("Authenticated");
    console.log('auth', auth)
    console.log('kc', kc)
    console.log('Access Token', kc.token)

    httpClient.defaults.headers.common['Authorization'] = `Bearer ${kc.token}`;

    kc.onTokenExpired = () => {
      console.log('token expired')
    }
  }
}, () => {
  console.error("Authentication Failed");
});

export function getAuthenticatedInstance() {
  return kc;
}