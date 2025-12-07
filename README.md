# CodeNav - CodeBase Navigator

## Project Info

**Repository**: [https://github.com/Aamirgheewale/CodeBase-Navigator](https://github.com/Aamirgheewale/CodeBase-Navigator)

**Description**: Interactive codebase exploration and analysis tool with visual graph representations and AI-powered Q&A capabilities.

## Getting Started

### Prerequisites

- Node.js (v18 or higher) - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- npm or yarn package manager

### Installation

```sh
# Step 1: Clone the repository
git clone https://github.com/Aamirgheewale/CodeBase-Navigator.git

# Step 2: Navigate to the project directory
cd CodeBase-Navigator

# Step 3: Install dependencies
npm install

# Step 4: Start the development server
npm run dev
```

The application will be available at `http://localhost:8080`

### Environment Variables

Create a `.env` file in the root directory for Gemini API integration (optional):

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

Get your API key from: https://makersuite.google.com/app/apikey

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Building for Production

```sh
# Build the project
npm run build

# Preview the production build
npm run preview
```

## Features

- **Graph Visualization**: Interactive force-directed graph of code structure
- **AI-Powered Chat**: Ask questions about codebase with Gemini API integration
- **Code Inspector**: View file contents with syntax highlighting
- **Repository Management**: Support for multiple repositories

## Documentation

For detailed documentation, see [about_project.md](./about_project.md)

## License

This project is open source and available for use.
