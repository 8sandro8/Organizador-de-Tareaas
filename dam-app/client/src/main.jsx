import { createRoot } from 'react-dom/client'
import { Suspense } from 'react'
import './i18n'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary'

const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
)

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <Suspense fallback={<Loading />}>
      <App />
    </Suspense>
  </ErrorBoundary>,
)
