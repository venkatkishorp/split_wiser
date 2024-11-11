import { create } from 'zustand';


const useStore = create((set) => ({
	uploadedImage: null,
	setImage: (image) => set({ uploadedImage: image }),
	items: [],
	setItems: (i) => set({items: i})
}));

export default useStore; 