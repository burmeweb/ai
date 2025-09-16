// Chat functionality (clean version)
import apiService from '../api.js';
import storageManager from '../src/storage.js';
import { showNotification, formatDate, generateId } from '../utils.js';

document.addEventListener('DOMContentLoaded', function () {
    initChat();
});

function initChat() {
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendBtn');
    const messagesContainer = document.querySelector('.chat-container .max-w-3xl');
    const newChatButton = document.getElementById('newChatBtn');

    // Get current user
    const user = storageManager.get('user');
    if (!user) {
        window.location.href = 'pages/auth.html';
        return;
    }

    // Initialize current chat ID
    let currentChatId = storageManager.get('currentChatId') || generateId();
    storageManager.set('currentChatId', currentChatId);

    // Load chat history
    loadChatHistory(user.uid, currentChatId);

    // Auto-resize textarea
    messageInput.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    });

    // Enter key to send (without Shift)
    messageInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendButton.click();
        }
    });

    // Send button
    sendButton.addEventListener('click', async function () {
        const message = messageInput.value.trim();
        if (!message) return;

        // Show user message
        const userMessage = createUserMessage(message, user);
        messagesContainer.appendChild(userMessage);

        messageInput.value = '';
        messageInput.style.height = 'auto';
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Show typing
        const typingMessage = createTypingIndicator();
        messagesContainer.appendChild(typingMessage);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        try {
            const response = await apiService.sendMessage(message, user.uid);

            messagesContainer.removeChild(typingMessage);

            // Show AI response
            const aiMessage = createAIMessage(response, user);
            messagesContainer.appendChild(aiMessage);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            // Save history
            saveChatHistory(user.uid, currentChatId);
        } catch (error) {
            if (messagesContainer.contains(typingMessage)) {
                messagesContainer.removeChild(typingMessage);
            }
            const errorMessage = createAIMessage(
                "I'm sorry, I encountered an error while processing your request. Please try again.",
                user
            );
            messagesContainer.appendChild(errorMessage);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    });

    // New chat button
    newChatButton.addEventListener('click', function () {
        currentChatId = generateId();
        storageManager.set('currentChatId', currentChatId);

        messagesContainer.innerHTML = '';

        const welcomeMessage = createAIMessage(
            "Hello! I'm Wayne AI, your intelligent assistant. How can I help you today?",
            user
        );
        messagesContainer.appendChild(welcomeMessage);

        updateChatHistorySidebar(user.uid);
    });

    // Sidebar update
    updateChatHistorySidebar(user.uid);
}

async function loadChatHistory(userId, chatId) {
    try {
        const user = storageManager.get('user');
        const messagesContainer = document.querySelector('.chat-container .max-w-3xl');

        const welcomeMessage = createAIMessage(
            "Hello! I'm Wayne AI, your intelligent assistant. How can I help you today?",
            user
        );
        messagesContainer.appendChild(welcomeMessage);
    } catch (error) {
        console.error('Failed to load chat history:', error);
    }
}

async function saveChatHistory(userId, chatId) {
    try {
        console.log('Saving chat history for user:', userId, 'chat:', chatId);
    } catch (error) {
        console.error('Failed to save chat history:', error);
    }
}

async function updateChatHistorySidebar(userId) {
    try {
        const chatHistoryContainer = document.querySelector('.flex-1.overflow-y-auto .p-2');

        const newChatItem = document.createElement('div');
        newChatItem.className =
            'p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer bg-indigo-50 dark:bg-indigo-900';
        newChatItem.innerHTML = `
            <h3 class="font-medium truncate">Current Chat</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 truncate">Just started</p>
        `;

        const activeChat = chatHistoryContainer.querySelector(
            '.bg-indigo-50, .dark\\:bg-indigo-900'
        );
        if (activeChat) {
            activeChat.classList.remove('bg-indigo-50', 'dark:bg-indigo-900');
        }

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
                <span></span><span></span><span></span>
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
        "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
}
