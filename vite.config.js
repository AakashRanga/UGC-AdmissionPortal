import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'

// Read Port Settings from backend/.env (Single Source of Truth)
function getEnvPorts() {
  let frontendPort = 80
  let backendPort = 8080

  const envPaths = [
    path.resolve(process.cwd(), 'backend', '.env'),
    path.resolve(process.cwd(), '.env')
  ]

  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8')
      const feMatch = content.match(/^FRONTEND_PORT\s*=\s*(\d+)/m)
      const beMatch = content.match(/^BACKEND_PORT\s*=\s*(\d+)/m)
      if (feMatch) frontendPort = parseInt(feMatch[1], 10)
      if (beMatch) backendPort = parseInt(beMatch[1], 10)
    }
  }

  return { frontendPort, backendPort }
}

const { frontendPort, backendPort } = getEnvPorts()

const allowedHostsList = [
  "180.235.121.244",
  "127.0.0.1",
  "172.21.100.161",
  "online.admission.saveetha.com",
  "localhost"
]

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    host: '0.0.0.0',
    port: frontendPort,
    strictPort: true,
    allowedHosts: allowedHostsList,
    proxy: {
      '/api': {
        target: `http://127.0.0.1:${backendPort}`,
        changeOrigin: true,
        secure: false
      }
    }
  },
  preview: {
    host: '0.0.0.0',
    port: frontendPort,
    allowedHosts: allowedHostsList
  }
})

