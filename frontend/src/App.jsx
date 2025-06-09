import './App.css'
import { Routes,Route,Link } from 'react-router-dom'
import {Login} from './pages/Login.jsx';
import Keyword from './pages/Keyword.jsx';


function App() {

  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/keyword" element={<Keyword />} />
      </Routes>
  )
}

export default App
