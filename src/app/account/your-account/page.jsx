"use client"
import AccountSidebar from '@/Components/AccountSidebar';
import styles from "@/Styles/Account.module.css"
import UserAuthContext from '@/app/contextProvider';
import Link from 'next/link';
import _ from "lodash"
import {useState, useContext} from 'react';

const Page = () => {
    const context = useContext(UserAuthContext)
    const [userData, setUserData] = useState(context.userData.Personal)
    const [recentOrders, setRecentOrders] = useState([])
    console.log(userData)
    return (<>

        <h3>Personal Information</h3>
        <div className={styles.user_account}>
            <div className={styles.user_info}>
                <p><strong>Name:</strong> {userData.fullName} </p>
                <p><strong>Email:</strong> {userData.contact.email} </p>
                <p><strong>Phone:</strong> {userData.contact.phoneNo} </p>
                <p><strong>Address:</strong> {!_.isEmpty(userData.address) ? `${userData.address.house_no}, ${userData.address.area}, ${userData.address.landmark}, ${userData.address.city}, ${userData.address.pincode}, ${userData.address.state}` : ""}</p>
            </div>
        </div>
        {/* <h3>Recent Order</h3>
        <div className={styles.user_account} >
            <div className={styles.recent_order}>
                {recentOrders.length ? <table>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Product Name</th>
                            <th>Date</th>
                            <th>Total Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentOrders.map((order, index) => {
                            return (<tr key={index} >
                                <td><Link href={"#"} > #123456 </Link></td>
                                <td>Nothing Phone (2)</td>
                                <td>June 10, 2023</td>
                                <td>$99.99</td>
                            </tr>)
                        })}
                    </tbody>
                </table>
                    : <center>
                        <p style={{ fontSize: "20px" }} >No Recent Orders</p>
                    </center>
                }
            </div>
        </div> */}

    </>
    );
};

export default Page;
