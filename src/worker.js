// Cloudflare Worker for handling API requests securely

// Handle requests
addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
        return handleCORS();
    }

    // Only handle POST requests for our API endpoints
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
            case 'generateText':
                return handleTextGenerationRequest(body);
            case 'generateImage':
                return handleImageGenerationRequest(body);
            case 'generateCode':
                return handleCodeGenerationRequest(body);
            default:
                return new Response(JSON.stringify({ error: 'Invalid action' }), { 
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                });
        }
    } catch (error) {
        console.error('Error handling request:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// Handle CORS preflight requests
function handleCORS() {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}

// Generic function to call external APIs
async function callExternalAPI(url, options) {
    const response = await fetch(url, options);
    
    if (!response.ok) {
        const errorText = await response.text();
        console.error(`API call failed: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
}

// Handle chat requests using Gemini API
async function handleChatRequest(body) {
    const { message, userId, chatHistory = [] } = body;
    
    try {
        // Get Gemini API key from secrets
        const geminiApiKey = GEMINI_API_KEY;
        
        // Prepare the conversation history for Gemini
        const contents = [];
        
        // Add system instruction
        contents.push({
            role: "user",
            parts: [{ text: "You are Wayne AI, a helpful and intelligent assistant. Answer the user's questions accurately and helpfully." }]
        });
        contents.push({
            role: "model",
            parts: [{ text: "I understand. I'm Wayne AI, ready to assist you with your questions." }]
        });
        
        // Add chat history
        chatHistory.forEach(msg => {
            contents.push({
                role: msg.role === "user" ? "user" : "model",
                parts: [{ text: msg.content }]
            });
        });
        
        // Add current message
        contents.push({
            role: "user",
            parts: [{ text: message }]
        });
        
        // Call Gemini API
        const response = await callExternalAPI(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: contents,
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 2048,
                    },
                }),
            }
        );
        
        // Extract the response text
        const responseText = response.candidates[0].content.parts[0].text;
        
        // Return the response
        return new Response(JSON.stringify({
            response: responseText,
            success: true
        }), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        });
    } catch (error) {
        console.error('Error in chat request:', error);
        return new Response(JSON.stringify({ 
            error: 'Failed to process chat request',
            details: error.message 
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        });
    }
}

// Handle text generation requests using Gemini API
async function handleTextGenerationRequest(body) {
    const { prompt, userId } = body;
    
    try {
        // Get Gemini API key from secrets
        const geminiApiKey = GEMINI_API_KEY;
        
        // Call Gemini API
        const response = await callExternalAPI(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        role: "user",
                        parts: [{ text: prompt }]
                    }],
                    generationConfig: {
                        temperature: 0.9,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 2048,
                    },
                }),
            }
        );
        
        // Extract the generated text
        const generatedText = response.candidates[0].content.parts[0].text;
        
        // Return the response
        return new Response(JSON.stringify({
            text: generatedText,
            success: true
        }), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        });
    } catch (error) {
        console.error('Error in text generation request:', error);
        return new Response(JSON.stringify({ 
            error: 'Failed to generate text',
            details: error.message 
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        });
    }
}

// Handle image generation requests using ZAI API
async function handleImageGenerationRequest(body) {
    const { prompt, style = "realistic", userId } = body;
    
    try {
        // Get ZAI API key from secrets
        const zaiApiKey = ZAI_API_KEY;
        
        // Prepare the prompt based on style
        let enhancedPrompt = prompt;
        switch (style) {
            case 'realistic':
                enhancedPrompt = `Realistic photograph of ${prompt}, highly detailed, professional photography`;
                break;
            case 'artistic':
                enhancedPrompt = `Artistic interpretation of ${prompt}, in the style of fine art, creative and expressive`;
                break;
            case 'anime':
                enhancedPrompt = `Anime style illustration of ${prompt}, vibrant colors, manga art style`;
                break;
            case 'cartoon':
                enhancedPrompt = `Cartoon drawing of ${prompt}, fun and whimsical, colorful`;
                break;
            case 'fantasy':
                enhancedPrompt = `Fantasy art of ${prompt}, magical, ethereal, highly detailed`;
                break;
            default:
                enhancedPrompt = prompt;
        }
        
        // Call ZAI API for image generation
        const response = await callExternalAPI(
            'https://api.zai.ai/v1/images/generations',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${zaiApiKey}`,
                },
                body: JSON.stringify({
                    prompt: enhancedPrompt,
                    n: 1,
                    size: "1024x1024",
                    response_format: "url",
                }),
            }
        );
        
        // Extract the image URL
        const imageUrl = response.data[0].url;
        
        // Return the response
        return new Response(JSON.stringify({
            imageUrl: imageUrl,
            prompt: enhancedPrompt,
            style: style,
            success: true
        }), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        });
    } catch (error) {
        console.error('Error in image generation request:', error);
        return new Response(JSON.stringify({ 
            error: 'Failed to generate image',
            details: error.message 
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        });
    }
}

// Handle code generation requests using Gemini API
async function handleCodeGenerationRequest(body) {
    const { prompt, language = "javascript", userId } = body;
    
    try {
        // Get Gemini API key from secrets
        const geminiApiKey = GEMINI_API_KEY;
        
        // Prepare the prompt for code generation
        const codePrompt = `Generate ${language} code for the following request: ${prompt}. 
        Please provide only the code without any explanations or markdown formatting. 
        Make sure the code is well-structured and includes necessary comments.`;
        
        // Call Gemini API
        const response = await callExternalAPI(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        role: "user",
                        parts: [{ text: codePrompt }]
                    }],
                    generationConfig: {
                        temperature: 0.2,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 2048,
                    },
                }),
            }
        );
        
        // Extract the generated code
        let generatedCode = response.candidates[0].content.parts[0].text;
        
        // Clean up the code if it contains markdown code blocks
        if (generatedCode.startsWith('```')) {
            const codeBlockMatch = generatedCode.match(/```(?:\w+)?\n([\s\S]+?)\n?```/);
            if (codeBlockMatch) {
                generatedCode = codeBlockMatch[1];
            }
        }
        
        // Return the response
        return new Response(JSON.stringify({
            code: generatedCode,
            language: language,
            prompt: prompt,
            success: true
        }), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        });
    } catch (error) {
        console.error('Error in code generation request:', error);
        return new Response(JSON.stringify({ 
            error: 'Failed to generate code',
            details: error.message 
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        });
    }
          }
