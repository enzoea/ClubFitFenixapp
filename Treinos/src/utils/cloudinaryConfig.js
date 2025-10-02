import Constants from "expo-constants";

const extras = Constants?.expoConfig?.extra || Constants?.manifest?.extra || {};
export const CLOUDINARY_CLOUD_NAME = extras.cloudinaryCloudName || "dowsfrxnm";
export const CLOUDINARY_UPLOAD_PRESET = extras.cloudinaryUploadPreset || "clubfitfenix";