import './Home.css';
import { FaMapMarkerAlt } from "react-icons/fa";
import { LuFuel } from "react-icons/lu";
import { MdLogout } from "react-icons/md";
import Gaslogo from './img/gasoline.png';
import User from './img/user.png';
import ReactSwitch from 'react-switch';
import { useState } from 'react';

function Home(){
    const [theme, setTheme] = useState("dark");

    function toggleTheme(){
        setTheme((curr) => (curr == 'dark'? 'light':'dark'));
    }

    return (
    <div className={`bg-black min-h-screen ${theme === 'dark'? 'bg-gray-200': 'bg-gray-800'} `}>
        <div className={` flex justify-evenly p-4 ${theme === 'dark'? 'bg-white': 'bg-gray-900'}  `}>
            <div className='flex align-middle'>
                <img src={Gaslogo} alt="Gass logo" className='w-[50px] h-[50px]' />
                <label className={`font-bold text-3xl mt-2 font-serif ${theme === 'dark'? 'text-black': 'text-white'}`}>FSF</label>
            </div>

            <div className='flex mt-2 gap-4'>
                <div className='flex gap-2'>
                    <img src={User} alt="user profile pic" className='w-[30px] h-[30px]' />
                    <label className={`text-2xl ${theme === 'dark'? 'text-black': 'text-white'}`}>John doe</label>
                </div>
                
                <div>
                    <ReactSwitch 
                    onChange={toggleTheme}
                    checked= {theme == 'light'}
                    />
                </div>
                

                            

                <div>
                
                </div>    
            </div>

            
        </div>
        <div className={` fixed top-0 left-0 flex flex-col items-center align-middle w-[10%] h-screen  ${theme === 'dark'? 'bg-white': 'bg-gray-900'} bg-white transition-all `}>
        <nav className='flex flex-col justify-center align-middle mt-36 w-full gap-4  '>
            <div className={`flex gap-2 text-center hover:bg-gray-300 w-full p-2 cursor-pointer ${theme === 'dark'? 'hover:bg-gray-300': 'hover:bg-gray-800'} `}>
                <FaMapMarkerAlt size={28} className={`${theme === 'dark'? 'text-black': 'text-white'}`}/>
                <a href="#" className={`${theme === 'dark'? 'text-black': 'text-white'} transition-colors `}>Map</a>
            </div>

            <div className={`flex gap-2 text-center  w-full p-2 cursor-pointer ${theme === 'dark'? 'hover:bg-gray-300': 'hover:bg-gray-800'}`}>
                <LuFuel size={28} className={`${theme === 'dark'? 'text-black': 'text-white'}`}/>
                <a href="#" className={`${theme === 'dark'? 'text-black': 'text-white'}`}>Gas</a>
            </div>

            
        </nav>
        </div>
        
        
    </div>

    )
}

export default Home;