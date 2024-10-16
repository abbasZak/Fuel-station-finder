import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from './config/firebase';

function Gas({ theme }) {
    const isDark = theme === 'dark';
    const [combinedData, setCombinedData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        async function getItems() {
            try {
                const itemsRef = collection(db, "Items");
                const itemSnapshot = await getDocs(itemsRef);
                const itemsData = itemSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

                const mergedData = await Promise.all(
                    itemsData.map(async (item) => {
                        const userRef = doc(db, "users", item.UserId);
                        const userSnapshot = await getDoc(userRef);
                        const userData = userSnapshot.data();

                        return {
                            StationName: userData?.StationName || 'N/A',
                            Location: userData?.Location || 'N/A',
                            Status: item?.Status || 'N/A',
                            Category: item.Category || 'N/A',
                            Price: item.Price || 'N/A'
                        };
                    })
                );

                setCombinedData(mergedData);
                setFilteredData(mergedData);
            } catch (err) {
                console.error("Error fetching data:", err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        getItems();
    }, []);

    useEffect(() => {
        const filtered = combinedData.filter(item =>
            Object.values(item).some(value =>
                value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setFilteredData(filtered);
    }, [searchTerm, combinedData]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    if (loading) return <div className="mt-44 text-center">Loading...</div>;
    if (error) return <div className="mt-44 text-center text-red-500">Error: {error}</div>;

    return (
        <div className={`mt-44 ${isDark ? 'bg-white' : 'bg-gray-800'}`}>
            <div className="max-w-md mx-auto mb-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className={`w-full py-2 pl-10 pr-4 text-sm rounded-lg outline-none transition-colors duration-200 ease-in-out
                            ${isDark 
                                ? 'bg-gray-100 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500' 
                                : 'bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400'
                            } 
                            border ${isDark ? 'border-gray-300' : 'border-gray-600'}
                            focus:border-transparent`}
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className={`w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </div>
                </div>
            </div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                {filteredData.length > 0 ? (
                    <table className={`w-full text-sm text-left ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        <thead className={`text-xs uppercase ${isDark ? 'bg-gray-50 text-gray-700' : 'bg-gray-700 text-gray-400'}`}>
                            <tr>
                                <th scope="col" className="px-6 py-3">Filling Station</th>
                                <th scope="col" className="px-6 py-3">Location</th>
                                <th scope="col" className="px-6 py-3">Category</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((item, index) => (
                                <tr key={index} className={`border-b ${isDark ? 'bg-white border-gray-200 hover:bg-gray-50' : 'bg-gray-800 border-gray-700 hover:bg-gray-600'}`}>
                                    <th scope="row" className={`px-6 py-4 font-medium whitespace-nowrap ${isDark ? 'text-gray-900' : 'text-white'}`}>
                                        {item.StationName}
                                    </th>
                                    <td className="px-6 py-4">
                                        {item.Location}
                                    </td>
                                    <td className="px-6 py-4">
                                        {item.Category}
                                    </td>

                                    <td className="px-6 py-4">
                                        {item.Status}
                                    </td>

                                    <td className="px-6 py-4">
                                        {item.Price}/ltr
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-center py-4 font-bold">No data available</div>
                )}
            </div>
        </div>
    );
}

export default Gas;