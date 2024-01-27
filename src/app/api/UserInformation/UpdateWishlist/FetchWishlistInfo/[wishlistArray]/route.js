import { NextResponse } from "next/server";
import { db } from "@/firebase-config/config";
import {
    getDoc,
    doc,
    collection,
    getDocs,
    query,
    where,
} from "firebase/firestore";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import _ from "lodash"

export const dynamic = 'force-dynamic'

export async function GET(req, { params }) {
    try {
        const authToken = cookies().get("authToken");

        if (!authToken) {
            return NextResponse.json({ status: 401 });
        }

        const userData = verify(authToken.value, process.env.AUTH_SECRETE_KEY);
        if (!userData) {
            return NextResponse.json({ status: 401 });
        }

        const userDoc = doc(db, "User", userData.uid);
        const userExistance = await getDoc(userDoc);

        if (!userExistance.exists()) {
            return NextResponse.json({ status: 401 });
        }

        const wishlistArray = JSON.parse(decodeURIComponent(params.wishlistArray))
        const wishlistProducts = await Promise.all(
            wishlistArray.map(async (doc) => {
                const querySnapshot = query(
                    collection(db, "ProductSnapDetails"),
                    where("productId", "==", doc.productId)
                );

                const productData = await getDocs(querySnapshot);
                return { ...productData.docs.map(x => x.data())[0] }
            })
        );

        return NextResponse.json({ status: 200, wishlistProducts: wishlistProducts.flat() });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" });
    }
}
