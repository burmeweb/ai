// Storage functionality for files, images, and voice recordings
import { storage } from './firebaseConfig.js';

class StorageManager {
    constructor() {
        this.storageRef = storage.ref();
    }

    // Upload a file to Firebase Storage
    async uploadFile(file, path) {
        try {
            const fileRef = this.storageRef.child(path);
            const snapshot = await fileRef.put(file);
            const downloadURL = await snapshot.ref.getDownloadURL();
            return downloadURL;
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    }

    // Upload an image
    async uploadImage(file) {
        if (!file.type.match('image.*')) {
            throw new Error('File is not an image');
        }

        const path = `images/${Date.now()}_${file.name}`;
        return this.uploadFile(file, path);
    }

    // Upload a voice recording
    async uploadVoiceRecording(blob) {
        const path = `voice/${Date.now()}.webm`;
        return this.uploadFile(blob, path);
    }

    // Delete a file from Firebase Storage
    async deleteFile(path) {
        try {
            const fileRef = this.storageRef.child(path);
            await fileRef.delete();
            return true;
        } catch (error) {
            console.error('Error deleting file:', error);
            throw error;
        }
    }

    // Get a download URL for a file
    async getDownloadURL(path) {
        try {
            const fileRef = this.storageRef.child(path);
            return await fileRef.getDownloadURL();
        } catch (error) {
            console.error('Error getting download URL:', error);
            throw error;
        }
    }
}

// Create and export an instance of StorageManager
const storageManager = new StorageManager();
export default storageManager;