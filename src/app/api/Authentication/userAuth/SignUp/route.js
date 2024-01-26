// 'use server'
import {getAuth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, deleteUser} from "firebase/auth";
import {NextResponse} from "next/server";
import {db} from "@/firebase-config/config";
import {sign} from 'jsonwebtoken';
import {cookies} from "next/headers";
import {collection, doc, setDoc, writeBatch} from "firebase/firestore";

// const VERIFICATION_INTERVAL = 3000;
// const VERIFICATION_TIMEOUT = 60000;

export async function POST(req) {
    try {
        const auth = getAuth();
        const {email, password, name, agreedTermAndCondition} = await req.json();

        const batch = writeBatch(db);
        let response;
        response = await createUserWithEmailAndPassword(auth, email, password);
        const user = {
            uid: response.user.uid,
            email: response.user.email,
        };

        const userCollection = collection(db, "User", response.user.uid, "Information");
        const accountRef = doc(userCollection, "Account");
        const personalInfoRef = doc(userCollection, "Personal");

        // Email verification
        // let isEmailVerified = false;

        // await sendEmailVerification(response.user);

        // try {
        //     const verificationPromise = new Promise((resolve, reject) => {
        //         const verificationInterval = setInterval(async () => {
        //             console.log("Waiting for verification");
        // const verifiedUser = await signInWithEmailAndPassword(auth, email, password);

        // if (verifiedUser.user.emailVerified) {
        // isEmailVerified = true;
        // clearInterval(verificationInterval);
        // resolve();
        // }
        // }, VERIFICATION_INTERVAL);

        // setTimeout(() => {
        // clearInterval(verificationInterval);
        // resolve();
        // }, VERIFICATION_TIMEOUT);
        // });
        // await verificationPromise;
        // } catch (error) {
        // console.log(error)
        // }


        // if (isEmailVerified) {
        // User creation and data setup
        await setDoc(doc(db, "User", response.user.uid), {createdAt: response.user.metadata.creationTime});
        await setDoc(accountRef, {email, agreedTermAndCondition, emailVerify: true});
        await setDoc(personalInfoRef, {fullName: name, contact: {email, phoneNo: null}, address: {}, wishlist: []});

        // Batch commit and token creation
        await batch.commit()
            .then(() => {
                const token = sign(user, process.env.AUTH_SECRETE_KEY);
                const isSecure = process.env.NODE_ENV === 'production';

                // Set the token as an HttpOnly cookie
                cookies().set({
                    name: 'authToken',
                    value: token,
                    httpOnly: true,
                    secure: isSecure,
                    sameSite: 'strict',
                    path: '/',
                    maxAge: 7 * 24 * 60 * 60
                });
            })
            .catch(e => {
                console.log(e);
                return NextResponse.json({status: 500, error: "User creation failed"});
            });

        return NextResponse.json({status: 201});
        // } else {
        //     console.log(response.user)
        //     await deleteUser(response.user);
        //     return NextResponse.json({ status: 500, error: "Email not Verified" });
        // }
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({status: 500, error: "Something went wrong please try again leter"});
    }
}
