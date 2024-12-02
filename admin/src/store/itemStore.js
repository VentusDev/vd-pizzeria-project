import { create } from "zustand";
import axios from "axios";
import { api, dashVar } from "./authVar";

const beUrl = import.meta.env.VITE_BACKEND_URL;

const API_ITEMS_URL = import.meta.env.MODE === "development" ? beUrl+"/api/items" : "/api/items";

const API_CATEGORY_URL = import.meta.env.MODE === "development" ? beUrl+"/api/category" : "/api/category";

axios.defaults.withCredentials = true;

export const useItemStore = create((set) => ({
	selectedValue: dashVar.all,
	toggleValue: (value) => set((state) => ({
	  selectedValue: state.selectedValue === value ? dashVar.all : value
	})),
	fetchCurrentCategoryList: async () => {
		try {
			const response = await axios.get(`${API_ITEMS_URL}${api.categories}`);
			return response
		} catch (error) {
			set({
				error: error.response?.data
			});
			throw error;
		}
	},
	fetchCategoryList: async () => {
		try {
			const response = await axios.post(`${API_CATEGORY_URL}${api.list}`);
			return response
		} catch (error) {
			set({
				error: error.response?.data
			});
			throw error;
		}
	},
	items_list: [],
	fetchItemsList: async () => {
		try {
			const response = await axios.get(`${API_ITEMS_URL}${api.list}`);
			set({
				items_list: response.data.data
			});
			return response
		} catch (error) {
			console.log(error);
			
			set({
				error: error.response.data,
				netErr: true
			});
			throw error;
		}
	},


	
}));
