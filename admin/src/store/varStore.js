import { create } from 'zustand';
import axios from 'axios';

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const cloudUrl = import.meta.env.VITE_CLOUDINARY_URL_KEY;
const cloudKey = import.meta.env.VITE_CLOUDINARY_API_KEY;

axios.defaults.withCredentials = true;

export const useVarStore = create((set) => ({
	cloudName: cloudName,
    cloudUrl: cloudUrl,
    cloudKey: cloudKey,
    beUrl: import.meta.env.VITE_BACKEND_URL

}));
