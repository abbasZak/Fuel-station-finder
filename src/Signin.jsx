import './Register.css';
import { Link, useNavigate } from 'react-router-dom';
import GoogleImg from './img/google.png';
import { useSnackbar } from 'notistack';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { auth, db } from './config/firebase';
import { useEffect, useState } from 'react';

function Signin() {
  const { enqueueSnackbar } = useSnackbar();

  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [userAuth, setUserAuth] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
      if(currentuser){
        setUserAuth(currentuser);
        
      }else{
        setUserAuth(null);
      }
    })

    return () => unsubscribe();
  }, [])

  const handleSignin = async (e) => {
    e.preventDefault();
  
    try {
      // Ensure Email and Password are correctly captured
      if (!Email || !Password) {
        enqueueSnackbar('Email and Password cannot be empty', {variant: 'error'});
        return;
      }
  
      // Sign in with email and password
      const userCredentials = await signInWithEmailAndPassword(auth, Email, Password);
      const user = userCredentials.user;
      
      // Fetch user document from Firestore based on the signed-in user's UID
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);
  
      if (docSnap.exists()) {
        const userData = docSnap.data();
        const role = userData.role;

        
  
        // Check if the role is 'User'
        if (role === 'User') {
          enqueueSnackbar('Success Signing in', {variant: 'success'});
          navigate('/Home'); // Redirect to the home page if role is correct
        } else {
          // Handle other roles or invalid roles
          enqueueSnackbar('Unauthorized access for this role', {variant: 'error'});
          // Optionally sign the user out or redirect
          await auth.signOut();  // Sign out the user if their role is not 'User'
        }
      } else {
        // If no user data found in Firestore
        enqueueSnackbar('No user data found in the database', {variant: 'error'});
      }
    } catch (err) {
      // Catch and display error messages
      enqueueSnackbar(`${err.message}`, {variant: 'error'});
    }
  };
  

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      

      <div className="p-10 bg-white min-w-[350px]  mt-10">
      <h1 className='text-4xl text-center font-bold'>Login</h1>

        <br />
        <form class="max-w-md mx-auto ">
          
          <div class="relative z-0 w-full mb-5 group">
              <input 
              type="email" 
              name="floating_email" 
              id="floating_email"
              value={Email}
              onChange={(e) => setEmail(e.target.value)} 
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 focus:text-gray-900 peer placeholder-gray-500" required />
              <label for="floating_email" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email address</label>
          </div>
          <div class="relative z-0 w-full mb-5 group">
              <input 
              type="password" 
              name="floating_password" 
              id="floating_password"
              value={Password}
              onChange={(e) => setPassword(e.target.value)} 
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 focus:text-gray-900 peer placeholder-gray-500" placeholder=" " required />
              <label for="floating_password" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
          </div>
          
          
          <button 
          onClick={handleSignin}
          type="submit" 
          className="text-white bg-mygreen hover:bg-hovermygreen  focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-mygreen   font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center"
          >
          Submit
      </button>

            <br />
          <p>Don't have an account? <Link to={`/Signup`}>Sign up</Link></p>
          <br />     
          <hr />
          <br />
          <div className='flex gap-4 border p-2 rounded-full'>
            <img src={GoogleImg} alt="Google icon" className='w-[40px] h-[40px]' />
            <button >Login with Google</button>
          </div>
          
        </form>

      </div>
    </div>
  );
}

export default Signin;
