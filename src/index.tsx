// src/index.tsx

import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import createStore from 'react-auth-kit/createStore';
import AuthProvider from 'react-auth-kit';
// components
import App from './App';
import Login from './components/Login/Login';
import Register from './components/Login/Register';
import ProfileCompletion from './components/ProfileCompletion/ProfileCompletion';
import ProfilePending from './components/Pendings/ProfilePending/ProfilePending';
import Announcements from './components/Announcements/Announcements';
import Admission from './components/Admission/Admission';
import Welcome from './components/Welcome/Welcome';
// styles
import './index.css';
import DocumentUpload from './components/DocumentUpload/DocumentUpload';
import ProfileView from './components/ProfileView/ProfileView';

const store = createStore({
  authName: '_auth',
  authType: 'cookie',
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === 'https:',
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <h1>404 Not Found</h1>,
    children: [
      {
        index: true,
        element: <Welcome />,
      },
      {
        path: 'announcements',
        element: <Announcements />,
      },
      {
        path: 'admission',
        element: <Admission />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'profile-complition',
        element: <ProfileCompletion />,
      },
      {
        path: 'profile-complition/additional',
        element: <DocumentUpload/>,
      },
      {
        path: 'profile-pending',
        element: <ProfilePending />,
      },
      {
        path : 'profile',
        element: <ProfileView/>
      }
    ],
  },
]);

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <AuthProvider store={store}>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
