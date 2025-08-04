import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
    cloud_name: 'dweub2lhk', 
    api_key: '498875637511741', 
    api_secret: 'oCTQJavei1U8QnDJU7CBFcIoiQc' // Replace with your API secret
});

/**
 * Upload a Base64 image to Cloudinary and return its URL
 * @param {string} base64Image - The Base64 image string (e.g., "data:image/png;base64,...")
 * @param {string} publicId - (Optional) Custom public ID for the image
 * @returns {Promise<string>} - Cloudinary URL of the uploaded image
 */
export async function uploadBase64Image(base64Image, publicId = '') {
    try {
        const result = await cloudinary.uploader.upload(base64Image, {
            public_id: publicId || undefined,
        });
        return result.secure_url; // Permanent CDN URL
    } catch (error) {
        console.error('Upload failed:', error);
        throw error;
    }
}

