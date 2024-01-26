"use client"
import {useEffect, useState} from 'react';
import {notFound} from 'next/navigation';
import Loading from '../../../loading';
import AdminProdcutActionPage from '@/Components/AdminProductAction';
import uploadImages from '../../uploadImages';
import {notify} from '@/JS/notify';

const Page = ({params}) => {

    function extractValues(value, variant) {
        const extractedValues = {};
        for (const item of variant) {
            for (const variantType of item.type) {
                const variantName = variantType.variant;
                const titleValue = variantType[value];
                if (titleValue !== undefined) {
                    if (value !== 'price') {
                        extractedValues[variantName] = titleValue;
                    } else {
                        extractedValues[item.title] = {...extractedValues[item.title], [variantName]: titleValue};
                    }
                }
            }
        }
        return extractedValues;
    }

    const [revenueDetails, setRevenueDetails] = useState(null);
    const [editMode, setEditMode] = useState(true);
    const [productDetails, setProductDetails] = useState(null);
    const [categories, setCategories] = useState(null);

    const {product_Id} = params;

    async function updateProduct(formDataAPI) {
        if (!editMode) {
            const imgArray = formDataAPI.getAll("file");
            const imgUrlArray = []
            const imgUploadPromise = new Promise((resolve, reject) => {
                console.log("stuck in promise")
                if (imgArray.length === 0) resolve();
                imgArray.forEach((file) => {
                    const result = uploadImages(file);
                    result.then((value) => {
                        if (value.status === 500) reject();
                        imgUrlArray.push(value.imgUrl)
                        if (imgUrlArray.length === imgArray.length) resolve()
                    })
                })
            })
            await imgUploadPromise;
            console.log("outside the promise")
            formDataAPI.append("imgUrls", JSON.stringify(imgUrlArray));
            formDataAPI.append('productId', product_Id);
            const res = await fetch(`/api/update-products`, {
                method: 'POST',
                body: formDataAPI,
            });
            const result = await res.json();
            if (result.status === 200) {
                notify("Product updated", "success");
                // router.replace(`/administrator/admin/product-managment/product-details/${product_Id}`);
            }
        }
    }

    const handleUpdateProduct = (formDataAPI) => {
        if (!productDetails?.dealProduct) {
            setEditMode(!editMode);
            updateProduct(formDataAPI);
        } else {
            notify("Please Remove the Product from deals page before updating", "error");
        }
    };

    const handleDeleteProduct = async () => {

    };


    useEffect(() => {
        async function fetchRevenueDetails() {
            const res = await fetch(`/api/FetchRevenue/${product_Id}`);
            const result = await res.json();
            if (result.status === 200) {
                setRevenueDetails(result.data[0]);
            }
        }

        async function fetchDetails() {
            const res = await fetch(`/api/product-details/${product_Id}`, {
                method: 'GET',
            });
            const result = await res.json();
            if (result.status === 200) {
                const extractedValues = extractValues('discount', result.data.variants);
                setProductDetails({
                    dealProduct: result.data.dealProduct,
                    productName: result.data.productName,
                    brandName: result.data.brandName,
                    moreDetails: result.data.description,
                    category: result.data.category,
                    price: result.data.price,
                    specifications: result.data.specifications,
                    variants: result.data.variants,
                    discount: result.data.discount || extractedValues,
                    imgURLs: result.data.imgURLs,
                    variantPrice: result.data.netPrice === undefined && extractValues('price', result.data.variants),
                    averageRating: result.data.averageRating,
                    allTags: result.data.allTags
                });
            } else if (result.status === 404) {
                setProductDetails(404);
            }
            // else if (result.status === 500) {
            //     //server error page
            // }
        }

        async function fetchCategories() {
            const response = await fetch('/api/AdminCategories/FetchCategories');
            const resultData = await response.json();
            setCategories(resultData.data);
        }
        fetchDetails();
        fetchRevenueDetails();
        fetchCategories();
    }, [product_Id]);

    return (
        <>
            {productDetails !== null && revenueDetails !== null && categories !== null ? (
                <>
                    {productDetails === 404 ? (
                        notFound()
                    ) : (
                        <div>
                            <AdminProdcutActionPage
                                FetchedProductDetails={productDetails}
                                editMode={editMode}
                                setEditMode={setEditMode}
                                handleUpdateProduct={handleUpdateProduct}
                                handleDeleteProduct={handleDeleteProduct}
                                productId={product_Id}
                                revenueDetails={revenueDetails}
                                categories={categories}
                            />
                        </div>
                    )}
                </>
            ) : (
                Loading()
            )}
        </>
    );
};

export default Page;
