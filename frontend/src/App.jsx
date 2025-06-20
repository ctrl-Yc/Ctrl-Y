import { Routes,Route,Link } from 'react-router-dom'
import { Login } from './pages/Login.jsx';
import { Keyword } from './pages/Keyword.jsx';
import  { Top }  from './pages/Top.jsx';
import { SignupPage } from './pages/SignupPage.jsx';
import { Childsignup } from './pages/Childsignup.jsx';


export function App() {

  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/keyword" element={<Keyword />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path="/top" element={<Top />} />
        <Route path="/childname" element={<Childsignup />} />
      </Routes>
  )
}

