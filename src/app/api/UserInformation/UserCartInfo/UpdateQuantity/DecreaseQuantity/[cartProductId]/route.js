import { NextResponse } from "next/server";
import { db } from "@/firebase-config/config";
import {
    getDoc,
    doc,
    updateDoc, increment
} from "firebase/firestore";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import { useRouter } from "next/navigation";

export async function GET(req, { params }) {
    try {
        const authToken = cookies().get("authToken");

        if (!authToken) {
            return NextResponse.json({ status: 401 });
        }
        const { cartProductId } = params;
        console.log(cartProductId);
        const userData = verify(authToken.value, process.env.AUTH_SECRETE_KEY);
        if (!userData) {
            return NextResponse.json({ status: 401 });
        }

        const userDoc = doc(db, "User", userData.uid);
        const userExistance = await getDoc(userDoc);

        if (!userExistance.exists()) {
            return NextResponse.json({ status: 401 });
        }

        const cartInfoSnap = await getDoc(
            doc(
                db,
                "User",
                userData.uid,
                "Information",
                "InterestedProducts",
                "Cart",
                cartProductId
            )
        );
        if (cartInfoSnap.exists()) {
            await updateDoc(cartInfoSnap.ref, { quantity: increment(-1) })
        }
        return NextResponse.json({ status: 200 });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" });
    }
}
