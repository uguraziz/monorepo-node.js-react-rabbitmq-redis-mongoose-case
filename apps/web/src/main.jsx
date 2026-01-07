import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryProvider } from './app/providers/query-client.jsx'
import { ThemeProvider } from './app/providers/theme-provider.jsx'
import { SocketProvider } from './app/providers/socket-provider.jsx'
import { router } from './app/routes/index.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryProvider>
      <ThemeProvider>
        <SocketProvider>
          <RouterProvider router={router} />
        </SocketProvider>
      </ThemeProvider>
    </QueryProvider>
  </StrictMode>,
)
