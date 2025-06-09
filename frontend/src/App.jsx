import './App.css'
import { Routes,Route,Link } from 'react-router-dom'
import { Login } from './pages/Login.jsx';
import { Keyword } from './pages/Keyword.jsx';
import { SignupPage } from './pages/SignupPage.jsx';


function App() {

  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/keyword" element={<Keyword />} />
        <Route path='/Signup' element={<SignupPage />} />
      </Routes>
  )
}

export default App



