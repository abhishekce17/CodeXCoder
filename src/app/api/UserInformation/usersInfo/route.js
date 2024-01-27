import { NextResponse } from "next/server";
import { db } from "@/firebase-config/config";
import { getDoc, doc, collection, getDocs, writeBatch } from "firebase/firestore";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";

export const dynamic = 'force-dynamic'
export async function GET(req) {
    try {
        // console.log("from userInfo route");
        const authToken = cookies().get("authToken")
        // console.log(authToken)
        if (authToken !== undefined) {
            const userData = verify(authToken.value, process.env.AUTH_SECRETE_KEY);
            if (userData) {
                const userExistance = await getDoc(doc(db, "User", userData.uid))
                if (userExistance.exists()) {
                    let fetchedUserData = {}
                    let cart = [];
                    let OrderDetails = [];
                    const batch = writeBatch(db)
                    const userInfoSnap = await getDocs(collection(db, "User", userData.uid, "Information"))
                    const fetchPromise = new Promise((resolve, reject) => {
                        userInfoSnap.forEach(doc => { fetchedUserData = { ...fetchedUserData, [doc.id]: doc.data() } })
                        if (userInfoSnap.size === Object.keys(fetchedUserData).length) resolve();
                    })
                    const cartInfoSnap = await getDocs(collection(db, "User", userData.uid, "Information", "InterestedProducts", "Cart"))
                    const CartPromise = new Promise((resolve, reject) => {
                        cartInfoSnap.forEach(doc => cart.push(doc.data()))
                        if (cartInfoSnap.size === cart.length) resolve();
                    })
                    const orderInfoSnap = await getDocs(collection(db, "User", userData.uid, "Information", "OrderDetails", "OrderedProducts"))
                    const orderPromise = new Promise((resolve, reject) => {
                        orderInfoSnap.forEach(doc => OrderDetails.push(doc.data()))
                        if (orderInfoSnap.size === OrderDetails.length) resolve();
                    })

                    await fetchPromise;
                    await CartPromise;
                    await orderPromise

                    batch.commit()
                    return NextResponse.json({ status: 200, userData: { ...fetchedUserData, Cart: cart, OrderDetails } })
                }
            }
        }
        return NextResponse.json({ status: 401 })
    } catch (e) {
        console.log('Error:', e);
        return NextResponse.json({ error: e });
    }
}
