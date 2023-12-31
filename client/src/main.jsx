// import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'

import App from './App'
import MainContent from './components/MainContent';
import Recent from "./components/Recent"
import Favorites from './components/Favorites';
import Login from './components/Login'
import SignUp from './components/Signup';
import AdminCreatePost from './components/admin/AdminCreatePost';
import AdminManageBlog from './components/admin/AdminManageBlog';
import AdminManageUsers from './components/admin/AdminManageUsers';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Login />
      },
      {
        path: '/recent',
        element: <Recent />
      },
      {
        path: '/favorites',
        element: <Favorites />
      },
      {
        path: '/home',
        element: <MainContent />
      },
      {
        path: '/signup',
        element: <SignUp />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/admin/posts',
        element: <AdminCreatePost />
      },
      {
        path: '/admin/blogs',
        element: <AdminManageBlog />
      },
      {
        path: '/admin/users',
        element: <AdminManageUsers />
      },
      
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)