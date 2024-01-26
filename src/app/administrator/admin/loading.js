import styles from "@/Styles/loading.module.css"
export default function Loading() {
    // Or a custom loading skeleton component
    return <div className={styles.container} > <div className={styles.loader}></div></div>
}