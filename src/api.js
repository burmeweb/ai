// API service for communicating with the backend
import { showNotification } from '../utils.js';

class ApiService {
    constructor() {
        this.baseUrl = 'https://gemini-worker.mysvm.workers.dev/';
    }

    // Generic request method
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const defaultOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const config = { ...defaultOptions, ...options };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Send a chat message
    async sendMessage(message, userId) {
        try {
            const response = await this.request('/chat', {
                body: JSON.stringify({
                    action: 'chat',
                    message,
                    userId,
                }),
            });

            return response.response;
        } catch (error) {
            console.error('Failed to send message:', error);
            showNotification('Failed to send message. Please try again.', 'error');
            throw error;
        }
    }

    // Generate an image
    async generateImage(prompt, style, userId) {
        try {
            const response = await this.request('/generateImage', {
                body: JSON.stringify({
                    action: 'generateImage',
                    prompt,
                    style,
                    userId,
                }),
            });

            return response.imageUrl;
        } catch (error) {
            console.error('Failed to generate image:', error);
            showNotification('Failed to generate image. Please try again.', 'error');
            throw error;
        }
    }

    // Generate code
    async generateCode(prompt, language, userId) {
        try {
            const response = await this.request('/generateCode', {
                body: JSON.stringify({
                    action: 'generateCode',
                    prompt,
                    language,
                    userId,
                }),
            });

            return response.code;
        } catch (error) {
            console.error('Failed to generate code:', error);
            showNotification('Failed to generate code. Please try again.', 'error');
            throw error;
        }
    }

    // Get user data
    async getUserData(userId) {
        try {
            const response = await this.request('/getUser', {
                body: JSON.stringify({
                    action: 'getUser',
                    userId,
                }),
            });

            return response.user;
        } catch (error) {
            console.error('Failed to get user data:', error);
            throw error;
        }
    }

    // Update user data
    async updateUserData(userId, userData) {
        try {
            const response = await this.request('/updateUser', {
                body: JSON.stringify({
                    action: 'updateUser',
                    userId,
                    userData,
                }),
            });

            return response.success;
        } catch (error) {
            console.error('Failed to update user data:', error);
            showNotification('Failed to update user data. Please try again.', 'error');
            throw error;
        }
    }

    // Get chat history
    async getChatHistory(userId) {
        try {
            const response = await this.request('/getChatHistory', {
                body: JSON.stringify({
                    action: 'getChatHistory',
                    userId,
                }),
            });

            return response.chats;
        } catch (error) {
            console.error('Failed to get chat history:', error);
            throw error;
        }
    }

    // Save chat history
    async saveChatHistory(userId, chatId, messages) {
        try {
            const response = await this.request('/saveChatHistory', {
                body: JSON.stringify({
                    action: 'saveChatHistory',
                    userId,
                    chatId,
                    messages,
                }),
            });

            return response.success;
        } catch (error) {
            console.error('Failed to save chat history:', error);
            throw error;
        }
    }

    // Delete chat history
    async deleteChatHistory(userId, chatId) {
        try {
            const response = await this.request('/deleteChatHistory', {
                body: JSON.stringify({
                    action: 'deleteChatHistory',
                    userId,
                    chatId,
                }),
            });

            return response.success;
        } catch (error) {
            console.error('Failed to delete chat history:', error);
            showNotification('Failed to delete chat history. Please try again.', 'error');
            throw error;
        }
    }
}

// Create and export an instance of ApiService
const apiService = new ApiService();
export default apiService;
