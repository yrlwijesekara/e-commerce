const supabaseUrl = 'https://spicisheknqlbooagoam.supabase.co';
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwaWNpc2hla25xbGJvb2Fnb2FtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MTc4MTQsImV4cCI6MjA3NTQ5MzgxNH0.VHnkhBmO4vsT0Jb8YzzUKfQNySV57i-1_aKpRhkl0MM";

import { createClient } from '@supabase/supabase-js';
const supabase = createClient(supabaseUrl, key);
export default function MediaUpload(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject("Please select a file first");
            return;
        }
        const timestamp = new Date().getTime();
        const fileName = `${timestamp}-${file.name}`;
        supabase.storage.from('images').upload(fileName, file, { cacheControl: '3600', upsert: false })
            .then((response) => {
                if (response.error) {
                    reject("Error uploading file: " + response.error.message);
                } else {
                    const publicUrl = supabase.storage.from('images').getPublicUrl(fileName).data.publicUrl;
                    resolve(publicUrl);
                }
            })
            .catch((error) => {
                reject("Error uploading file: " + error.message);
            });
    });
}