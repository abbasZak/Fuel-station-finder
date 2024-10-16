import { addDoc, collection, doc, getDocs, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db, auth } from './config/firebase';
import { useSnackbar } from 'notistack';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import EditModal from './EditModal';
import { MdCancel } from "react-icons/md";

function StationPage() {
    const [category, setcategory] = useState("");
    const [price, setPrice] = useState("");
    const [status, setstatus] = useState("");
    const [items, setItems] = useState([]);
    const [user, setuser] = useState(null);
    const [open, setOpen] = useState(false);
    const [categoryNew, setcategoryNew] = useState("");
    const [priceNew, setpriceNew] = useState("");
    const [selectedItemId, setSelectedItemId] = useState(null); // Track selected item ID
    const [showDropdown, setShowDropdown] = useState(false);

    const { enqueueSnackbar } = useSnackbar();
    const itemRef = collection(db, "Items");
    const currentUser = auth.currentUser;
    const navigate = useNavigate();

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handleSelect = (option) => {
        setShowDropdown(false);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                try {
                    const userRef = doc(db, "users", currentUser.uid);
                    const docSnap = await getDoc(userRef);
                    const data = docSnap.data();

                    if (data && data.role === "Station") {
                        setuser(currentUser); 
                    } else {
                        navigate('/Stationsignin');
                        await auth.signOut();
                        setuser(null);
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            } else {
                navigate('/Stationsignin');
                setuser(null);
            }
        });

        return () => unsubscribe();
    }, [auth, navigate]);

    async function addPrice(e) {
        e.preventDefault();
        setcategory("");
        setPrice("");
        try {
            await addDoc(itemRef, {
                Category: category,
                Price: price,
                UserId: currentUser.uid,
                Status: status
            });

            enqueueSnackbar("Price Added Successfully", { variant: 'success' });
        } catch (err) {
            enqueueSnackbar(err.message, { variant: 'error' });
        }
    }

    useEffect(() => {
        async function getItems() {
            if (currentUser) {
                try {
                    const itemSnapshot = await getDocs(itemRef);
                    const itemsData = itemSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                    setItems(itemsData);
                } catch (err) {
                    enqueueSnackbar(err.message, { variant: 'error' });
                }
            }
        }

        getItems();
    }, [currentUser]);

    function openEdit(id, category, price, status) {
        setOpen(true);  // Open the modal
        setcategoryNew(category);  // Set the current category in modal
        setpriceNew(price);  // Set the current price in modal
        setstatus(status);  // Set the current status in modal
        setSelectedItemId(id);  // Set the ID of the item being edited
    }

    async function updateItem() {
        const docRef = doc(db, "Items", selectedItemId);

        try {
            await updateDoc(docRef, {
                Category: categoryNew,
                Price: priceNew,
                Status: status
            });

            enqueueSnackbar("Successfully Updated", { variant: 'success' });

            // Optionally update the items in state
            setItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === selectedItemId
                        ? { ...item, Category: categoryNew, Price: priceNew, Status: status }
                        : item
                )
            );

            setOpen(false);  // Close modal after update
        } catch (err) {
            enqueueSnackbar(err.message, { variant: 'error' });
        }
    }

    async function deleteItem(id) {
        const itemRef = doc(db, "Items", id);
        try {
            await deleteDoc(itemRef);
            enqueueSnackbar("Item deleted successfully", { variant: 'success' });
            setItems(items.filter(item => item.id !== id)); 
        } catch (err) {
            enqueueSnackbar(err.message, { variant: 'error' });
        }
    }

    return (
        <div className="flex flex-col justify-center gap-4">
            <nav className="w-full bg-slate-800 p-4 text-white">
                <h1 className="text-center text-2xl font-bold">Welcome NNPC </h1>
            </nav>
            <br />
            <div className="flex justify-center ">
                <div className="bg-white p-4 w-80 h-80">
                    <h1 className="text-2xl font-bold text-center">Set your price</h1>
                    <br />
                    <form>
                        <input
                            type="text"
                            placeholder="Category"
                            value={category}
                            onChange={(e) => setcategory(e.target.value)}
                            className="w-full mb-3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                            type="text"
                            placeholder="Price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full mb-3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />

                        <form className="max-w-sm mx-auto mb-3">
                            <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-900">Status</label>
                            <select 
                                id="status" 
                                value={status}
                                onChange={(e) => setstatus(e.target.value)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            >
                                <option value="">Choose Status</option>
                                <option value="Available">Available</option>
                                <option value="Unavailable">Unavailable</option>
                            </select>
                        </form>

                        <button
                            onClick={addPrice}
                            className="w-full bg-green-500 p-2 text-white rounded-md focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium"
                        >
                            Set Price
                        </button>
                    </form>
                </div>
            </div>

            <EditModal Open={open} OnClose={() => setOpen(false)}>
                <div className='relative'>
                    <MdCancel className='absolute right-0 cursor-pointer' onClick={() => setOpen(false)} />
                    <h1 className='font-bold text-2xl text-center mb-4'>Update Category</h1>
                    <input
                        type="text"
                        placeholder='Category'
                        onChange={(e) => setcategoryNew(e.target.value)}
                        value={categoryNew}
                        className='mb-3 p-2 bg-gray-50 border border-gray-300 w-[100%]'
                    />
                    <input
                        type="text"
                        placeholder='Price'
                        onChange={(e) => setpriceNew(e.target.value)}
                        value={priceNew}
                        className='mb-3 p-2 bg-gray-50 border border-gray-300 w-[100%]'
                    />
                    <select
                        value={status}
                        onChange={(e) => setstatus(e.target.value)}
                        className="mb-3 p-2 bg-gray-50 border border-gray-300 w-full"
                    >
                        <option value="">Choose Status</option>
                        <option value="Available">Available</option>
                        <option value="Unavailable">Unavailable</option>
                    </select>

                    <button
                        className='bg-blue-500 rounded-md text-white w-full p-2'
                        onClick={updateItem}
                    >
                        Update
                    </button>
                </div>
            </EditModal>

            <div className="relative overflow-x-auto flex justify-center">
                {items.length > 0 && (
                    <table className="w-[50%] text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                            <tr>
                                <th className="px-6 py-3">Category</th>
                                <th className="px-6 py-3">Price</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Update</th>
                                <th className="px-6 py-3">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr className="bg-white" key={item.id}>
                                    <td className="px-6 py-4">{item.Category}</td>
                                    <td className="px-6 py-4">{item.Price}</td>
                                    <td className="px-6 py-4">{item.Status}</td>
                                    <td className="px-6 py-4">
                                        <button
                                            className="font-medium text-blue-600 hover:underline"
                                            onClick={() => openEdit(item.id, item.Category, item.Price, item.Status)}
                                        >
                                            Edit
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            className="font-medium text-red-600 hover:underline"
                                            onClick={() => deleteItem(item.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default StationPage;
