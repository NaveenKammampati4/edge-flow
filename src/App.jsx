import './App.css'

import Main from './components/Main'
import { BrowserRouter, Routes, Route,Navigate } from "react-router-dom";
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';


function App() {

  return (
     <BrowserRouter>
      <Routes>
        <Route path="/:userName/:token" element={<Main />} />
         {/* <Route path="/" element={<Navigate to="/login" />} /> */}
        <Route path="/login" element={<LoginPage/>} />
         <Route path="/register" element={<RegisterPage />} />
        {/* <Route path="*" element={<Navigate to="/login" />} /> */}
      </Routes>
    </BrowserRouter>
  )

  //  return(
  //  <BrowserRouter>
  //     <Routes>
  //        <Route path="/" element={<Navigate to="/login" />} />
  //       <Route path="/login" element={<LoginPage/>} />
  //        <Route path="/register" element={<RegisterPage />} />
  //       <Route path="*" element={<Navigate to="/login" />} />
  //     </Routes>
  //   </BrowserRouter>
  //  )

}

export default App


















