"use client"
import styles from "@/Styles/AccountSetting.module.css"
import UserAuthContext from "@/app/contextProvider";
import {useContext, useState} from "react";
import toast, {Toaster} from 'react-hot-toast';

const Page = () => {
    const context = useContext(UserAuthContext)
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(context.userData.Personal);
    // const oldEmail = context.userData.Personal.contact.email

    // console.log(context.userData)

    const notify = (msg, status) => {
        toast[status](msg,
            {
                duration: 2500,
                iconTheme: {
                    primary: '#013d29',
                    secondary: '#fff',
                }
            });
    }

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        if (name.startsWith('address.') || name.startsWith('contact.')) {
            const objectField = name.split('.')[1];
            const objectKey = name.split(".")[0]
            setFormData({
                ...formData,
                [objectKey]: {
                    ...formData[objectKey],
                    [objectField]: value,
                },
            });
        } else {
            setFormData({...formData, [name]: value});
        }
    };
    const handleEditClick = () => {
        setIsEditing(true);
    };


    const handleChnagePassword = () => {

    }


    const handleSaveClick = async () => {
        const updateInfoResponse = await fetch("/api/UserInformation/UpdateInfo", {
            method: "PATCH",
            body: JSON.stringify(formData)
            // body: JSON.stringify({ formData, updateEmail: (oldEmail !== formData.contact.email) }) : in future
        })
        const updateInfoResult = await updateInfoResponse.json();
        if (updateInfoResult.status === 200) {
            context.setUserData((prev) => {return {...prev, formData}})
            // setFormData(updateInfoResult.updatedUserData)
            notify("Updated Succesfully", "success");
        }
        else {
            notify("Something went wrong please try again leter", "error")
        }
        setIsEditing(false);
    };

    return (
        <>
            <h3>Account Settings</h3>
            <div className={styles.account_settings_page}>
                <Toaster />
                <div className={styles.form}>
                    <div>
                        <label htmlFor="email">Email:
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="contact.email"
                            value={formData.contact.email}
                            // onChange={handleInputChange}
                            disabled
                        />
                    </div>
                    <div>
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>

                    <div>

                        <label htmlFor="phone">Phone Number:</label>
                        <input
                            type="text"
                            id="phone"
                            name="contact.phoneNo"
                            value={formData.contact.phoneNo}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />

                    </div>
                    <div>
                        <label htmlFor="address">Flat, House no., Building, Company, Apartment:</label>
                        <input
                            id="address"
                            name="address.house_no"
                            value={formData.address?.house_no}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                        <label htmlFor="address">Area, Street, Sector, Village:</label>
                        <input
                            id="address"
                            name="address.area"
                            value={formData.address?.area}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                        <label htmlFor="address">Landmark:</label>
                        <input
                            id="address"
                            name="address.landmark"
                            value={formData.address?.landmark}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                        <label htmlFor="address">City:</label>
                        <input
                            id="address"
                            name="address.city"
                            value={formData.address?.city}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                        <label htmlFor="address">State:</label>
                        <input
                            id="address"
                            name="address.state"
                            value={formData.address?.state}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                        <label htmlFor="address">pincode:</label>
                        <input
                            id="address"
                            name="address.pincode"
                            value={formData.address?.pincode}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>
                </div>
                <div style={{display: "flex", justifyContent: "space-between"}} >

                    {isEditing ? (
                        <button className={styles.action} onClick={handleSaveClick}>Save</button>
                    ) : (
                        <button className={styles.action} onClick={handleEditClick}>Edit</button>
                    )}
                    {/* <button className={styles.action} onClick={handleChnagePassword}>Change Password</button> */}
                </div>
            </div>
        </>
    );
};

export default Page;