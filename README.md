# TheBox Construction Website

A modern, responsive construction company website with full-stack functionality.

## Features

- 🏗️ Modern, responsive design
- 📱 Mobile-friendly interface
- 📧 Contact form with backend integration
- 📰 Newsletter subscription
- 🏢 Project portfolio
- 💼 Services showcase
- 📊 Company statistics

## Tech Stack

### Frontend
- HTML5, CSS3, JavaScript (Vanilla)
- Font Awesome for icons
- Google Fonts

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- Express Validator
- CORS, Helmet for security

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Git

### Setup

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/thebox-construction.git
cd thebox-construction
\`\`\`

2. Install backend dependencies:
\`\`\`bash
cd backend
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env
# Edit .env with your configuration
\`\`\`

4. Start MongoDB (if using local):
\`\`\`bash
mongod
\`\`\`

5. Run the backend server:
\`\`\`bash
npm run dev
\`\`\`

6. Open frontend:
\`\`\`bash
cd ../frontend
# Open index.html in your browser or use Live Server
\`\`\`

## Deployment

See deployment guide for Vercel deployment instructions.

## API Endpoints

- \`GET /api/health\` - Health check
- \`POST /api/contact\` - Submit contact form
- \`GET /api/projects\` - Get all projects
- \`POST /api/newsletter\` - Subscribe to newsletter

## Contributing

Pull requests are welcome. For major changes, please open an issue first.

## License

MIT

## Contact

TheBox Construction - hello@thebox.com



# For future updates:
git add .
git commit -m "Your commit message"
git push

# MongoDB
username = westeelbuilding_db
password = 5btDEn1tAogkZem9

const uri = "mongodb+srv://westeelbuilding_db:5btDEn1tAogkZem9@westeelbuilding.jw946zw.mongodb.net/?retryWrites=true&w=majority&appName=WesteelBuilding"