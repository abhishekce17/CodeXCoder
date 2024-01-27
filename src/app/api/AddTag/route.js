import {NextResponse} from "next/server";
import {db} from "@/firebase-config/config";
import {collection, addDoc} from "firebase/firestore";

export async function POST(req) {
    const capitalizeString = str => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    try {
        const body = await req.json()

        const TagSnapShotRef = collection(db, "filterTags")
        await addDoc(TagSnapShotRef, body)

        return NextResponse.json({status: 200})
    } catch (e) {
        console.log('Error:', e);
        return NextResponse.json({status: 500, error: e});
    }
}

