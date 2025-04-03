import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AppProvider } from './context/AppContext.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home.jsx'
import AllUsers from './pages/AllUsers.jsx'
import FreeSession from './pages/FreeSession.jsx'
import SubmittedForms from './pages/SubmittedForms.jsx'
import NotFound from './pages/NotFound.jsx'
import Login from './pages/Login.jsx'
import ProtectedDocRoute from './components/ProtectedRoute.jsx'
import ResetPassword from './components/ResetPassword.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <ProtectedDocRoute>
          <Home />
        </ProtectedDocRoute>
      },
      {
        path: '/all-users',
        element: <ProtectedDocRoute>
          <AllUsers />
        </ProtectedDocRoute>
      },
      {
        path: '/free-sessions',
        element: <ProtectedDocRoute>
          <FreeSession />
        </ProtectedDocRoute>
      },
      {
        path: '/submitted-forms',
        element: <ProtectedDocRoute>
          <SubmittedForms />
        </ProtectedDocRoute>
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: "/reset-password",
        element: <ResetPassword />
      },
      {
        path: '*',
        element: <NotFound />
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProvider>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </AppProvider>
  </StrictMode>,
)
