import cloudinary from "../../config/cloudinary";

type ImageArray = string[];

export async function uploadMultipleToCloudinary(imagesArray: ImageArray): Promise<string[]> {
    try {
        const urls: string[] = [];
        
        for (const data of imagesArray) {
            try {
                const result = await cloudinary.uploader.upload(data, {resource_type: "image"});
                urls.push(result.secure_url);

                await delay(1000);  

            } catch (error) {
                console.error("Error uploading to Cloudinary:", error);
            }
        }

        return urls;

    } catch (error) {
        console.error("Unexpected error:", error);
        return [];
    }
}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
