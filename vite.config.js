import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
const cspPlugin = {
    name: 'html-csp-injector',
    transformIndexHtml(html) {
        return html.replace('<head>', `<head>
        <meta http-equiv="Content-Security-Policy" content="
          default-src 'self' https://js.stripe.com;
          script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.gstatic.com https://www.googletagmanager.com;
          style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
          font-src 'self' https://fonts.gstatic.com https://js.stripe.com;
          img-src 'self' data: https://firebasestorage.googleapis.com;
          connect-src 'self'
            https://identitytoolkit.googleapis.com
            https://securetoken.googleapis.com
            https://firebase.googleapis.com
            https://firestore.googleapis.com
            https://www.googleapis.com
            https://accounts.google.com
            https://apis.google.com
            https://api.stripe.com
            https://js.stripe.com
            wss:;
          frame-src https://js.stripe.com https://hooks.stripe.com;
          worker-src https://js.stripe.com blob:;
        ">
      `);
    },
};
export default defineConfig({
    plugins: [react(), cspPlugin],
});
