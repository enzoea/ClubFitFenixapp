import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "./cloudinaryConfig";

const uploadImageToCloudinary = async (uri) => {
  const data = new FormData();
  data.append("file", {
    uri,
    type: "image/jpeg",
    name: "upload.jpg",
  });
  data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  data.append("cloud_name", CLOUDINARY_CLOUD_NAME);

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: data,
    });

    const result = await response.json();
    if (!result.secure_url) {
      throw new Error("Erro ao obter URL da imagem no Cloudinary");
    }
    return result.secure_url;
  } catch (error) {
    console.error("Erro ao enviar imagem para o Cloudinary:", error);
    return null;
  }
};

export { uploadImageToCloudinary };