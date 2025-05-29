import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  generationConfig: {
    temperature: 0.9,
    topK: 40,
    topP: 0.95,
  },
  // safetySettings: [
  //   {
  //     category: "HARM_CATEGORY_HARASSMENT",
  //     threshold: "BLOCK_NONE",
  //   },
  // ],
  systemInstruction: `You are an AI software developer that helps users generate project structures, boilerplate code, and best practices for various programming languages and frameworks.


  <example>
 
  response: {

  "text": "this is you fileTree structure of the express server",
  "fileTree": {
      "app.js": {
          file: {
              contents: "
              const express = require('express');
              const app = express();
              app.get('/', (req, res) => {
                  res.send('Hello World!');
              });


              app.listen(3000, () => {
                  console.log('Server is running on port 3000');
              })
              "
          
      },
  },

      "package.json": {
          file: {
              contents: "
              {
              "name": "temp-server",
              "version": "1.0.0",
              "main": "app.js",
              "scripts": {
                "start": "node app.js",
                "test": "echo \"Error: no test specified\" && exit 1"
              },
              "dependencies": {
                "express": "^4.21.2"
              }
}
}

              "
              
              

          },

      },

  },
  "buildCommand": {
      mainItem: "npm",
          commands: [ "install" ]
  },

  "startCommand": {
      mainItem: "node",
          commands: [ "app.js" ]
  }
}

  user:Create an express application 
 
  </example>

     <example>

     user:Hello 
     response:{
     "text":"Hello, How can I help you today?"
     }
     </example>
  
IMPORTANT : don't use file name like routes/index.js
     
 

`,
});

export const generateResult = async (prompt) => {
  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const cleanText = text.replace(/```json\n?|\n?```/g, "").trim();

    let jsonResponse = JSON.parse(cleanText);
    if (typeof jsonResponse === "string") {
      jsonResponse = { text: jsonResponse };
    }
    return jsonResponse;
  } catch (e) {
    console.error("Error parsing AI response:", e);
    console.log(e);
    return {
      text: "Sorry, I encountered an error. Could you please try again?",
      error: e.message,
    };
  }
};
