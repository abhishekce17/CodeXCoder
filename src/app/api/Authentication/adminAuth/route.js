import {getAuth, signInWithEmailAndPassword} from "firebase/auth";
import {db} from "@/firebase-config/config";
import {NextResponse} from "next/server";

const auth = getAuth();
export async function POST(req, {params}) {
    try {
        const {email, password} = await req.json();
        const user = await signInWithEmailAndPassword(auth, email, password);
        return NextResponse.json({status: 201, user});
    } catch (error) {
        return NextResponse.json({status: 500, message: error.message});
    }
}
