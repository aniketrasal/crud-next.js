"use client"

import FirebaseConfig from "../FirebaseConfig/FirebaseConfig";
import {ref, set, get, update, remove, child} from "firebase/database";
import { collection, getDocs } from 'firebase/firestore';
import { useState, useEffect } from "react";
import "./FirebaseCrud.css";
import "../../globals.css"

const database = FirebaseConfig();

function FirebaseCrud(){
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

    let SubmitData = () => {
        const dbref = ref(database);

        if (isNullOrWhiteSpace(id)) {
            alert("ID is required");
            return;
        }

        if (selectedUser) {
            // Update existing user data
            update(ref(database, `User/${selectedUser.id}`), {
                name: name,
                contact: contact,
                address: address,
            })
                .then(() => {
                    alert("User data updated successfully");
                    ShowData();
                    // Clear the form after updating data
                    setId("");
                    setName("");
                    setContact("");
                    setAddress("");
                    // Reset selectedUser to null
                    setSelectedUser(null);
                })
                .catch((error) => {
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
                            setId("");
                            setName("");
                            setContact("");
                            setAddress("");
                        })
                        .catch((error) => {
                            console.log(error);
                            alert("Error adding user data");
                        });
                }
            });
        }
    };
    
    let UpdateData = ()=>{
        const dbref = ref(database);
        if(isNullOrWhiteSpace(id)){
            alert("ID is empty, try to select a user first, with select button");
            return;
        }

        get(child(dbref, "User/" + id)).then(snapshot =>{
            if(snapshot.exists()){
                update(ref(database, "User/" + id), {
                    name: name,
                    contact: contact,
                    address: address
                })
                .then(()=>{
                    alert("User update successfully");
                    ShowData();
                })
                .catch(error => {
                    console.log(error)
                    alert("there was an error to updating the data")
                })
                
            }
            else{
                alert("User does not exist")
            }
        })
        .catch((error)=>{
            console.log(error);
            alert("error data retrieval was unsuccessful");
        })

        setId("");
        setName("");
        setContact("");
        setAddress("");
        // Reset selectedUser to null
        setSelectedUser(null);
    
    }

    let DeleteData = ()=>{
        const dbref = ref(database);

        get(child(dbref, "User/" + id)).then(snapshot =>{
            if(snapshot.exists()){
                remove(ref(database, "User/" + id))
                .then(()=>{
                    alert("User delete successfully");
                    ShowData();
                })
                .catch(error => {
                    console.log(error)
                    alert("there was an error to deleting the data")
                })
                
            }
            else{
                alert("User does not exist")
            }
        })
        .catch((error)=>{
            console.log(error);
            alert("error data retrieval was unsuccessful");
        })

        
    
    }

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
                alert("No data available");
            }
        });
    };


    return(
        <>
        <label className="block">Id</label>
        <input type="text" value={id} onChange={e=>{setId(e.target.value)}} className="block w-full border p-2 mb-2"/>
        <br/>
        <label>Name</label>
        <input type="text" value={name} onChange={e=>{setName(e.target.value)}}/>
        <br/>
        <label>Contact</label>
        <input type="number" value={contact} onChange={e=>{setContact(e.target.value)}}/>
        <br/>
        <label>Address</label>
        <input type="text" value={address} onChange={e=>{setAddress(e.target.value)}}/>
        <br/>
        <button onClick={SubmitData}>Submit</button>

        <table>
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
            </table>
        </>
    )
}

export default FirebaseCrud;