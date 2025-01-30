import { Routes, Route } from 'react-router-dom'
import './App.css'
import Scanner from './Scanner'
import Login from './Login'
import Question from './Question'

function App() {
  return (
      <Routes>
        <Route exact path="/qr-scanner" element={<Scanner />}></Route>
        <Route exact path="/login" element={<Login />}></Route>
        <Route exact path="/question" element={<Question />}></Route>
      </Routes>
  )
}

export default App
