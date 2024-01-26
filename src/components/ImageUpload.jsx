"use client"
import React, {useState, useRef, useEffect} from 'react';
import styles from "@/Styles/ImageUpload.module.css"
import {CiImageOn} from 'react-icons/ci';
import {RxCross1} from 'react-icons/rx';
import {MdOutlineCameraAlt} from "react-icons/md";
import Image from 'next/image';

const ImageUpload = () => {

    const fileInputRef = useRef(null);
    const [images, setImages] = useState([]);
    const [formData, setFormData] = useState([])

    const handleDrop = (event) => {
        event.preventDefault();
        const fileList = event.dataTransfer.files;
        const imageArray = Array.from(fileList).map((file) => URL.createObjectURL(file));
        setFormData((prevFormData) => [...prevFormData, ...fileList])
        setImages((prevImages) => [...prevImages, ...imageArray]);

    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleImageChange = async (event) => {
        const fileList = event.target.files;
        const imageArray = Array.from(fileList).map((file) => URL.createObjectURL(file));
        setFormData((prevFormData) => [...prevFormData, ...fileList])
        setImages((prevImages) => [...prevImages, ...imageArray]);
    };

    const handleRemoveImage = (index) => {
        const updatedImages = [...images];
        const updatedFormData = [...formData]
        updatedFormData.splice(index, 1);
        updatedImages.splice(index, 1);
        setFormData(updatedFormData);
        setImages(updatedImages);
        fileInputRef.current.value = ""
    };

    return (
        <section>
            <div>
                <div className={styles.imgUpload} >
                    <label>
                        <div
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            className={styles.image_drop_area}
                        >
                            <span> <CiImageOn style={{fontSize: "3rem"}} /></span>
                            Drag and Drop or click to add images
                            <input
                                name='images'
                                type="file"
                                accept='image/*'
                                multiple
                                ref={fileInputRef}
                                style={{display: 'none'}}
                                onChange={handleImageChange}
                            />
                        </div>
                    </label>
                    {/* <label>
                    <div>
                        <MdOutlineCameraAlt />
                        <input type="file" accept='image/*' name='image' />
                    </div>
                </label> */}
                </div>
                {images.length ? <div className={styles.image_preview} >
                    {images.map((image, index) => (
                        <div key={`image-${index}`}>
                            <Image width={200} height={200} src={image} alt={`Product ${index}`} className={styles.product_image} />

                            <button className={styles.remove_image} type="button" onClick={() => handleRemoveImage(index)}>
                                <RxCross1 className={styles.remove} />
                            </button>
                        </div>
                    ))}
                </div> : undefined}
                {
                    images.length ?
                        <center>
                            <button className={styles.submit} >Submit</button>
                        </center>
                        : undefined
                }
            </div>
        </section>
    )
}

export default ImageUpload