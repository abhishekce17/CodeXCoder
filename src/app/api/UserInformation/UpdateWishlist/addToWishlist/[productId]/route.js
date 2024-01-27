import { NextResponse } from "next/server";
import { db } from "@/firebase-config/config";
import { getDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
// import { getAuth, updateEmail as updateFirebaseEmail } from "firebase/auth";
export const dynamic = 'force-dynamic'
export async function GET(req, { params }) {
    try {
        const authToken = cookies().get("authToken")
        const userData = verify(authToken.value, process.env.AUTH_SECRETE_KEY);

        if (!userData) {
            return NextResponse.json({ status: 401 });
        }

        const userDocRef = doc(db, "User", userData.uid);
        const userExistance = await getDoc(userDocRef);

        if (!userExistance.exists()) {
            return NextResponse.json({ status: 401 });
        }
        const userInfoDocRef = doc(userDocRef, "Information", "Personal");
        const productId = params;

        await updateDoc(userInfoDocRef, { wishlist: arrayUnion(productId) });

        //Add logic to update email as well in future 

        return NextResponse.json({ status: 200 });
    } catch (e) {
        console.error('Error:', e);
        return NextResponse.json({ status: 500, error: e.message });
    }
}
