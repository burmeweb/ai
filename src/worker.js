// Cloudflare Worker for handling API requests securely

// Handle requests
addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    // Only handle POST requests
    if (request.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
    }

    try {
        // Parse the request body
        const body = await request.json();
        
        // Get the action from the request
        const { action } = body;
        
        // Handle different actions
        switch (action) {
            case 'chat':
                return handleChatRequest(body);
            case 'generateImage':
                return handleImageGenerationRequest(body);
            case 'generateCode':
                return handleCodeGenerationRequest(body);
            default:
                return new Response('Invalid action', { status: 400 });
        }
    } catch (error) {
        console.error('Error handling request:', error);
        return new Response('Internal server error', { status: 500 });
    }
}

// Handle chat requests
async function handleChatRequest(body) {
    const { message, userId } = body;
    
    // In a real implementation, you would call an AI service API here
    // For this example, we'll just return a simple response
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return a response
    return new Response(JSON.stringify({
        response: `I received your message: "${message}". This is a simulated response from the Cloudflare Worker.`
    }), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

// Handle image generation requests
async function handleImageGenerationRequest(body) {
    const { prompt, style, userId } = body;
    
    // In a real implementation, you would call an image generation API here
    // For this example, we'll just return a placeholder image URL
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return a response
    return new Response(JSON.stringify({
        imageUrl: 'https://picsum.photos/seed/generated-image/512/512.jpg',
        prompt,
        style
    }), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

// Handle code generation requests
async function handleCodeGenerationRequest(body) {
    const { prompt, language, userId } = body;
    
    // In a real implementation, you would call a code generation API here
    // For this example, we'll just return a simple code snippet
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate a simple code snippet based on the language
    let code = '';
    
    switch (language) {
        case 'javascript':
            code = `// Generated JavaScript code\nfunction ${prompt.replace(/\s+/g, '_')}() {\n  // Your code here\n  console.log("Hello, world!");\n}`;
            break;
        case 'python':
            code = `# Generated Python code\ndef ${prompt.replace(/\s+/g, '_')}():\n  # Your code here\n  print("Hello, world!")`;
            break;
        case 'java':
            code = `// Generated Java code\npublic class ${prompt.replace(/\s+/g, '_')} {\n  public static void main(String[] args) {\n    // Your code here\n    System.out.println("Hello, world!");\n  }\n}`;
            break;
        default:
            code = `// Generated ${language} code\n// ${prompt}\n// Your code here`;
    }
    
    // Return a response
    return new Response(JSON.stringify({
        code,
        language,
        prompt
    }), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}