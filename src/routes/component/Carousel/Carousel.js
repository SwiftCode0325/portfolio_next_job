import { writable } from "svelte/store";
import { uploadMedia } from "../../../util/s3-uploader"

export let selectedFile = writable('No File Chosen');
export let isUpload = writable(false);
export let isUploadFlipCardFile = writable(false);
export let fileUrl = '';
export let fileName = '';

//change the default message to selected image file name in choose file button//
export async function handleFileInputChangeOnCarousel(event) {
	const file = event.target.files[0];

    if (file) {
        try {
            // Try to upload the file
            [fileName, fileUrl] = await uploadMedia(file);

            // If upload is successful, set the selectedFile and isUploadFlipCardFile
            selectedFile.set(fileUrl);
            isUpload.set(true);
        } catch (error) {
            // Handle any errors from the uploadMedia function
            console.error('Error uploading file:', error);
        }
    } else {
        selectedFile.set('No File Chosen');
        isUpload.set(false);
    }
}
    
//change the default message to selected image file name in choose file button//
export async function handleFileInputChangeOnFlipCard(event) {
    const file = event.target.files[0];

    if (file) {
        try {
            // Try to upload the file
            [fileName, fileUrl] = await uploadMedia(file);

            // If upload is successful, set the selectedFile and isUploadFlipCardFile
            selectedFile.set(fileUrl);
            isUploadFlipCardFile.set(true);
        } catch (error) {
            // Handle any errors from the uploadMedia function
            console.error('Error uploading file:', error);
        }
    } else {
        selectedFile.set('No File Chosen');
        isUploadFlipCardFile.set(false);
    }
}
