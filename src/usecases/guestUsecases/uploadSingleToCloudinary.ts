import { v2 as cloudinary } from 'cloudinary';

export async function uploadSingleToCloudinary(imageData: string): Promise<string> {
    try {
        const result = await cloudinary.uploader.upload(imageData, { resource_type: "image" });
        return result.secure_url;

    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        throw error;
    }
}
