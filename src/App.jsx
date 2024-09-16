import { BrowserRouter, Router, Routes, Route } from 'react-router-dom';

function App() {
  

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' ></Route>
          <Route path='/Signup' ></Route>
          <Route path='/Home' ></Route>    
        </Routes>
      </Router>
    </>
  )
}

export default App
