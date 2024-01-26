"use client"
import React, {useState, useRef, useEffect} from 'react';
import styles from "@/Styles/ProductsManagment.module.css"
import {RxCross1} from 'react-icons/rx';
import {CiImageOn} from 'react-icons/ci';
import Image from 'next/image';

const AdminProdcutActionPage = ({FetchedProductDetails, editMode, handleUpdateProduct, handleAddProduct, handleDeleteProduct, revenueDetails, categories}) => {
    const [productName, setProductName] = useState(FetchedProductDetails?.productName || '');
    const [price, setPrice] = useState(FetchedProductDetails?.price || '');
    const [discount, setDiscount] = useState(FetchedProductDetails?.discount || "");
    // const [netValue, setNetValue] = useState(FetchedProductDetails?.netValue || "");
    const [images, setImages] = useState(FetchedProductDetails?.imgURLs || []);
    const [brandName, setBrandName] = useState(FetchedProductDetails?.brandName || '');
    const [category, setCategory] = useState(FetchedProductDetails?.category || '');
    const [specifications, setSpecifications] = useState(FetchedProductDetails?.specifications || ['']);
    const [moreDetails, setMoreDetails] = useState(FetchedProductDetails?.moreDetails || '');
    const [variants, setVariants] = useState(FetchedProductDetails?.variants || []);
    const fileInputRef = useRef(null);
    const [variantPrice, setVariantPrice] = useState(FetchedProductDetails?.variantPrice || {})
    const [formData, setFormData] = useState([])
    const [tagList, setTagList] = useState(FetchedProductDetails?.allTags || []);
    const [filterTags, setFilterTags] = useState([]);
    // const [defaultVariants, setDefaultVariants] = useState(categories.filter(element => element.category === category).defaultVariants)

    const handleProductNameChange = (event) => {
        setProductName(event.target.value);
    };


    const handlePriceChange = (event) => {
        const numericValue = event.target.value.replace(/[^0-9]/g, ''); // Filter out non-numeric characters
        setPrice(numericValue);
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



    const handleSpecificationChange = (event, index) => {
        const updatedSpecifications = [...specifications];
        updatedSpecifications[index] = event.target.value;
        setSpecifications(updatedSpecifications);
    };

    const handleAddSpecification = () => {
        setSpecifications((prevSpecifications) => [...prevSpecifications, '']);
    };

    const handleRemoveSpecification = (index) => {
        const updatedSpecifications = [...specifications];
        updatedSpecifications.splice(index, 1);
        setSpecifications(updatedSpecifications);
    };

    const handleMoreDetailsChange = (event) => {
        setMoreDetails(event.target.value);
    };




    const handleTags = (e) => {
        const {value} = e.target;
        console.log(tagList)
        setTagList(prev => {
            if (prev.some(x => x === value)) {
                return prev.filter(x => x !== value);
            }
            return [...prev, value];
        });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formDataAPI = new FormData()
        formData.map((each) => {
            formDataAPI.append("file", each)
        })
        let updatedVariants = variants.map((variant, index) => {
            if (variantPrice[variant.title] != undefined) {
                let newVariant = Object.values(variant.type).map((eachValues, valueIndex) => {
                    return {...eachValues, discount: Number(discount[eachValues.variant]), price: Number(variantPrice[variant.title]?.[eachValues.variant])}
                })
                return {...variant, type: newVariant}
            }
            return variant
        })

        formDataAPI.append("body", JSON.stringify({
            productName: productName,
            brandName: brandName,
            description: moreDetails,
            category: category,
            price: Number(price),
            specifications: specifications,
            variants: updatedVariants,
            discount: Number(discount),
            imgURLs: FetchedProductDetails?.imgURLs || [],
            allTags: tagList,
            averageRating: FetchedProductDetails?.averageRating || 0
        }))
        // formDataAPI.append("categoryId", categories.filter(element => element.category === category)[0].categoryId)
        // if (typeof editMode === "undefined" && typeof handleUpdateProduct === "undefined" && typeof handleAddProduct === "function") {
        handleAddProduct(formDataAPI)
        // }
        // else {
        // console.log("Updating")
        // handleUpdateProduct(formDataAPI)
        // }
        // const res = await fetch("http://localhost:3000/api/add-products", {
        //     method: "POST",
        //     body: formDataAPI,
        // });
        // const result = await res.json()
        // if (result.status === 200) {
        //     router.replace("/administrator/admin/product-managment")
        // }
    };

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

    useEffect(() => {

    }, []);

    return (
        <div className={styles.add_product_page}>
            <form id="productInfo" className={styles.all_product_info} onSubmit={handleSubmit}>
                <div className={styles.group_1}>
                    <label className={styles.product_name}>
                        Product Name
                        <div>
                            <input required={true} disabled={editMode} type="text" value={productName} onChange={handleProductNameChange} placeholder='Product name (Not more than 50 characters)' maxLength={50} />
                        </div>
                    </label>
                    <div className={styles.subgroup1_3}>
                        <label className={styles.specification_label}>Specifications</label>
                        {specifications.map((specification, index) => (
                            <div key={`specification-${index}`} className={styles.specification_item}>
                                <input
                                    disabled={editMode}
                                    style={{marginRight: "10px"}}
                                    type="text"
                                    value={specification}
                                    onChange={(event) => handleSpecificationChange(event, index)}
                                />
                                {!editMode && <button style={{margin: '0'}} type="button" onClick={() => handleRemoveSpecification(index)}>
                                    <RxCross1 />
                                </button>}
                            </div>
                        ))}
                        {
                            !editMode &&
                            <button style={{margin: "0", width: "max-content"}} type="button" onClick={handleAddSpecification}>
                                Add Specification
                            </button>
                        }
                        <div>
                            <label className={styles.more_details}>
                                More Details
                                <div>
                                    <textarea disabled={editMode} value={moreDetails} onChange={handleMoreDetailsChange} rows={20} />
                                </div>
                            </label>
                        </div>

                    </div>
                </div>
                <div className={styles.group_2}>
                    Images
                    {/* <div  > */}
                    <div className={styles.image_preview} >
                        {images.map((image, index) => (
                            <div key={`image-${index}`}>
                                <Image width={200} height={200} src={image} alt={`Product ${index}`} className={styles.product_image} />

                                {!editMode && <button className={styles.remove_image} type="button" onClick={() => handleRemoveImage(index)}>
                                    <RxCross1 />
                                </button>}
                            </div>
                        ))}
                        {
                            !editMode &&
                            <label className={styles.product_images}>
                                <div
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    className={styles.image_drop_area}
                                >
                                    <CiImageOn style={{fontSize: "2.5rem"}} />
                                    Drag and Drop or click to add images
                                    <input
                                        accept='image/*'
                                        name='images'
                                        type="file"
                                        multiple
                                        ref={fileInputRef}
                                        style={{display: 'none'}}
                                        onChange={handleImageChange}
                                    />
                                </div>
                            </label>
                        }
                    </div>
                    {/* </div> */}
                    <div className={styles.subgroup1_2} >
                        <div>
                            <label className={styles.product_price}>
                                <p>Price (₹)</p>
                                <input disabled={editMode} type="text" value={price} onChange={handlePriceChange} inputMode="numeric" pattern="[0-9]*" />
                            </label>
                        </div>
                    </div>
                    <div className={styles.allTags} >
                        <p>Tags</p>
                        <div>
                            {filterTags.map((tag, index) => (
                                <div key={"tag" + index} className={styles.eachTag} >
                                    <input disabled={editMode} checked={tagList.some(x => x === tag)} onChange={handleTags} id={"tag" + index} type="checkbox" key={`brand-${index}`} value={tag} />
                                    <label htmlFor={"tag" + index} >{tag}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                    {typeof editMode === "boolean" && typeof handleUpdateProduct === "function" &&
                        <>
                            <button className={styles.add_product_button} type="submit" > {editMode ? "Edit Product" : "Save Product"}</button>
                            <button className={styles.add_product_button} style={{background: "#ff4545"}} onClick={handleDeleteProduct} type="button" > Delete Product </button>
                            {
                                renderRevenue(variantPrice)
                            }
                        </>
                    }
                    {typeof editMode === "undefined" && typeof handleUpdateProduct === "undefined" &&
                        <button className={styles.add_product_button} type="submit"> Add Product </button>
                    }
                </div>
            </form>
        </div>
    );
};

export default AdminProdcutActionPage;
