import { NextResponse } from "next/server";
import { db } from "@/firebase-config/config";
import {
    getDoc,
    doc,
    collection,
    getDocs,
    query,
    where,
} from "firebase/firestore";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import _ from "lodash"

export const dynamic = 'force-dynamic'
const getPrice = (variants, selectedVariant) => {
    const variant = selectedVariant.variant
    const otp = variants.filter((ele) => {
        for (const key in variant) {
            if (key === ele.title && ele.type.some((x) => "price" in x)) {
                return true;
            }
        }
        return false;
    });
    return otp[0]?.type.filter(x => x.variant === variant[otp[0].title])[0]
};


export async function GET(req) {
    try {
        const authToken = cookies().get("authToken");

        if (!authToken) {
            return NextResponse.json({ status: 401 });
        }

        const userData = verify(authToken.value, process.env.AUTH_SECRETE_KEY);
        if (!userData) {
            return NextResponse.json({ status: 401 });
        }

        const userDoc = doc(db, "User", userData.uid);
        const userExistance = await getDoc(userDoc);

        if (!userExistance.exists()) {
            return NextResponse.json({ status: 401 });
        }

        const cartInfoSnap = await getDocs(
            collection(
                db,
                "User",
                userData.uid,
                "Information",
                "InterestedProducts",
                "Cart"
            )
        );

        const cart = await Promise.all(
            cartInfoSnap.docs.map(async (doc) => {
                const querySnapshot = query(
                    collection(db, "ProductSnapDetails"),
                    where("productId", "==", doc.data().productId)
                );

                const productData = await getDocs(querySnapshot);
                return productData.docs.map((data) => {
                    let Obj;
                    if (!_.isEmpty(doc.data().variant)) {
                        Obj = getPrice(data.data().variants, doc.data())
                    }
                    return { ...data.data(), subInfo: Obj, selectedVariant: doc.data(), cartProductId: doc.id }
                });
            })
        );

        return NextResponse.json({ status: 200, Cart: cart.flat() });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" });
    }
}
