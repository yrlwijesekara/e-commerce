import { FaPlus } from "react-icons/fa6";
import { Link } from "react-router-dom";
import AddProduct from "./addproduct";



const sampleProducts = [
  {
    productId: "COS001",
    name: "Luxe Matte Lipstick",
    altname: ["Velvet Lipstick", "Matte Finish Lip Color"],
    labelledprice: 3500,
    price: 2990,
    description: "A richly pigmented matte lipstick with a smooth, long-lasting finish. Infused with vitamin E for added moisture.",
    image: ["/images/lipstick1.jpg", "/images/lipstick1-alt.jpg"],
    stock: 25,
    isAvailable: true,
    category: "cosmetics"
  },
  {
    productId: "COS002",
    name: "HydraGlow Foundation",
    altname: ["Liquid Foundation", "Dewy Finish Foundation"],
    labelledprice: 5800,
    price: 5200,
    description: "Lightweight, buildable foundation that gives a radiant, dewy glow while keeping your skin hydrated all day.",
    image: ["/images/foundation1.jpg"],
    stock: 18,
    isAvailable: true,
    category: "cosmetics"
  },
  {
    productId: "COS003",
    name: "Rose Petal Face Mist",
    altname: ["Hydrating Face Mist", "Toner Spray"],
    labelledprice: 2200,
    price: 1990,
    description: "A refreshing rose-infused mist that hydrates and revitalizes skin instantly. Perfect for a mid-day pick-me-up.",
    image: ["/images/facemist1.jpg"],
    stock: 40,
    isAvailable: true,
    category: "cosmetics"
  },
  {
    productId: "COS004",
    name: "Silky Smooth Compact Powder",
    altname: ["Pressed Powder", "Oil Control Powder"],
    labelledprice: 3200,
    price: 2900,
    description: "Lightweight compact powder with oil-control formula for a natural matte finish. Ideal for everyday use.",
    image: ["/images/powder1.jpg"],
    stock: 30,
    isAvailable: true,
    category: "cosmetics"
  },
  {
    productId: "COS005",
    name: "Radiance Vitamin C Serum",
    altname: ["Glow Serum", "Brightening Serum"],
    labelledprice: 6800,
    price: 6400,
    description: "Concentrated Vitamin C serum that brightens dull skin, evens tone, and boosts natural glow.",
    image: ["/images/serum1.jpg"],
    stock: 15,
    isAvailable: true,
    category: "cosmetics"
  },
  {
    productId: "COS006",
    name: "Aloe Soothing Gel",
    altname: ["Moisturizing Gel", "After Sun Gel"],
    labelledprice: 2500,
    price: 2200,
    description: "Multi-purpose aloe vera gel that calms and hydrates skin. Perfect for after-sun care or daily moisturizing.",
    image: ["/images/aloe1.jpg"],
    stock: 35,
    isAvailable: true,
    category: "cosmetics"
  },
  {
    productId: "COS007",
    name: "SilkTouch Makeup Remover",
    altname: ["Micellar Water", "Makeup Cleanser"],
    labelledprice: 2700,
    price: 2400,
    description: "Gentle micellar cleanser that removes makeup and impurities without stripping moisture.",
    image: ["/images/remover1.jpg"],
    stock: 20,
    isAvailable: true,
    category: "cosmetics"
  },
  {
    productId: "COS008",
    name: "Velvet Eyeshadow Palette",
    altname: ["Eyeshadow Kit", "Eye Makeup Palette"],
    labelledprice: 7500,
    price: 6990,
    description: "12-shade eyeshadow palette featuring both matte and shimmer finishes for any occasion.",
    image: ["/images/eyeshadow1.jpg"],
    stock: 10,
    isAvailable: true,
    category: "cosmetics"
  },
  {
    productId: "COS009",
    name: "Luminous Highlighter Stick",
    altname: ["Glow Stick", "Shimmer Highlighter"],
    labelledprice: 3100,
    price: 2800,
    description: "Cream-based highlighter that adds instant glow to cheeks, nose, and brow bones.",
    image: ["/images/highlighter1.jpg"],
    stock: 22,
    isAvailable: true,
    category: "cosmetics"
  },
  {
    productId: "COS010",
    name: "Cherry Blossom Perfume",
    altname: ["Floral Perfume", "Body Spray"],
    labelledprice: 5400,
    price: 4990,
    description: "A light, floral fragrance inspired by cherry blossoms for a refreshing and elegant scent.",
    image: ["/images/perfume1.jpg"],
    stock: 28,
    isAvailable: true,
    category: "cosmetics"
  }
];




export default function ProductsAdmin() {
    return (
        <div className="w-full h-full flex  items-center">
            <Link to="/admin/Add-Product" className="p-4 bg-red-500 text-white rounded-full hover:bg-red-600 mb-5 fixed bottom-5 right-5 shadow-2xl">
                <FaPlus /> </Link>

        </div>
    );
}