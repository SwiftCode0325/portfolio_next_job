import { writable } from "svelte/store";

export let selectedFile = writable('No File Chosen');
export let isUpload = writable(false);
export let isUploadFlipCardFile = writable(false);

//change the default message to selected image file name in choose file button//
export function handleFileInputChangeOnCarousel(event) {
		/*assigns the selected file to the file variable. 
    If no file is selected, it will be undefined / show no file chosen message.*/
		const file = event.target.files[0];

		if (file) {
        selectedFile.set(file.name);
        isUpload.set(true);
    } else {
        selectedFile.set('No File Chosen');
        isUpload.set(false);
    }
}
    
//change the default message to selected image file name in choose file button//
export function handleFileInputChangeOnFlipCard(event) {
		/*assigns the selected file to the file variable. 
    If no file is selected, it will be undefined / show no file chosen message.*/
		const file = event.target.files[0];

		if (file) {
			selectedFile.set(file.name);
			isUploadFlipCardFile.set(true);
		} else {
			selectedFile.set('No File Chosen');
			isUploadFlipCardFile.set(false);
		}
	}