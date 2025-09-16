# BURME ASSISTANT 
web and UI design 



# project structure 
```
burme-assistant/
├── public/
│   ├── index.html
│   ├── pages/
│   │   ├── auth.html
│   │   ├── chat.html
│   │   ├── docs.html
│   │   ├── settings.html
│   │   └── about.html
│   ├── assets/
│   │   ├── logo/
│   │   │   └── burme-logo.png
│   │   ├── images/
│   │   │   ├── user-avatar.jpg
│   │   │   └── team/
│   │   │       ├── aung-myo-kyaw.jpg
│   │   │       ├── member-1.jpg
│   │   │       ├── member-2.jpg
│   │   │       └── member-3.jpg
│   │   └── icons/
│   │       ├── chat.svg
│   │       ├── docs.svg
│   │       ├── settings.svg
│   │       ├── about.svg
│   │       ├── search.svg
│   │       ├── send.svg
│   │       ├── paperclip.svg
│   │       ├── microphone.svg
│   │       ├── google.svg
│   │       ├── facebook.svg
│   │       ├── email.svg
│   │       ├── phone.svg
│   │       ├── location.svg
│   │       └── creative.svg
│   └── css/
│       ├── main.css
│       └── animations.css
├── src/
│   ├── js/
│   │   ├── config.js
│   │   ├── auth.js
│   │   ├── chat.js
│   │   ├── docs.js
│   │   ├── settings.js
│   │   └── about.js
│   └── worker.js
├── tailwind.config.js
├── postcss.config.js
├── wrangler.toml
├── package.json
└── README.md
```
# Burme Assistant

Your intelligent companion for tasks and information.

## Features

- **Real-time Chat**: Interactive conversation with AI assistant
- **Authentication**: Secure login with Firebase
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Modern UI**: Beautiful animations and transitions
- **Multi-language Support**: မြန်မာ, English, 中文, ไทย
- **Dark Mode**: Automatic theme switching

## Tech Stack

- **Frontend**: HTML5, Tailwind CSS, JavaScript
- **Backend**: Cloudflare Workers
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Deployment**: Cloudflare Workers

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Cloudflare account
- Firebase account

### Installation

1. Clone the repository
```bash
git clone https://github.com/burmeweb/ai.git
cd ai
