import styles from "@/Styles/OrderHistory.module.css"
import Image from "next/image";
import Link from "next/link";

const page = () => {
  // Dummy order data
  const orders = [
    {
      name: 'Product 1',
      image: '/category.jpg',
      price: '$49.99',
      variant: 'Color: Black, Size: Medium',
      deliveryStatus: 'Delivered',
      date: 'June 9, 2023',
    },
    {
      name: 'Product 2',
      image: '/category.jpg',
      price: '$29.99',
      variant: 'Color: Blue, Size: Large',
      deliveryStatus: 'In Transit',
      date: 'June 8, 2023',
    },
  ];

  return (
    <>
      <h3>Order History</h3>
      <div className={styles.order_history}>
        {orders.map((product, orderIndex) => (
          <Link href={"/order-details/orderId"} key={orderIndex} className={styles.each_order}>
            <Image height={520} width={520} src={product.image} alt={product.name} />
            <p>
              <span>{product.name}</span>
              <span>{product.variant}</span>
            </p>
            <p>{product.price}</p>
            <p>{product.deliveryStatus}</p>
            <p>Order on {product.date}</p>
          </Link>
        ))}
      </div>
    </>
  );
};

export default page;
