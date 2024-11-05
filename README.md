# ReVerbAI Personalized Content Writing Assistant <br>
The content writing assistance that learns FROM you, to write FOR you...
<hr>

This content writer chatbot helps users rewrite content with minimal changes, using their own previously written text. It functions as a personalized assistant that adapts its responses based on the amount of user-provided content it has.

When the chatbot has limited information about a user’s style or content, it generates partial answers with placeholders, suggesting specific areas for the user to add their own insights (like anecdotes or specific examples). As the chatbot gains more data on a user’s preferences and writing style, it uses this personalized content database to generate responses that rely on mixing and matching relevant user-provided content.

The chatbot’s goal is to leave the user’s original text as unchanged as possible, only making minor adjustments for grammar and coherence. It saves both the user’s written portions and the initial topics/questions provided, building a tailored, evolving database for each user.

## Getting Started

Follow these steps to clone the repository, install dependencies, and set up the OpenAI API key for local development.

### Prerequisites

Ensure you have **Node.js** and **npm** installed.


### Installation
   ```bash
   git clone https://github.com/IshaanChamoli/ReverbAI-No-RAG.git
   cd ReverbAI-No-RAG
   npm install
   ```

### Add OpenAI API Key

Create a .env file in the root directory of the project.

Add your OpenAI API key in the .env file:

    REACT_APP_OPENAI_API_KEY=your_openai_api_key_here


### Run the application


    npm start


## Usage

- **Upload a `.txt` File**: Click the "Upload .txt" button to upload a personal `.txt` file containing your own content. This file acts as a database for the assistant to use when generating responses.
- **Generate Content**: Type a question or topic in the text area and click "Send." The assistant will reference your `.txt` file to generate a response, rephrasing your content where possible or using placeholders when necessary.
- **Editable Placeholders**: If the assistant lacks sufficient information to complete a response, it will create a template with `textarea` placeholders. You can edit these placeholders directly to add missing details.
- **Clear Chat**: Use the "Clear Chat" button to remove all messages from the screen.

## Note

This is just starter code for my all-inclusive vision for a content writing chatbot! Building the final project including
- Individual Log-ins
- PDF's parsing
- Personalized RAG databases
- Updating restrictions on empty spaces left by the chatbot based on available data

