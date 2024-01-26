import { NextResponse } from "next/server";
import { db } from "@/firebase-config/config";
import { addDoc, doc, setDoc } from "firebase/firestore";


export async function POST(req) {
    try {
        const { companyInfo } = await req.json();
        const faqRef = doc(db, 'Information', 'Company Details');
        await setDoc(faqRef, companyInfo);
        return NextResponse.json({ status: 201 });
    } catch (error) {
        return NextResponse.json({ status: 500, error: 'Error adding information', details: error.message });
    }
}
