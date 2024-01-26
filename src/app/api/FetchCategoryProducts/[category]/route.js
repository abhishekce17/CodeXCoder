import { NextResponse } from "next/server";
import { db } from "@/firebase-config/config";
import { collection, getDocs, query, where } from "firebase/firestore";

export const dynamic = "force-dynamic";

export async function GET(req, { params }) {
    try {
        const { category } = params;

        const [fetchSnapshot, categoryInfoSnapshot] = await Promise.all([
            getDocs(query(collection(db, "ProductSnapDetails"), where("category", "==", category))),
            getDocs(query(collection(db, "/Administration/Admin/Category"), where("category", "==", category)))
        ]);

        const fetchData = fetchSnapshot.docs.map(doc => doc.data());
        const categoryInfo = categoryInfoSnapshot.docs.map(doc => doc.data());
        console.log("From fetch category product route");
        return NextResponse.json({ data: fetchData, categoryInfo, status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ status: 500, error });
    }
}
