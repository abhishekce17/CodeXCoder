import { NextResponse } from "next/server";
import { db } from "@/firebase-config/config";
import { getDoc, doc } from "firebase/firestore";

export const dynamic = "force-dynamic"
export async function GET() {
    try {
        const faqRef = doc(db, 'Information', 'Company Details');
        const companyInfo = await getDoc(faqRef);
        return NextResponse.json({ status: 200, companyInfo: companyInfo.data() });
    } catch (error) {
        return NextResponse.json({ status: 500, error: 'Error while Fetching', details: error.message });
    }
}
