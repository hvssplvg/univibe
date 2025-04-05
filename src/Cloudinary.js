const CLOUDINARY_CLOUD_NAME = "dwjimdt1g";
const CLOUDINARY_UPLOAD_PRESET = "univibe-profile";

export { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET };

export const uploadToCloudinary = async (fileUri, fileType = "auto") => {
  const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;

  let fileExtension = fileUri.split(".").pop().toLowerCase();
  let mimeType = "";

  if (["jpg", "jpeg", "png"].includes(fileExtension)) {
    mimeType = `image/${fileExtension}`;
  } else if (["mp3", "wav", "m4a"].includes(fileExtension)) {
    mimeType = `audio/${fileExtension}`; // ✅ Handle Audio Uploads
  } else {
    console.error("Unsupported file type:", fileExtension);
    throw new Error("Unsupported file type");
  }

  let formData = new FormData();
  formData.append("file", {
    uri: fileUri.replace("file://", ""),
    type: mimeType,
    name: `upload.${fileExtension}`,
  });
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  try {
    let response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: "POST",
      body: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });

    let data = await response.json();
    console.log("Cloudinary Response:", data); // ✅ Debugging Log

    if (data.secure_url) {
      return data.secure_url; // ✅ Return Cloudinary URL
    } else {
      console.error("Cloudinary Upload Error:", data);
      throw new Error("Upload failed");
    }
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return null;
  }
};