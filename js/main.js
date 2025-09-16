// Main chat functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize chat functionality
    initChat();
    
    // Initialize voice recognition
    initVoiceRecognition();
    
    // Initialize file upload
    initFileUpload();
    
    // Initialize image generation
    initImageGeneration();
    
    // Initialize code generation
    initCodeGeneration();
});

function initChat() {
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendBtn');
    const messagesContainer = document.querySelector('.chat-container .max-w-3xl');
    
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
    sendButton.addEventListener('click', function() {
        const message = messageInput.value.trim();
        if (message) {
            // Add user message to chat
            const userMessage = createUserMessage(message);
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
            
            // Simulate AI response after a delay
            setTimeout(() => {
                // Remove typing indicator
                messagesContainer.removeChild(typingMessage);
                
                // Add AI response
                const aiMessage = createAIMessage("I received your message. This is a simulated response. In a real implementation, this would be replaced with an actual AI response from an API.");
                messagesContainer.appendChild(aiMessage);
                
                // Scroll to bottom
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }, 1500);
        }
    });
}

function createUserMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'flex items-start justify-end';
    messageElement.innerHTML = `
        <div class="message-bubble bg-indigo-600 text-white rounded-lg p-4 shadow">
            <p>${escapeHtml(message)}</p>
        </div>
        <div class="flex-shrink-0 ml-3">
            <img src="https://picsum.photos/seed/user123/40/40.jpg" alt="User" class="w-10 h-10 rounded-full">
        </div>
    `;
    return messageElement;
}

function createAIMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'flex items-start';
    messageElement.innerHTML = `
        <div class="flex-shrink-0 mr-3">
            <img src="../assets/logo/wayne-ai-logo.svg" alt="Wayne AI" class="w-10 h-10 rounded-full">
        </div>
        <div class="message-bubble bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <p>${escapeHtml(message)}</p>
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
    
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // In a real implementation, you would upload the file here
            showNotification(`File "${file.name}" selected. In a real implementation, this would be uploaded.`);
            
            // Add a message to the chat about the file
            const messageInput = document.getElementById('messageInput');
            messageInput.value = `I've uploaded a file: ${file.name}`;
        }
    });
}

function initImageGeneration() {
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
    
    generateImageBtn.addEventListener('click', function() {
        const imagePrompt = document.getElementById('imagePrompt').value;
        const imageStyle = document.getElementById('imageStyle').value;
        
        if (imagePrompt) {
            // In a real implementation, you would send a request to an image generation API
            // For demo purposes, we'll just add a message to the chat
            const messageInput = document.getElementById('messageInput');
            messageInput.value = `Generate an image with the following description: "${imagePrompt}" in ${imageStyle} style.`;
            imageGenModal.classList.add('hidden');
            document.getElementById('sendBtn').click();
        }
    });
}

function initCodeGeneration() {
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
    
    generateCodeBtn.addEventListener('click', function() {
        const codePrompt = document.getElementById('codePrompt').value;
        const codeLanguage = document.getElementById('codeLanguage').value;
        
        if (codePrompt) {
            // In a real implementation, you would send a request to a code generation API
            // For demo purposes, we'll just add a message to the chat
            const messageInput = document.getElementById('messageInput');
            messageInput.value = `Generate ${codeLanguage} code for: "${codePrompt}"`;
            codeGenModal.classList.add('hidden');
            document.getElementById('sendBtn').click();
        }
    });
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in';
    notification.textContent = message;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.add('animate-fade-out');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}