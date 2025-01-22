import { Routes, Route } from 'react-router-dom'
import './App.css'
import Scanner from './Scanner'
import Login from './Login'

function App() {
  return (
      <Routes>
        <Route exact path="/" element={<Scanner />}></Route>
        <Route exact path="/login" element={<Login />}></Route>
      </Routes>
  )
}

export default App
