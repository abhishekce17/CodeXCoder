'use server'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { NextResponse } from "next/server";
import { cookies } from 'next/headers'
import { db } from "@/firebase-config/config";
import { sign } from 'jsonwebtoken';

export async function POST(req) {
    try {
        console.log("from signIn route");
        const auth = getAuth();
        const { email, password } = await req.json();
        const response = await signInWithEmailAndPassword(auth, email, password);
        const user = {
            uid: response.user.uid,
            email: response.user.email,
        };

        const token = sign(user, process.env.AUTH_SECRETE_KEY); // Replace 'your-secret-key' with your actual secret

        // Conditionally set 'secure' based on the environment
        const isSecure = process.env.NODE_ENV === 'production';

        cookies().set({
            name: 'authToken', // Corrected typo here
            value: token,
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path: '/',
            maxAge: 7 * 24 * 60 * 60
        });

        return NextResponse.json({ status: 200, token });
    } catch (error) {
        console.log(error.message);
        return NextResponse.json({ status: 401, error: "Email or Password is invalid" });
    }
}
