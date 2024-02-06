"use client"

import FirebaseConfig from "../FirebaseConfig/FirebaseConfig";
import { ref, set, get, update, remove, child } from "firebase/database";
import { collection, getDocs } from 'firebase/firestore';
import { useState, useEffect } from "react";
import "./FirebaseCrud.css";
import "../../globals.css"
import Navbar from "./Navbar";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";

const database = FirebaseConfig();

function FirebaseCrud() {
    let [id, setId] = useState("");
    let [name, setName] = useState("");
    let [contact, setContact] = useState("");
    let [address, setAddress] = useState("");
    let [userData, setUserData] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);


    useEffect(() => {
        // Fetch data when the component mounts
        ShowData();
    }, []);

    let isNullOrWhiteSpace = value =>{
        value = value.toString();
        return (value == null || value.replaceAll(" ", "").length < 1);
    }
    // let AddData = ()=>{
    //     const dbref = ref(database);
    //     if(isNullOrWhiteSpace(name)
    //     || isNullOrWhiteSpace(id)
    //     || isNullOrWhiteSpace(contact)
    //     || isNullOrWhiteSpace(address)){
    //         alert("fill all the fields");
    //         return;
    //     }

    //     get(child(dbref, "User/" + name)).then(snapshot =>{
    //         if(snapshot.exists()){
    //             alert("User already exists, try a diffrent name")
    //         }
    //         else{
    //             set(ref(database, "User/" + name), {
    //                 id: id,
    //                 contact: contact,
    //                 address: address
    //             })
    //             .then(()=>{
    //                 alert("User added successfully");
    //                 ShowData()
    //             })
    //             .catch(error => {
    //                 console.log(error)
    //                 alert("there was an error to added the user data")
    //             })
    //         }
    //     })
    //     .catch((error)=>{
    //         console.log(error);
    //         alert("error data retrieval was unsuccessful");
    //     })

    //     // Clear the form after adding data
    //     setId("");
    //     setName("");
    //     setContact("");
    //     setAddress("");
    //     // Reset selectedUser to null
    //     setSelectedUser(null);


    // }

    let SubmitData = (e) => {
        e.preventDefault();
        const dbref = ref(database);
    
        if (isNullOrWhiteSpace(id)) {
            alert("ID is required");
            return;
        }
    
        if (selectedUser) {
             update(ref(database, `User/${selectedUser.id}`), {
                    name: name,
                    contact: contact,
                    address: address,
                })
                .then(() => {
                    alert("User data updated successfully");
                ShowData();
                // Clear the form after updating data
                // setId("");
                // setName("");
                // setContact("");
                // setAddress("");
                // Reset selectedUser to null
                setSelectedUser(null);
                alert("data clear")

                })
                .catch ((error)=> {
                console.log(error);
                alert("Error updating user data");
            });
        } else {
            // Add new user data
            if (
                isNullOrWhiteSpace(name)||
                // isNullOrWhiteSpace(id) ||
                isNullOrWhiteSpace(contact) ||
                isNullOrWhiteSpace(address)
            ) {
                alert("Fill all the fields");
                return;
            }

            get(child(dbref, `User/${id}`)).then((snapshot) => {
                if (snapshot.exists()) {
                    alert("ID already exists, try a different name");
                } else {
                    set(ref(database, `User/${id}`), {
                        name: name,
                        contact: contact,
                        address: address,
                    })
                        .then(() => {
                            alert("User added successfully");
                            ShowData();
                            // Clear the form after adding data
                            // setId("");
                            // setName("");
                            // setContact("");
                            // setAddress("");
                        })
                        .catch((error) => {
                            console.log(error);
                            alert("Error adding user data");
                        })
                        .finally((msg)=>{
                            console.log("msg", msg)
                        })
                }
            });
        }
    };
    

    let DeleteData = async (userId) => {
        const dbref = ref(database);
    
        try {
            const snapshot = await get(child(dbref, `User/${userId}`));
            if (snapshot.exists()) {
                await remove(ref(database, `User/${userId}`));
                alert("User deleted successfully");
                ShowData();
            } else {
                alert("User does not exist");
            }
        } catch (error) {
            console.log(error);
            alert("Error deleting user data");
        }
    };
    
    // let ShowData = () => {
    //     const dbref = ref(database);
    //     const userArray = [];

    //     get(child(dbref, "User")).then(snapshot => {
    //         if (snapshot.exists()) {
    //             snapshot.forEach(userSnapshot => {
    //                 const user = userSnapshot.val();
    //                 userArray.push({
    //                     id: user.id,
    //                     name: userSnapshot.key, // Using the key as the name
    //                     contact: user.contact,
    //                     address: user.address
    //                 });
    //             });

    //             setUserData(userArray);
    //         } else {
    //             alert("No data available");
    //         }
    //     });
    // };

    let ShowData = () => {
        const dbref = ref(database);
        const userArray = [];

        get(child(dbref, "User")).then(snapshot => {
            if (snapshot.exists()) {
                snapshot.forEach(userSnapshot => {
                    const user = userSnapshot.val();
                    userArray.push({
                        id: userSnapshot.key,
                        // name: userSnapshot.key, // Using the key as the name
                        name: user.name,
                        contact: user.contact,
                        address: user.address
                    });
                });

                setUserData(userArray);
            } else {
                setUserData([]);
                // alert("No data available");
            }
        });
    };


    return (
        <>
            <div className="flex flex-col justify-evenly gap-5 w-full border border-gray-200 p-5 lg:flex-row-reverse lg:justify-evenly lg:p-0">

                <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
                    <form className="max-w-sm mx-auto">
                        <h5 className="text-xl font-medium text-gray-900 dark:text-white">Pric Application Form</h5>
                        <br />
                        <div className="mb-5">
                            <label htmlFor="id" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ID<span className="text-red-500">*</span></label>
                            <input type="text" value={id} onChange={e => { setId(e.target.value) }} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="ID should be unique" required />
                        </div>
                        <div className="mb-5">
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Full Name<span className="text-red-500">*</span></label>
                            <input type="text" value={name} onChange={e => { setName(e.target.value) }} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="Enter your full name" required />
                        </div>
                        <div className="mb-5">
                            <label htmlFor="contact" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contact<span className="text-red-500">*</span></label>
                            <input type="number" value={contact} onChange={e => { setContact(e.target.value) }} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="Enter your contact number" required />
                        </div>
                        <div className="mb-5">
                            <label htmlFor="contact" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Address<span className="text-red-500">*</span></label>
                            <input type="text" value={address} onChange={e => { setAddress(e.target.value) }} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="Enter your address" required />
                        </div>
                        {/* <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button> */}
                        <button onClick={SubmitData} className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                    </form>
                </div>


                {/* <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Contact</th>
                        <th>Address</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {userData.map((user) => (
                        <tr key={user.name}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.contact}</td>
                            <td>{user.address}</td>
                            <td>
                                <button
                                    onClick={() => {
                                        // Set the selected user for update
                                        setSelectedUser(user);
                                        setId(user.id);
                                        setName(user.name);
                                        setContact(user.contact);
                                        setAddress(user.address);
                                    }}
                                // onClick={UpdateData}
                                >
                                    Update
                                </button>
                                <button
                                    onClick={() => {
                                        // Delete the user
                                        DeleteData(user.name);
                                    }}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table> */}



                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    ID
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Contact
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Address
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {userData.map((user) => (
                                <tr key={user.name} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {user.id}
                                    </th>
                                    <td className="px-6 py-4">
                                        {user.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.contact}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.address}
                                    </td>
                                    <td className="px-6 py-4">
                                        {/* <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                                <a href="#" className="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</a> */}
                                    <div className="flex gap-5">
                                        <button
                                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                            onClick={() => {
                                                // Set the selected user for update
                                                setSelectedUser(user);
                                                setId(user.id);
                                                setName(user.name);
                                                setContact(user.contact);
                                                setAddress(user.address);
                                            }}
                                        // onClick={UpdateData}
                                        >
                                            <FaEdit size={20}/>
                                        </button>
                                        <button
                                            className="font-medium text-red-600 dark:text-red-500 hover:underline"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                // Delete the user
                                                DeleteData(user.id);
                                            }}
                                        >
                                            <RiDeleteBin6Line size={20} />
                                        </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Responsive styles for tablet screens (width less than 768px) */}
                <div className="lg:hidden">
                    <div className="flex flex-col-reverse justify-evenly w-full">
                        {/* Additional JSX content for tablet screens */}
                    </div>
                </div>



                {/* Responsive styles for mobile screens (width less than 480px) */}
                <div className="xl:hidden">
                    <div className="flex flex-row-reverse justify-evenly w-full">
                        {/* Additional JSX content for mobile screens */}
                    </div>
                </div>

            </div>

        </>
    )
}

export default FirebaseCrud;