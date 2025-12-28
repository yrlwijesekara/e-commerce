import { useState } from "react";

export default function ImageSlider(props) {
    const images = props.images || [];
    const [activeIndex, setActiveIndex] = useState(0);
    
    if (!images || images.length === 0) {
        return <div className="w-full h-96 bg-gray-200 flex justify-center items-center">No images available</div>;
    }
    
    return (
        <div className="w-full h-full flex flex-col p-4">
            <div className="w-full h-[700px] bg-gray-200 flex justify-center items-center mb-4 rounded-lg overflow-hidden">
                <img src={images[activeIndex]} className="w-full h-full object-cover object-center" />
            </div>
            <div className="w-full h-[120px] flex gap-3 overflow-x-auto justify-center">
                {images.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        className={`w-24 h-24 object-cover object-center rounded-lg cursor-pointer ${index === activeIndex ? 'border-2 border-blue-500 shadow-lg' : 'border border-gray-300'} hover:opacity-75 hover:scale-105 transform transition-all duration-300`}
                        onClick={() => setActiveIndex(index)}
                    />
                ))}
            </div>
        </div>
    );
}