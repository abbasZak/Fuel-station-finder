import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Signin from './Signin';
import Signup from './Signup';

function App() {
  

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Signin />} ></Route>
          <Route path='/Signup' element={<Signup />} ></Route>
          <Route path='/Home' element={<Home />} ></Route>    
        </Routes>
      </Router>

      </>
  )
}

export default App
