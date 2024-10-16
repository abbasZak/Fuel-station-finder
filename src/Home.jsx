import React, { useState, useEffect } from 'react';
import { FaCaretDown } from "react-icons/fa";
import { LuFuel } from "react-icons/lu";
import { MdLogout } from "react-icons/md";
import { CiMap } from "react-icons/ci";
import { RxHamburgerMenu } from "react-icons/rx";
import ReactSwitch from 'react-switch';
import { onAuthStateChanged } from 'firebase/auth';
import Map from './Map';
import Gas from './Gas';
import { auth, db } from './config/firebase';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

import './Home.css'

// Assume these imports are working correctly
import Gaslogo from './img/gasoline.png';
import User from './img/user.png';
import { enqueueSnackbar } from 'notistack';

const Home = () => {
    const [theme, setTheme] = useState('dark');
    const [showSidebar, setShowSidebar] = useState(true);
    const [activeItem, setActiveItem] = useState("map");
    const [user, setuser] = useState(null);
    const [specUser, setspecuser] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        
      const unsuscribe =  onAuthStateChanged(auth, (currentuser) => {
     
        async function Check() {
            const userRef = doc(db, "users", currentuser.uid);
            const docSnap = await getDoc(userRef);
            const data = docSnap.data();
            setspecuser(data);
            
            

            if(currentuser && data.role === 'User'){
                setuser(currentuser);
               
              }else{
                navigate('/');
                auth.signOut();
                setuser(null);
              }    
        }

        console.log(specUser);
        

        Check();  
      })

      

      return () => unsuscribe();
    }, [auth])
    
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    const toggleSidebar = () => setShowSidebar(!showSidebar);

    const changeContent = (item) => {
        setActiveItem(item);
    };

    const renderContent = () => {
        switch(activeItem) {
            case 'map':
                return <Map />;
            case 'gas':
                return <Gas theme={theme} />;
            default:
                return <Map />;
        }
    };

    async function logOut() {
        try {
            await signOut(auth);
            setuser(null);
            enqueueSnackbar("Log out successful", { variant: 'success' });
            navigate('/');  // Redirect to sign-in page after successful sign out
        } catch (err) {
            enqueueSnackbar(err.message, { variant: 'error' });
        }
    }
    

    const textColor = theme === 'dark' ? 'text-black' : 'text-white';
    const bgColor = theme === 'dark' ? 'bg-gray-200' : 'bg-gray-800';
    const sidebarBgColor = theme === 'dark' ? 'bg-white' : 'bg-gray-900';

    return (
        <div className={`min-h-screen ${bgColor}`}>
            {/* Header */}
            <header className={`flex justify-between p-4 fixed z-[1000] w-full ${sidebarBgColor}`}>
                <div className='md:hidden'>
                    <RxHamburgerMenu 
                        className={`text-4xl ${textColor} cursor-pointer`} 
                        onClick={toggleSidebar}
                    />
                </div>
                <div className="flex items-center">
                    <img src={Gaslogo} alt="Gas logo" className="w-[50px] h-[50px]" />
                    <span className={`font-bold text-xl md:text-2xl ml-2 font-serif ${textColor}`}>FSF</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 relative">
                        <div className='relative' id='box' >
                            <div className='flex gap-2 '>
                                <img src={User} alt="user profile pic" className="w-[30px] h-[30px]" />
                                <span className={`text-lg md:text-2xl ${textColor}`}>{specUser.FirstName || 'User'}</span>
                            </div>
                            

                            <div className='bg-white p-2 absolute w-full rounded-sm shadow-md ' id='logoutDiv'>
                                <button
                                onClick={logOut}
                                >
                                    
                                    Logout</button>
                            </div>    
                        </div>
                        
                        <FaCaretDown className={`text-4xl ${textColor}`} />

                        
                    </div>
                    <ReactSwitch 
                        onChange={toggleTheme} 
                        checked={theme === 'light'} 
                        onColor="#333" 
                        offColor="#ccc" 
                    />
                </div>
            </header>

            {/* Sidebar */}
            <aside className={`fixed top-0 flex flex-col items-center z-[999] w-[200px] h-screen 
                ${sidebarBgColor} transition-all duration-300 ease-in-out
                ${showSidebar ? 'left-0' : '-left-[200px]'} md:left-0`}>
                <nav className="flex flex-col justify-center mt-36 w-full gap-4">
                    {['map', 'gas'].map((item) => (
                        <div
                            key={item}
                            className={`flex gap-2 items-center w-full p-4 cursor-pointer
                                ${theme === 'dark' ? 'hover:bg-gray-300' : 'hover:bg-gray-800'}
                                ${activeItem === item ? (theme === 'dark' ? 'bg-gray-300' : 'bg-gray-800') : ''}`}
                            onClick={() => changeContent(item)}
                        >
                            {item === 'map' ? <CiMap className={`${textColor} text-2xl`} /> : <LuFuel className={`${textColor} text-2xl`} />}
                            <span className={`${textColor} capitalize`}>{item}</span>
                        </div>
                    ))}
                </nav>
            </aside>
 q  
            {/* Main Content */}
            <main className='ml-0 md:ml-[200px] pt-20 p-4'>
                {renderContent()}
            </main>
        </div>
    );
};

export default Home;