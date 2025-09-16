// API service for communicating with the backend
import { showNotification } from './utils.js';

class ApiService {
    constructor() {
        this.baseUrl = 'https://gemini-worker.mysvm.workers.dev';
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
    async sendMessage(message, userId, chatHistory = []) {
        try {
            const response = await this.request('', {
                body: JSON.stringify({
                    action: 'chat',
                    message,
                    userId,
                    chatHistory
                }),
            });

            if (response.success) {
                return response.response;
            } else {
                throw new Error(response.error || 'Failed to get response');
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            showNotification('Failed to send message. Please try again.', 'error');
            throw error;
        }
    }

    // Generate text
    async generateText(prompt, userId) {
        try {
            const response = await this.request('', {
                body: JSON.stringify({
                    action: 'generateText',
                    prompt,
                    userId
                }),
            });

            if (response.success) {
                return response.text;
            } else {
                throw new Error(response.error || 'Failed to generate text');
            }
        } catch (error) {
            console.error('Failed to generate text:', error);
            showNotification('Failed to generate text. Please try again.', 'error');
            throw error;
        }
    }

    // Generate an image
    async generateImage(prompt, style = 'realistic', userId) {
        try {
            const response = await this.request('', {
                body: JSON.stringify({
                    action: 'generateImage',
                    prompt,
                    style,
                    userId
                }),
            });

            if (response.success) {
                return {
                    imageUrl: response.imageUrl,
                    prompt: response.prompt,
                    style: response.style
                };
            } else {
                throw new Error(response.error || 'Failed to generate image');
            }
        } catch (error) {
            console.error('Failed to generate image:', error);
            showNotification('Failed to generate image. Please try again.', 'error');
            throw error;
        }
    }

    // Generate code
    async generateCode(prompt, language = 'javascript', userId) {
        try {
            const response = await this.request('', {
                body: JSON.stringify({
                    action: 'generateCode',
                    prompt,
                    language,
                    userId
                }),
            });

            if (response.success) {
                return {
                    code: response.code,
                    language: response.language,
                    prompt: response.prompt
                };
            } else {
                throw new Error(response.error || 'Failed to generate code');
            }
        } catch (error) {
            console.error('Failed to generate code:', error);
            showNotification('Failed to generate code. Please try again.', 'error');
            throw error;
        }
    }

    // Get user data
    async getUserData(userId) {
        try {
            const response = await this.request('', {
                body: JSON.stringify({
                    action: 'getUser',
                    userId
                }),
            });

            if (response.success) {
                return response.user;
            } else {
                throw new Error(response.error || 'Failed to get user data');
            }
        } catch (error) {
            console.error('Failed to get user data:', error);
            throw error;
        }
    }

    // Update user data
    async updateUserData(userId, userData) {
        try {
            const response = await this.request('', {
                body: JSON.stringify({
                    action: 'updateUser',
                    userId,
                    userData
                }),
            });

            if (response.success) {
                return true;
            } else {
                throw new Error(response.error || 'Failed to update user data');
            }
        } catch (error) {
            console.error('Failed to update user data:', error);
            showNotification('Failed to update user data. Please try again.', 'error');
            throw error;
        }
    }

    // Get chat history
    async getChatHistory(userId) {
        try {
            const response = await this.request('', {
                body: JSON.stringify({
                    action: 'getChatHistory',
                    userId
                }),
            });

            if (response.success) {
                return response.chats;
            } else {
                throw new Error(response.error || 'Failed to get chat history');
            }
        } catch (error) {
            console.error('Failed to get chat history:', error);
            throw error;
        }
    }

    // Save chat history
    async saveChatHistory(userId, chatId, messages) {
        try {
            const response = await this.request('', {
                body: JSON.stringify({
                    action: 'saveChatHistory',
                    userId,
                    chatId,
                    messages
                }),
            });

            if (response.success) {
                return true;
            } else {
                throw new Error(response.error || 'Failed to save chat history');
            }
        } catch (error) {
            console.error('Failed to save chat history:', error);
            showNotification('Failed to save chat history. Please try again.', 'error');
            throw error;
        }
    }

    // Delete chat history
    async deleteChatHistory(userId, chatId) {
        try {
            const response = await this.request('', {
                body: JSON.stringify({
                    action: 'deleteChatHistory',
                    userId,
                    chatId
                }),
            });

            if (response.success) {
                return true;
            } else {
                throw new Error(response.error || 'Failed to delete chat history');
            }
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
