"use client"
import styles from "@/Styles/productsLayout.module.css"
import Link from "next/link"
import Image from "next/image"
import {CgShoppingCart, CgSearch} from "react-icons/cg"
import {useRouter} from "next/navigation";
import FilterComponent from "@/Components/FilterComponent"
import {useContext, useEffect, useMemo, useState} from "react"
import Loading from "@/app/loading"
import UserAuthContext from "@/app/contextProvider"



const Page = ({params}) => {
    let router = useRouter()
    const context = useContext(UserAuthContext)
    const ctgry = decodeURIComponent(params.ctgry)
    const [medicineProducts, setMedicineProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [allFilterTags, setAllFilterTags] = useState([]);
    const [filterByTags, setFilterByTags] = useState([]);
    const [queryValue, setQueryValue] = useState("");

    const handleChange = (e) => {
        setQueryValue(e.target.value)
    }

    const fetchFeaturedProducts = useMemo(async () => {
        const response = await fetch("/api/all-products");
        const result = await response.json();
        if (result.status === 200) {
            if (filterByTags.length) {
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
    }, [ctgry, filterByTags]);

    const handleQueryRequest = (e) => {
        e.preventDefault()
        router.push("/search/" + queryValue.replace(" ", "-"))
    }

    useEffect(() => {
        async function fetchtags() {
            const response = await fetch("/api/FetchTag")
            const resultData = await response.json()
            setAllFilterTags(resultData.data)
        }
        fetchtags()
    }, [fetchFeaturedProducts]);

    return (
        <div className={styles.layout} >
            <div className={styles.search_bar} id="search-bar" >
                <form onSubmit={handleQueryRequest} >
                    <input type="text" placeholder="Search Product" value={queryValue} onChange={handleChange} spellCheck="false" />
                    <CgSearch className={styles.seach_icon} />
                </form>
            </div>
            {
                isLoading ? Loading() :
                    <div className={styles.layout_container} data-listing="true" >
                        <FilterComponent setFilterByTags={setFilterByTags} allFilterTags={allFilterTags} />
                        <div>
                            {medicineProducts.map((value, index) => {
                                return (
                                    <div key={index} className={styles.each_product_card} >
                                        <Link href={{pathname: `/medicine/${value.productId}`}} >
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