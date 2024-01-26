"use server"
import {NextResponse} from "next/server";
import {db} from "@/firebase-config/config";
import {collection, addDoc, doc, setDoc, getDoc, updateDoc} from "firebase/firestore";
const cloudinary = require('cloudinary');
import cloudinary_config from "@/cloudinary-config/config";
import {addToIndex} from "@/algolia";


export async function POST(req) {
    try {
        // let imgUrl = []
        const formData = await req.formData();
        const body = JSON.parse(formData.get("body"))
        // const imgFileArray = formData.getAll("file")
        // const urlPromise = new Promise((resolve, reject) => {
        //     imgFileArray.forEach(async (imgFile) => {
        //         const fileBuffer = await imgFile.arrayBuffer();
        //         const buffer = Buffer.from(fileBuffer);
        //         const stream = cloudinary.v2.uploader.upload_stream(
        //             { resource_type: 'auto', folder: 'E-Commerce' }, // Cloudinary options
        //             (error, result) => {
        //                 if (error) {
        //                     console.error('Error uploading image:', error);
        //                     NextResponse.json({ statu: 500, error })
        //                     return reject(error)
        //                 } else {
        //                     imgUrl.push(result.url)
        //                     if (imgFileArray.length === imgUrl.length) resolve()
        //                 }
        //             }
        //         ).end(Uint8Array.from(JSON.parse(JSON.stringify(buffer)).data));
        //     })
        // })
        // await urlPromise

        // instead of uploading imgae from server uisng buffer stream of file, i am using direct upload method i.e image file from client side

        body.imgURLs = JSON.parse(formData.get("imgUrls"));
        console.log(body.imgURLs)
        const addedProduct = await addDoc(collection(db, "Medicines"), body);

        let snapShot = {

            productId: addedProduct.id,
            productName: body.productName,
            productFirtsImgURL: body.imgURLs[0],
            price: body.price || "",
            allTags: body.allTags
        }
        const productSnapDetailsRef = collection(db, "ProductSnapDetails")
        const data = await addDoc(productSnapDetailsRef, snapShot)
        addToIndex(snapShot, data.id);
        return NextResponse.json({status: 200})
    } catch (e) {
        console.log('Error:', e);
        return NextResponse.json({status: 500, error: e});
    }
}


