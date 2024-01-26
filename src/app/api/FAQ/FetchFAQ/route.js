import { NextResponse } from "next/server";
import { db } from "@/firebase-config/config";
import { collection, getDocs } from "firebase/firestore";

export const dynamic = "force-dynamic"
export async function GET() {
    try {
        const fetchData = [];

        const faqCollectionRef = collection(db, "FAQ");
        const querySnapshot = await getDocs(faqCollectionRef);
        const fetchPromises = new Promise((resolve, reject) => {
            try {
                querySnapshot.forEach((doc) => {
                    fetchData.push({ ...doc.data(), faqId: doc.id });
                });
                if (fetchData.length === querySnapshot.size) resolve()
            } catch (e) {
                reject(e)
            }
        })
        await fetchPromises
        return NextResponse.json({ data: fetchData, status: 200 });
    } catch (error) {
        console.error("Error fetching FAQs:", error);
        return NextResponse.json({ status: 500, error: "Error fetching FAQs" });
    }
}
