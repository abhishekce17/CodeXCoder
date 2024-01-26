import { NextResponse } from "next/server";
import { db } from "@/firebase-config/config";
import { collection, addDoc } from "firebase/firestore";


export async function POST(req) {
    try {
        const { question, answer } = await req.json();
        const faqRef = collection(db, 'FAQ');
        const faqData = await addDoc(faqRef, { question, answer });
        return NextResponse.json({ status: 201, faqId: faqData.id });
    } catch (error) {
        return NextResponse.json({ status: 500, error: 'Error adding FAQ item', details: error.message });
    }
}
