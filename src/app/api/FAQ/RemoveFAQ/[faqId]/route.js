import { NextResponse } from "next/server";
import { db } from "@/firebase-config/config";
import { doc, deleteDoc } from "firebase/firestore";

export async function DELETE(req, { params }) {
    try {
        const { faqId } = params;
        const featuredProductDocRef = doc(db, "FAQ", faqId);
        await deleteDoc(featuredProductDocRef);
        return NextResponse.json({ status: 200, message: "Featured product deleted." });
    } catch (e) {
        console.log('Error:', e);
        return NextResponse.json({ status: 500, error: e });
    }
}
