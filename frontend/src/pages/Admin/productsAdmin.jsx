import { FaPlus } from "react-icons/fa6";
export default function ProductsAdmin() {
    return (
        <div className="w-full h-full bg-amber-50 flex  items-center">
            <button className="p-4 bg-red-500 text-white rounded-full hover:bg-red-600 mb-5 fixed bottom-5 right-5">
                <FaPlus /> </button>
            
        </div>
    );
}