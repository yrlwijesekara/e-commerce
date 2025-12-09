import { useState } from "react";

export default function ImageSlider(props) {
    const images = props.images || [];
    const [activeIndex, setActiveIndex] = useState(0);
    
    if (!images || images.length === 0) {
        return <div className="w-full h-96 bg-gray-200 flex justify-center items-center">No images available</div>;
    }
    
    return (
        <div className="w-full h-full flex flex-col p-10 ">
            <div className="w-full h-[400px] bg-gray-200 flex justify-center items-center mb-4">
                <img src={images[activeIndex]} className="w-full h-full object-cover rounded-lg shadow-md" />
            </div>
            <div className="w-full h-[100px] flex gap-2 overflow-x-auto justify-center">
                {images.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        className={`w-20 h-20 object-cover rounded cursor-pointer ${index === activeIndex ? 'border-2 border-blue-500' : 'border border-gray-300'} hover:opacity-50 transform transition-transform duration-200`}
                        onClick={() => setActiveIndex(index)}
                    />
                ))}
            </div>
        </div>
    );
}