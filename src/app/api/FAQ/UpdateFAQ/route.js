import { NextResponse } from "next/server";
import { db } from "@/firebase-config/config";
import { doc, updateDoc } from "firebase/firestore";


export async function POST(req) {
    try {
        const { question, answer, faqId } = await req.json();
        const faqRef = doc(db, 'FAQ', faqId);
        await updateDoc(faqRef, { question, answer });
        return NextResponse.json({ status: 200 });
    } catch (error) {
        return NextResponse.json({ status: 500, error: 'Error adding FAQ item', details: error.message });
    }
}
