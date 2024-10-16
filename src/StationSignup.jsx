import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { db, auth } from './config/firebase';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

function StationSignup(){
    const [StationName, setStationName] = useState("");
    const [Email, setEmail] = useState("");
    const [location, setLocation] = useState("");
    const [Password, setPassword] = useState("");

    const { enqueueSnackbar } = useSnackbar();

    const link = useNavigate();

    async function handleSignUp(e){
        e.preventDefault();
        try{
            const usercredentials =  await createUserWithEmailAndPassword(auth, Email, Password);
            const user = usercredentials.user;
            let Stationref = doc(db, 'users', user.uid );
            let role = "Station"; 
            await setDoc(Stationref, {
                StationName: StationName,
                Email: Email,
                Location: location,
                Password: Password,
                role: role
            })

            enqueueSnackbar("Succesful Sign up", {variant: 'success'});
            link("/StationPage")

        }catch(err){
            enqueueSnackbar(err.message);

        }
    }

    return(
        <div className="flex justify-center h-screen align-middle items-center">
            
            <div className="bg-white p-10 min-w-[350px]">
            <h1 className="text-2xl font-bold">Station Signup</h1>
            <br />
            <form class="max-w-sm mx-auto">
            

            <div class="mb-5">
                <label for="Name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Station Name</label>
                <input 
                type="text" 
                id="Name" 
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                placeholder="name@flowbite.com" 
                required 
                onChange={(e) => setStationName(e.target.value)}
                />
            </div>

            <div class="mb-5">
                <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Company email</label>
                <input 
                type="email" 
                id="email" 
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                placeholder="name@flowbite.com" 
                required 
                onClick={(e) => setEmail(e.target.value)}
                />
            </div> 

            <div class="mb-5">
                <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Location</label>
                <input 
                type="text" 
                id="password" 
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                required 
                onClick={(e) => setLocation(e.target.value)}
                />

            </div>

            <div class="mb-5">
                <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                <input 
                type="password" 
                id="password" 
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                required 
                onClick={(e) => setPassword(e.target.value)}
                />
            </div>

            <div class="flex items-start mb-5">
                <div class="flex items-center h-5">
                <input id="remember" type="checkbox" value="" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" required />
                </div>
                <label for="remember" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Remember me</label>
            </div>
            <button 
            onClick={handleSignUp}
            type="submit" 
            class="text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full bg-mygreen hover:bg-hovermygreen  px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Register</button>
            </form>
            </div>

            

        </div>
    )
}

export default StationSignup;