import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import Home from './pages/home/home'
import Login from './pages/auth/login'
import Register from './pages/auth/register'
import Dashboard from './pages/dashboard/dashboard'
import TripStart from "./pages/trip/startTrip";
import './App.css'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/trip/:tripId" element={<TripStart/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
