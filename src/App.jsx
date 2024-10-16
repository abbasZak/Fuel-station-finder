import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Signin from './Signin';
import Signup from './Signup';
import StationPage from './StationPage';
import StationSignup from './StationSignup';
import StationSignin from './StationSignin';

function App() {
  

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Signin />} ></Route>
          <Route path='/Signup' element={<Signup />} ></Route>
          <Route path='/Home' element={<Home />} ></Route>
          <Route path='/StationPage' element={<StationPage />}></Route>
          <Route path='/StationSignup' element={<StationSignup />}></Route>
          <Route path='/Stationsignin' element={<StationSignin />}></Route>
        </Routes>
      </Router>

      </>
  )
}

export default App
