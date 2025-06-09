import './App.css'
import { Routes,Route,Link } from 'react-router-dom'
import {Login} from './pages/Login.jsx';
import Keyword from './pages/Keyword.jsx';
import Top from './pages/Top.jsx';


function App() {

  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/keyword" element={<Keyword />} />
        <Route path="/top" element={<Top />} />
      </Routes>
  )
}

export default App