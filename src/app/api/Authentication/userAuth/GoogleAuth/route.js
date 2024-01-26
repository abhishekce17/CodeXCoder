'use server'
import { NextResponse } from "next/server";
import { cookies } from 'next/headers'
import { db } from "@/firebase-config/config";
import { sign } from 'jsonwebtoken';
import { collection, doc, getDoc, setDoc, writeBatch } from "firebase/firestore";

const setCookie = (uid, email) => {

    const user = {
        uid: uid,
        email: email,
    };
    const token = sign(user, process.env.AUTH_SECRETE_KEY);
    const isSecure = process.env.NODE_ENV === 'production';

    //         // Set the token as an HttpOnly cookie
    cookies().set({
        name: 'authToken',
        value: token,
        httpOnly: true,
        secure: isSecure,
        sameSite: 'strict',
        path: '/',
        maxAge: 7 * 24 * 60 * 60
    });
    return token
}

export async function POST(req) {
    try {
        const result = await req.json();
        const { userCredentials, creationTime } = result
        const batch = writeBatch(db)
        const userDocRef = doc(db, "User", userCredentials.uid);
        const userDoc = await getDoc(userDocRef);
        let token
        if (userCredentials.providerData.some((x) => x.providerId === "password")) {
            return NextResponse.json({ status: 409, error: "Email is alredy registered, please try to login" });
        }
        else if (userDoc.exists()) {
            token = await new Promise((resolve, reject) => resolve(setCookie(userCredentials.uid, userCredentials.email)))
            return NextResponse.json({ status: 200, token });
        }
        const userCollection = collection(db, "User", userCredentials.uid, "Information");
        const accountRef = doc(userCollection, "Account");
        const personalInfoRef = doc(userCollection, "Personal");

        // User creation and data setup
        await setDoc(doc(db, "User", userCredentials.uid), { createdAt: creationTime });
        await setDoc(accountRef, { email: userCredentials.email, agreedTermAndCondition: true, emailVerify: true });
        await setDoc(personalInfoRef, { fullName: userCredentials.displayName, contact: { email: userCredentials.email, phoneNo: null }, address: {}, wishlist: [] });

        // Batch commit and token creation
        await batch.commit()
            .then(() => {
                token = setCookie(userCredentials.uid, userCredentials.email)
            })
            .catch(e => {
                console.log(e);
                return NextResponse.json({ status: 500, error: "User creation failed" });
            });
        return NextResponse.json({ status: 200, token });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ status: 401, error: "Something went wrong please try again later" });
    }
}
