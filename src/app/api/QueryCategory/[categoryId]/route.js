import { NextResponse } from "next/server";
import { db } from "@/firebase-config/config";
import { doc, getDoc } from "firebase/firestore";

export const dynamic = "force-dynamic"
export async function GET(res, { params }) {
    try {
        const queryCategoryID = params.categoryId
        const categoryDocSnapshot = await getDoc(doc(db, "Administration", "Admin", "Category", queryCategoryID));

        if (!categoryDocSnapshot.exists()) {
            return NextResponse.json({ status: 404, error: "Order not found." });
        }

        // const orderData = { ...categoryDocSnapshot.data(), categoryId: categoryDocSnapshot.id };
        const orderData = { ...categoryDocSnapshot.data() };

        return NextResponse.json({ data: orderData, status: 200 });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ status: 500, error });
    }
}
