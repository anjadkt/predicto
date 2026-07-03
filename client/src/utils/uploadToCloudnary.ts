import axios from "axios";


export const uploadToCloud = async (image: File) => {

    const formData = new FormData();

    formData.append("file", image!);
    formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
    formData.append("folder", "profiles");

    try {
        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`,
            formData
        );
        return response.data.secure_url

    } catch (error) {

        console.log(error);
        return null;

    }


}