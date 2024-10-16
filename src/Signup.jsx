import { Link, useNavigate } from 'react-router-dom';
import GoogleImg from './img/google.png';
import { auth, db } from './config/firebase';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import {  setDoc, doc } from 'firebase/firestore';
import './Register.css';
import { RxColorWheel } from 'react-icons/rx';

function Signup(){
    const [FirstName, setFirstName] = useState("");
    const [LastName, setLastName] = useState("");
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");
    const [ConfPassword, setConfirmPass] = useState("");
    

    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            if(ConfPassword !== Password){
                enqueueSnackbar('Confitm Password does not match', { variant: 'error' });         
            }

            // Create user in Firebase Authentication
            const usercredential =  await createUserWithEmailAndPassword(auth, Email, Password);
            const user = usercredential.user;
            // Add user info to Firestore
            const userRef = doc(db, 'users', user.uid);
            let role = 'User';

            await setDoc(userRef, {
                FirstName: FirstName,
                LastName: LastName,
                Email: user.email,
                role: role
            })

            if(role === 'User'){
              navigate('/Home');
            }
            if(role == 'Station'){
                navigate('/StationPage');
            }

            
            // Trigger success notification
            enqueueSnackbar('User signed up successfully!', { variant: 'success' });
        } catch (err) {
            // Handle error and trigger error notification
            enqueueSnackbar(`${err.message}`, { variant: 'error' });
        }
    };

    

    return(
        <div className="flex flex-col justify-center items-center h-screen">
      

      <div className="p-10 bg-white  mt-10 max-w-[350px]">
      <h1 className="font-bold text-4xl text-center">Sign up</h1>
      <br />

        <form class="max-w-md mx-auto">
        

        <div class="grid md:grid-cols-2 md:gap-6">
            <div class="relative z-0 w-full mb-5 group">
                <input 
                type="text" 
                name="floating_first_name" 
                id="floating_first_name" 
                class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
                placeholder=" " 
                required 
                value={FirstName}
                onChange={(e) => setFirstName(e.target.value)}
                />
                <label for="floating_first_name" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">First name</label>
            </div>
            <div class="relative z-0 w-full mb-5 group">
                <input 
                type="text" 
                name="floating_last_name" id="floating_last_name" 
                onChange={(e) => setLastName(e.target.value)}
                value={LastName}
                class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                <label for="floating_last_name" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Last name</label>
            </div>
          </div>

            
          
          <div class="relative z-0 w-full mb-5 group">
              <input 
              type="email" 
              name="floating_email" 
              id="floating_email" 
              onChange={(e) => setEmail(e.target.value)}
              value={Email}
              class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
              <label for="floating_email" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email address</label>
          </div>
          <div class="relative z-0 w-full mb-5 group">
              <input 
              type="password" 
              name="floating_password" 
              id="floating_password"
              onChange={(e) => setPassword(e.target.value)}
              value={Password} 
              class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
              <label for="floating_password" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
          </div>
          <div class="relative z-0 w-full mb-5 group">
              <input 
              type="password" 
              name="repeat_password" 
              id="floating_repeat_password" 
              class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required 
              onChange={(e) => setConfirmPass(e.target.value)}
              value={ConfPassword}
              />
              <label for="floating_repeat_password" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Confirm password</label>
          </div>
         
          
          <button 
          type="submit" 
          onClick={handleSignUp}
          class="text-white bg-mygreen hover:bg-hovermygreen focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
          <p>Already have an account? <Link to={`/`}>Sign in</Link></p>
          <br />     
          <hr />
          <br />
          <div className='flex gap-4 border p-2 rounded-full'>
            <img src={GoogleImg} alt="Google icon" className='w-[40px] h-[40px]' />
            <button>Sign up with Google</button>
          </div>
        </form>

      </div>
    </div>
    )
}

export default Signup;