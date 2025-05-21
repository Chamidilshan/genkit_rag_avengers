# PDF Indexer and Retriever

This project is a PDF indexing and retrieval system that uses AI to process PDF files, index their content, and retrieve relevant information based on user queries.

## Features

- Extracts text from PDF files.
- Splits text into manageable chunks for indexing.
- Indexes chunks using a local vector store.
- Retrieves relevant chunks based on user queries.
- Generates AI-powered responses to queries.

## Prerequisites

- Node.js (v16 or later)
- NPM or Yarn
- A valid Google Gemini API key.

## Installation

1. Clone the repository

2. Install dependencies:
   npm install

3. Create a `.env` file in the root directory and add your API key:
   GOOGLE_GEMINI_API_KEY=your-api-key-here
