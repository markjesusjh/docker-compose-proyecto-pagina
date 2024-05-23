import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port:8000,
    proxy: {
      '/api2': {
        target: 'http://lb-proyecto-866978765.us-east-1.elb.amazonaws.com:8002',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api2/, ''),
      },
      '/api1': {
        target: 'http://lb-proyecto-866978765.us-east-1.elb.amazonaws.com:8001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api1/, ''),
      },
      '/api3': {
        target: 'http://lb-proyecto-866978765.us-east-1.elb.amazonaws.com:8003',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api3/, ''),
      }
    },
  },
});
