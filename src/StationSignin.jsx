import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth, db } from "./config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useSnackbar } from 'notistack';
import { useNavigate } from "react-router-dom";

function StationSignin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { enqueueSnackbar } = useSnackbar(); 
    const navigate = useNavigate();

    const handleSignin = async (e) => {
        e.preventDefault();
      
        try {
          // Sign in user
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
      
          // Get user data from Firestore
          const userRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(userRef);
      
          if (docSnap.exists()) {
            const userData = docSnap.data();
            const role = userData.role;
      
            // Check role
            if (role === 'Station') {
              enqueueSnackbar("Login Successful", { variant: 'success' });
              navigate("/StationPage");
            } else {
              enqueueSnackbar("Unauthorized access for this role", { variant: 'error' });
              await auth.signOut(); // Sign out unauthorized user
            }
          } else {
            // Handle case where no document exists
            enqueueSnackbar("User data not found in the database", { variant: 'error' });
          }
        } catch (err) {
          // Error handling
          enqueueSnackbar(err.message, { variant: 'error' });
        }
    };
    
    return (
        <div className="flex justify-center h-screen align-middle items-center">
            <div className="bg-white p-10 min-w-[350px]">
                <h1 className="text-2xl font-bold">Station Signin</h1>
                <br />
                <form className="max-w-sm mx-auto" onSubmit={handleSignin}>
                    <div className="mb-5">
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Company email</label>
                        <input 
                            type="email" 
                            id="email" 
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            placeholder="name@flowbite.com" 
                            required 
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div> 

                    <div className="mb-5">
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                        <input 
                            type="password" 
                            id="password" 
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            required 
                        />
                    </div>

                    <div className="flex items-start mb-5">
                        <div className="flex items-center h-5">
                            <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" required />
                        </div>
                        <label htmlFor="remember" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Remember me</label>
                    </div>
                    <button 
                        type="submit" 
                        className="text-white bg-mygreen hover:bg-hovermygreen focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
}

export default StationSignin;