// Chat functionality
import apiService from '../api.js';
import storageManager from '../src/storage.js';
import { showNotification, formatDate, generateId } from '../utils.js';

document.addEventListener('DOMContentLoaded', function() {
    // Initialize chat
    initChat();
});

function initChat() {
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendBtn');
    const messagesContainer = document.querySelector('.chat-container .max-w-3xl');
    const newChatButton = document.getElementById('newChatBtn');
    
    // Get current user
    const user = storage.get('user');
    if (!user) {
        window.location.href = 'pages/auth.html';
        return;
    }
    
    // Initialize current chat ID
    let currentChatId = storage.get('currentChatId') || generateId();
    storage.set('currentChatId', currentChatId);
    
    // Load chat history
    loadChatHistory(user.uid, currentChatId);
    
    // Auto-resize textarea
    messageInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
    
    // Send message on Enter key (but not with Shift)
    messageInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendButton.click();
        }
    });
    
    // Send button functionality
    sendButton.addEventListener('click', async function() {
        const message = messageInput.value.trim();
        if (message) {
            // Add user message to chat
            const userMessage = createUserMessage(message, user);
            messagesContainer.appendChild(userMessage);
            
            // Clear input
            messageInput.value = '';
            messageInput.style.height = 'auto';
            
            // Scroll to bottom
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            // Show typing indicator
            const typingMessage = createTypingIndicator();
            messagesContainer.appendChild(typingMessage);
            
            // Scroll to bottom
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            try {
                // Send message to API
                const response = await apiService.sendMessage(message, user.uid);
                
                // Remove typing indicator
                messagesContainer.removeChild(typingMessage);
                
                // Add AI response
                const aiMessage = createAIMessage(response, user);
                messagesContainer.appendChild(aiMessage);
                
                // Scroll to bottom
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
                
                // Save chat history
                saveChatHistory(user.uid, currentChatId);
            } catch (error) {
                // Remove typing indicator
                if (messagesContainer.contains(typingMessage)) {
                    messagesContainer.removeChild(typingMessage);
                }
                
                // Show error message
                const errorMessage = createAIMessage("I'm sorry, I encountered an error while processing your request. Please try again.", user);
                messagesContainer.appendChild(errorMessage);
                
                // Scroll to bottom
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        }
    });
    
    // New chat button
    newChatButton.addEventListener('click', function() {
        // Generate new chat ID
        currentChatId = generateId();
        storage.set('currentChatId', currentChatId);
        
        // Clear messages
        messagesContainer.innerHTML = '';
        
        // Add welcome message
        const welcomeMessage = createAIMessage("Hello! I'm Wayne AI, your intelligent assistant. How can I help you today?", user);
        messagesContainer.appendChild(welcomeMessage);
        
        // Update chat history in sidebar
        updateChatHistorySidebar(user.uid);
    });
    
    // Initialize voice recognition
    initVoiceRecognition();
    
    // Initialize file upload
    initFileUpload();
    
    // Initialize image generation
    initImageGeneration(user);
    
    // Initialize code generation
    initCodeGeneration(user);
    
    // Initialize chat history sidebar
    updateChatHistorySidebar(user.uid);
}

async function loadChatHistory(userId, chatId) {
    try {
        // In a real implementation, you would load the chat history from your API
        // For now, we'll just add a welcome message
        
        const user = storage.get('user');
        const messagesContainer = document.querySelector('.chat-container .max-w-3xl');
        
        // Add welcome message
        const welcomeMessage = createAIMessage("Hello! I'm Wayne AI, your intelligent assistant. How can I help you today?", user);
        messagesContainer.appendChild(welcomeMessage);
    } catch (error) {
        console.error('Failed to load chat history:', error);
    }
}

async function saveChatHistory(userId, chatId) {
    try {
        // In a real implementation, you would save the chat history to your API
        console.log('Saving chat history for user:', userId, 'chat:', chatId);
    } catch (error) {
        console.error('Failed to save chat history:', error);
    }
}

async function updateChatHistorySidebar(userId) {
    try {
        // In a real implementation, you would load the chat history from your API
        // For now, we'll just update the UI
        
        const chatHistoryContainer = document.querySelector('.flex-1.overflow-y-auto .p-2');
        
        // Add current chat to the top of the list
        const newChatItem = document.createElement('div');
        newChatItem.className = 'p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer bg-indigo-50 dark:bg-indigo-900';
        newChatItem.innerHTML = `
            <h3 class="font-medium truncate">Current Chat</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 truncate">Just started</p>
        `;
        
        // Remove active class from previous chat
        const activeChat = chatHistoryContainer.querySelector('.bg-indigo-50.dark\\:bg-indigo-900');
        if (activeChat) {
            activeChat.classList.remove('bg-indigo-50', 'dark:bg-indigo-900');
        }
        
        // Add new chat to the top
        chatHistoryContainer.insertBefore(newChatItem, chatHistoryContainer.firstChild);
    } catch (error) {
        console.error('Failed to update chat history sidebar:', error);
    }
}

function createUserMessage(message, user) {
    const messageElement = document.createElement('div');
    messageElement.className = 'flex items-start justify-end';
    messageElement.innerHTML = `
        <div class="message-bubble bg-indigo-600 text-white rounded-lg p-4 shadow">
            <p>${escapeHtml(message)}</p>
            <div class="text-xs opacity-70 mt-1">${formatDate(new Date())}</div>
        </div>
        <div class="flex-shrink-0 ml-3">
            <img src="${user.photoURL || 'https://picsum.photos/seed/user123/40/40.jpg'}" alt="User" class="w-10 h-10 rounded-full">
        </div>
    `;
    return messageElement;
}

function createAIMessage(message, user) {
    const messageElement = document.createElement('div');
    messageElement.className = 'flex items-start';
    messageElement.innerHTML = `
        <div class="flex-shrink-0 mr-3">
            <img src="../assets/logo/wayne-ai-logo.svg" alt="Wayne AI" class="w-10 h-10 rounded-full">
        </div>
        <div class="message-bubble bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <p>${escapeHtml(message)}</p>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">${formatDate(new Date())}</div>
        </div>
    `;
    return messageElement;
}

function createTypingIndicator() {
    const messageElement = document.createElement('div');
    messageElement.className = 'flex items-start';
    messageElement.innerHTML = `
        <div class="flex-shrink-0 mr-3">
            <img src="../assets/logo/wayne-ai-logo.svg" alt="Wayne AI" class="w-10 h-10 rounded-full">
        </div>
        <div class="message-bubble bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    return messageElement;
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function initVoiceRecognition() {
    const voiceButton = document.getElementById('voiceBtn');
    const voiceRecording = document.getElementById('voiceRecording');
    let isRecording = false;
    let recognition = null;
    
    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            document.getElementById('messageInput').value = transcript;
            stopRecording();
        };
        
        recognition.onerror = function(event) {
            console.error('Speech recognition error', event.error);
            stopRecording();
            showNotification('Speech recognition error. Please try again.');
        };
        
        recognition.onend = function() {
            stopRecording();
        };
    } else {
        // Browser doesn't support speech recognition
        voiceButton.style.display = 'none';
    }
    
    voiceButton.addEventListener('click', function() {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    });
    
    function startRecording() {
        isRecording = true;
        voiceRecording.classList.remove('hidden');
        voiceButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
            </svg>
        `;
        
        if (recognition) {
            recognition.start();
        }
    }
    
    function stopRecording() {
        isRecording = false;
        voiceRecording.classList.add('hidden');
        voiceButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
        `;
        
        if (recognition) {
            recognition.stop();
        }
    }
}

function initFileUpload() {
    const fileInput = document.getElementById('fileInput');
    
    fileInput.addEventListener('change', async function(e) {
        const file = e.target.files[0];
        if (file) {
            try {
                // Upload file to storage
                const downloadUrl = await storageManager.uploadFile(file, `uploads/${Date.now()}_${file.name}`);
                
                // Add file message to chat
                const user = storage.get('user');
                const messageInput = document.getElementById('messageInput');
                messageInput.value = `I've uploaded a file: ${file.name}`;
                
                showNotification('File uploaded successfully!', 'success');
            } catch (error) {
                console.error('Failed to upload file:', error);
                showNotification('Failed to upload file. Please try again.', 'error');
            }
        }
    });
}

function initImageGeneration(user) {
    const imageGenBtn = document.getElementById('imageGenBtn');
    const imageGenModal = document.getElementById('imageGenModal');
    const closeImageModal = document.getElementById('closeImageModal');
    const cancelImageGen = document.getElementById('cancelImageGen');
    const generateImageBtn = document.getElementById('generateImageBtn');
    
    imageGenBtn.addEventListener('click', function() {
        imageGenModal.classList.remove('hidden');
    });
    
    closeImageModal.addEventListener('click', function() {
        imageGenModal.classList.add('hidden');
    });
    
    cancelImageGen.addEventListener('click', function() {
        imageGenModal.classList.add('hidden');
    });
    
    generateImageBtn.addEventListener('click', async function() {
        const imagePrompt = document.getElementById('imagePrompt').value;
        const imageStyle = document.getElementById('imageStyle').value;
        
        if (imagePrompt) {
            try {
                // Generate image
                const imageUrl = await apiService.generateImage(imagePrompt, imageStyle, user.uid);
                
                // Add image message to chat
                const messagesContainer = document.querySelector('.chat-container .max-w-3xl');
                const imageMessage = createImageMessage(imageUrl, imagePrompt, user);
                messagesContainer.appendChild(imageMessage);
                
                // Scroll to bottom
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
                
                // Close modal
                imageGenModal.classList.add('hidden');
                
                // Clear form
                document.getElementById('imagePrompt').value = '';
                
                // Save chat history
                const currentChatId = storage.get('currentChatId');
                saveChatHistory(user.uid, currentChatId);
            } catch (error) {
                console.error('Failed to generate image:', error);
            }
        }
    });
}

function createImageMessage(imageUrl, prompt, user) {
    const messageElement = document.createElement('div');
    messageElement.className = 'flex items-start';
    messageElement.innerHTML = `
        <div class="flex-shrink-0 mr-3">
            <img src="../assets/logo/wayne-ai-logo.svg" alt="Wayne AI" class="w-10 h-10 rounded-full">
        </div>
        <div class="message-bubble bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <p class="mb-2">I've generated an image based on your prompt: "${prompt}"</p>
            <img src="${imageUrl}" alt="Generated image" class="max-w-full rounded-lg">
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">${formatDate(new Date())}</div>
        </div>
    `;
    return messageElement;
}

function initCodeGeneration(user) {
    const codeGenBtn = document.getElementById('codeGenBtn');
    const codeGenModal = document.getElementById('codeGenModal');
    const closeCodeModal = document.getElementById('closeCodeModal');
    const cancelCodeGen = document.getElementById('cancelCodeGen');
    const generateCodeBtn = document.getElementById('generateCodeBtn');
    
    codeGenBtn.addEventListener('click', function() {
        codeGenModal.classList.remove('hidden');
    });
    
    closeCodeModal.addEventListener('click', function() {
        codeGenModal.classList.add('hidden');
    });
    
    cancelCodeGen.addEventListener('click', function() {
        codeGenModal.classList.add('hidden');
    });
    
    generateCodeBtn.addEventListener('click', async function() {
        const codePrompt = document.getElementById('codePrompt').value;
        const codeLanguage = document.getElementById('codeLanguage').value;
        
        if (codePrompt) {
            try {
                // Generate code
                const code = await apiService.generateCode(codePrompt, codeLanguage, user.uid);
                
                // Add code message to chat
                const messagesContainer = document.querySelector('.chat-container .max-w-3xl');
                const codeMessage = createCodeMessage(code, codeLanguage, codePrompt, user);
                messagesContainer.appendChild(codeMessage);
                
                // Scroll to bottom
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
                
                // Close modal
                codeGenModal.classList.add('hidden');
                
                // Clear form
                document.getElementById('codePrompt').value = '';
                
                // Save chat history
                const currentChatId = storage.get('currentChatId');
                saveChatHistory(user.uid, currentChatId);
            } catch (error) {
                console.error('Failed to generate code:', error);
            }
        }
    });
}

function createCodeMessage(code, language, prompt, user) {
    const messageElement = document.createElement('div');
    messageElement.className = 'flex items-start';
    messageElement.innerHTML = `
        <div class="flex-shrink-0 mr-3">
            <img src="../assets/logo/wayne-ai-logo.svg" alt="Wayne AI" class="w-10 h-10 rounded-full">
        </div>
        <div class="message-bubble bg-white dark:bg-gray-800 rounded-lg p-4 shadow w-full">
            <p class="mb-2">I've generated ${language} code based on your prompt: "${prompt}"</p>
            <div class="bg-gray-800 text-gray-100 rounded-lg p-4 overflow-x-auto">
                <pre><code>${escapeHtml(code)}</code></pre>
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">${formatDate(new Date())}</div>
        </div>
    `;
    return messageElement;
}
