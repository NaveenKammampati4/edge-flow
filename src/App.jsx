import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Main from './components/Main'
import UserRepos from './components/UserRepos'

function App() {

  return (
    <>
     {/* <Main/>  */}
     {/* <UserRepos /> */}
     <BrowserRouter>
     <Routes>
      <Route path='/' element={<UserRepos />} />
     </Routes>
     </BrowserRouter>
    </>
  )
}

export default App


















