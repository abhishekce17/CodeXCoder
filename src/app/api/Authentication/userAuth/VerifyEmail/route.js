// 'use server'
import { sendEmailVerification } from "firebase/auth";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const auth = getAuth();
        const { email, password } = await req.json();
        const response = await signInWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(response.user)
        return NextResponse.json({ status: 200, user: response.user });
    } catch (error) {
        console.log(error.message);
        return NextResponse.json({ status: 401, error: "Email or Password is invalid" });
    }
}
