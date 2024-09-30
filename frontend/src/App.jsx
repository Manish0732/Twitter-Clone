import { Routes, Route, Navigate } from "react-router-dom"
import SignUpPage from "./pages/auth/signup/SignUpPage"
import LoginPage from "./pages/auth/login/LoginPage"
import HomePage from "./pages/home/HomePage"
import NotificationPage from "./pages/notification/NotificationPage"
import ProfilePage from "./pages/profile/ProfilePage"
import ForgotPage from "./pages/auth/forget/ForgotPage"
import ResetPassword from "./pages/auth/forget/ResetPassword"

import Sidebar from "./components/common/Sidebar"
import RightPanel from "./components/common/RightPanel"
import LoadingSpinner from "./components/common/LoadingSpinner"

import { Toaster } from "react-hot-toast"
import { useQuery } from "@tanstack/react-query"


function App() {

  const { data: authUser, isLoading } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.error) return null;
        if (!res.ok) throw new Error(data.error || "Something went wrong")
        return data;
      } catch (error) {
        throw new Error(error);

      }
    },
    retry: false
  })

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="loading-lg" />
      </div>
    )
  }

  return (
    <div className="flex max-w-6xl mx-auto">
      {authUser && <Sidebar />}
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to={'/login'} />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to={'/'} />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to={'/'} />} />
        <Route path="/forgot" element={<ForgotPage />} />
        <Route path="/verify-reset" element={<ResetPassword />} />
        <Route path="/notifications" element={authUser ? <NotificationPage /> : <Navigate to={'/login'} />} />
        <Route path="/profile/:username" element={authUser ? <ProfilePage /> : <Navigate to={'/login'} />} />
      </Routes>
      {authUser && <RightPanel />}
      <Toaster toastOptions={{ style: { padding: '16px', color: '#fff', background: '#121214' } }} />
    </div>
  )
}

export default App
