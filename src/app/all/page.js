"use client"

import FirebaseConfig from "../Components/FirebaseConfig/FirebaseConfig";
import { ref, set, get, update, remove, child } from "firebase/database";
import { collection, getDocs } from 'firebase/firestore';
import { useState, useEffect } from "react";
import "../../app/globals.css"
import Navbar from "../Components/FirebaseCrud/Navbar";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TailSpin } from 'react-loader-spinner';

const database = FirebaseConfig();

function FirebaseCrud() {
    // let [id, setId] = useState("");
    let [name, setName] = useState("");
    let [contact, setContact] = useState("");
    let [address, setAddress] = useState("");
    let [userData, setUserData] = useState([]);
    let [bio, setBio] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [alertt, setAlert] = useState(false);
    


    useEffect(() => {
        // Fetch data when the component mounts
        ShowData();
    }, []);

    let isNullOrWhiteSpace = value => {
        value = value.toString();
        return (value == null || value.replaceAll(" ", "").length < 1);
    }

    let SubmitData = (e) => {
        e.preventDefault();
        const dbref = ref(database);

        // if (isNullOrWhiteSpace(id)) {
        //     alert("ID is required");
        //     return;
        // }

       

        if (selectedUser) {

            if (
                selectedUser.name === name &&
                selectedUser.contact === contact &&
                selectedUser.address === address &&
                selectedUser.bio === bio
            ) {
                // alert("Data is the same, please update the data.");
                setAlert(true)
                return;
            }

            update(ref(database, `User/${selectedUser.name}`), {
                name: name,
                contact: contact,
                address: address,
                bio: bio,
            })
                .then(() => {
                    alert("User data updated successfully");
                    ShowData();
                    // Clear the form after updating data
                    // setId("");
                    setName("");
                    setContact("");
                    setAddress("");
                    setBio("");
                    // Reset selectedUser to null
                    setSelectedUser(null);
                    setAlert(false)

                })
                .catch((error) => {
                    console.log(error);
                    alert("Error updating user data");
                });
        } else {
            // Add new user data
            if (
                isNullOrWhiteSpace(name) ||
                // isNullOrWhiteSpace(id) ||
                isNullOrWhiteSpace(contact) ||
                isNullOrWhiteSpace(address)
            ) {
                alert("Fill all the fields");
                return;
            }
            if (
                contact.length !== 10) {
                alert("Contact number should be 10 digits");
                return
            }
            // Check for bio
            const userData = {
                name: name,
                contact: contact,
                address: address,
                bio: bio,
            };

            // Add bio to userData if it is not empty
            if (!isNullOrWhiteSpace(bio)) {
                userData.bio = bio;
            }

            get(child(dbref, `User/${name}`)).then((snapshot) => {
                if (snapshot.exists()) {
                    // alert("ID already exists, try a different name");
                } else {
                    set(ref(database, `User/${name}`), {
                        name: name,
                        contact: contact,
                        address: address,
                        bio: bio,
                    })
                        .then(() => {
                            alert("User added successfully");
                            ShowData();
                            // Clear the form after adding data
                            // setId("");
                            setName("");
                            setContact("");
                            setAddress("");
                            setBio("");
                            setAlert(false)
                        })
                        .catch((error) => {
                            console.log(error);
                            alert("Error adding user data");
                        })
                        .finally((msg) => {
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
                alert("User deleted successfully from Backend");
                ShowData();
            } else {
                alert("User does not exist");
            }
        } catch (error) {
            console.log(error);
            alert("Error deleting user data");
        }

    };

    
  
    
    

    let ShowData = () => {
      setLoading(true);
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
                      address: user.address,
                      bio: user.bio,
                  });
              });

              setUserData(userArray);
              setAlert(false)
          } else {
              setLoading(false);
              setUserData([]);
              setAlert(false)

              // alert("No data available");
          }
      }).finally(() => {
          setLoading(false); // Set loading to false after data operation
          setAlert(false)
      });
  };



    return (
        <>
        <h4 class="text-2xl font-extrabold dark:text-white flex items-center justify-center mb-10 mt-5">All data from Firestore Backend</h4>
            <div className="flex flex-col justify-evenly gap-5 w-full p-5 lg:flex-row-reverse lg:justify-evenly lg:p-0">
                <div className="relative overflow-x-auto  sm:rounded-lg">
                    {loading ? (
                        <div >
                            <div class="flex items-center justify-center w-56 h-56 mt-24 ">
                                <div role="status">
                                    <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>
                                    <span class="sr-only">Loading...</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <table className="w-full text-sm text-left rtl:text-right text-gray-900 dark:text-gray-400 shadow-md">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900 dark:text-gray-400 shadow-md ">
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
                                    </th >
                                    <th scope="col" className="px-6 py-3">
                                        Bio
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Delete from Backend
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {userData.map((user, index) => (
                                    <tr key={user.name} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 shadow-md">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {index + 1}
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
                                            {user.bio ? user.bio : "User not added bio"}
                                        </td>
                                        <td className="px-6 py-4">
                                            {/* <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                                <a href="#" className="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</a> */}
                                            <div className="flex items-center justify-center ">
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
                    )}

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

