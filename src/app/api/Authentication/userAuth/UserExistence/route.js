// 'use server'
import { fetchSignInMethodsForEmail, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { NextResponse } from "next/server";
import { db } from "@/firebase-config/config";
import { doc, getDoc } from "firebase/firestore";
export async function POST(req) {
    try {
        const { email, password } = await req.json()
        const auth = getAuth()
        try {
            const existingUser = await signInWithEmailAndPassword(auth, email, password);
            const userDoc = await getDoc(doc(db, "User", existingUser.user.uid))
            if (!userDoc.exists()) {
                return NextResponse.json({ status: 429 });
            }
        } catch (error) {
            console.log(error)
            if (error.code === 'auth/invalid-email' || error.code === 'auth/wrong-password') {
                return NextResponse.json({ status: 200 })
            } else if (error.code === 'auth/user-not-found') {
                return NextResponse.json({ status: 401 })
            }
        }
        return NextResponse.json({ status: 200 });
    } catch (error) {
        console.log(error.message);
        return NextResponse.json({ status: 500, error: "Something went wrong please try again leter" });
    }
}
