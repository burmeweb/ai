# Wayne AI

Intelligent Conversations, Infinite Possibilities

Wayne AI is an advanced AI assistant that helps you with a variety of tasks, from answering questions to generating images and code.

## Features

- **Conversational AI**: Engage in natural conversations with our advanced AI assistant
- **Voice Support**: Speak naturally to Wayne AI and listen to responses
- **Image Generation**: Create stunning images from text descriptions
- **Code Generation**: Generate code in various programming languages
- **Multi-language Support**: Available in English and Myanmar (Burmese)
- **Dark/Light Mode**: Choose your preferred theme
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- Internet connection

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/burmeweb/wayne-ai.git
   cd wayne-ai

# install and run

1. npm install
2. npm run build
3. npm run dev

# Deploy
```
1. npm install -g wrangler
2. wrangler login
3. npm run deploy

```
# Configuration

# Firebase

1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Authentication and Firestore Database
3. Copy your Firebase configuration and update src/firebaseConfig.js

# Cloudflare Workers

1. Create a Cloudflare account at https://workers.cloudflare.com/
2. Get your Account ID and Zone ID
3. Update wrangler.toml with your configuration

# Usage

1. Open index.html in your browser
2. Sign up or sign in to your account
3. Start chatting with Wayne AI

# Project Structure
```
Project-Root/
│
├── index.html                      # Main entry point (Loader / Landing)
│
├── pages/                          # All main pages
│   ├── auth.html                   # Login/Register/Reset
│   ├── mainchat.html               # Chat dashboard
│   ├── settings.html               # User settings
│   ├── docs.html                   # Docs & usage
│   └── about.html                  # About page
│
├── assets/                         # Static assets
│   ├── icons/                      # SVG/PNG icons
│   ├── logo/                       # App logos
│   └── images/                     # Backgrounds, illustrations
│
├── js/                             # Page specific JS
│   ├── main.js                     # Chat logic, animation effects
│   ├── setting.js                  # Settings logic
│   ├── docs.js                     # Docs search & list
│   └── about.js                    # About page interactions
│
├── css/                            # Stylesheets
│   ├── main.css                    # Global styles
│   ├── setting.css                 # Settings page
│   ├── docs.css                    # Docs page
│   └── about.css                   # About page
│
├── src/                            # Core scripts
│   ├── worker.js                   # Cloudflare Worker (API endpoint bridge)
│   ├── firebaseConfig.js           # Firebase init & config
│   ├── storage.js                  # Photo, voice, file storage
│   └── language.js                 # Multi-language switch
│
├── router/
│   └── menu-site.js                # Site navigation + menu toggle
│
├── wrangler.toml                   # Cloudflare worker config
├── package.json                    # Dependencies & scripts
└── README.md                       # Documentation
```
# Contributing

Contributions are welcome! Please feel free to submit a Pull Request.