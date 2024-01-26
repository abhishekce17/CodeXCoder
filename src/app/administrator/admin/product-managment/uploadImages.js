// require("dotenv").config()

export default async function uploadImages(file) {
    try {
        const formData = new FormData();

        formData.append("file", file)
        formData.append("upload_preset", "img3q8gt")
        const response = await fetch(`https://api.cloudinary.com/v1_1/dnbfy78fe/upload`, {
            method: "POST",
            body: formData
        })
        const result = await response.json();
        return { status: 200, imgUrl: result.secure_url };
    } catch (error) {
        return { status: 500, error }
    }
}