import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Add this block to configure Babel
  build: {
    rollupOptions: {
      plugins: [
        {
          name: 'babel',
          enforce: 'pre',
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: [],
          },
        },
      ],
    },
  },
});