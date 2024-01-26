"use client"
import styles from "@/Styles/productsLayout.module.css"
import Link from "next/link"
import Image from "next/image"
import {AiFillHeart, AiOutlineHeart} from "react-icons/ai"
import FilterComponent from "@/Components/FilterComponent"
import {useContext, useEffect, useMemo, useState} from "react"
import Loading from "@/app/loading"
import UserAuthContext from "@/app/contextProvider"



const Page = ({params}) => {
    const ctgry = decodeURIComponent(params.ctgry)
    const [medicineProducts, setMedicineProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [categoryInfo, setCategoryInfo] = useState([])
    const context = useContext(UserAuthContext)
    const [filterByBrand, setFilterByBrand] = useState([]);
    const [filterByTags, setFilterByTags] = useState([]);


    const fetchFeaturedProducts = useMemo(async () => {
        const response = await fetch(`/api/all-products`);
        const result = await response.json();
        if (result.status === 200) {
            setCategoryInfo(result.categoryInfo);
            if (filterByBrand.length) {
                const brandNamesSet = new Set(filterByBrand);
                const filteredProducts = result.data.filter(product =>
                    brandNamesSet.has(product.brandName)
                );
                setMedicineProducts(filteredProducts);
            }
            else if (filterByTags.length) {
                const TagNamesSet = new Set(filterByTags);
                const filteredProducts = result.data.filter(product =>
                    product.allTags?.some(tag => TagNamesSet.has(tag))
                );
                setMedicineProducts(filteredProducts);
            }
            else {
                setMedicineProducts(result.data);
            }
            setIsLoading(false)
        } else {
            alert("Something went wrong please try again later");
            setIsLoading(false)
        }
    }, [ctgry, filterByBrand, filterByTags]);

    useEffect(() => {
    }, [fetchFeaturedProducts]);

    return (
        <div className={styles.layout} >
            {
                isLoading ? Loading() :
                    <div className={styles.layout_container} data-listing="true" >
                        <FilterComponent setFilterByTags={setFilterByTags} category={ctgry} categoryInfo={categoryInfo[0]} setFilterByBrand={setFilterByBrand} />
                        <div>
                            {medicineProducts.map((value, index) => {
                                return (
                                    <div key={index} className={styles.each_product_card} >
                                        <Link href={{pathname: `/medicine/${value.productId}`, query: {...extractMinimumNetValue(value.variants)?.obj || ""}}}  >
                                            <Image width={500} height={500} src={value.productFirtsImgURL} alt={value.productFirtsImgURL} />
                                            <div>
                                                <p>{value.productName}</p>
                                            </div>
                                            <div><p>From   &#8377;{value.price}</p> </div>
                                        </Link>
                                    </div>
                                )
                            })}
                        </div>

                    </div>
            }
        </div>
    )
}

export default Page