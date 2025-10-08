

import { useState } from "react";
import { createClient } from '@supabase/supabase-js';
import toast from "react-hot-toast";
import MediaUpload from "../utils/mediaupload";


export default function Test() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    
    async function handleUpload() {
       MediaUpload(file).then((url) => {
            console.log("File uploaded successfully:", url);
            toast.success("File uploaded successfully!");
            setLoading(false);
        }).catch((error) => {
            console.error("Error uploading file:", error);
            toast.error("Error uploading file: " + error);
            setLoading(false);
        });
    }
    
    return (
        <div className="w-full h-screen bg-yellow-100 flex justify-center items-center">
            <input type="file" onChange={(e) => setFile(e.target.files[0])} className="border-2 p-2 rounded-lg" />
            <button 
                className="p-2 bg-blue-500 text-white rounded-lg ml-4" 
                onClick={handleUpload}
                disabled={loading}
            >
                {loading ? "Uploading..." : "Upload"}
            </button>
        </div>
    );
}