import './App.css'

import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginView from './components/LoginView'
import AdminHome from './components/AdminHome'
import UserHome from './components/UserHome'

function App() {

  return <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginView />} />
      <Route path="/admin" element={<AdminHome />} />
      <Route path="/home" element={<UserHome />} />
    </Routes>
  </BrowserRouter>
}

export default App
