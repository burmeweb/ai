# Create project directory
mkdir Project-Root
cd Project-Root

# Create package.json
npm init -y

# Install dependencies
npm install tailwindcss firebase @tailwindcss/typography
npm install -D tailwindcss postcss autoprefixer

# Initialize Tailwind CSS
npx tailwindcss init -p