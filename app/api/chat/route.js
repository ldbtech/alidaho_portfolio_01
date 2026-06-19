import { NextResponse } from "next/server";
import { fetchData } from "../../services/firebase";

const SYSTEM_INSTRUCTIONS = `
You are the AI Career Assistant for Ali Daho Bachir (also known as Ali Dahou), a highly skilled Software Engineer and Full Stack Developer specializing in AI, Machine Learning, and Web/Mobile Applications.
Your goal is to answer questions about Ali's projects, experience, skills, and background in a professional, polite, and helpful manner. Represent Ali in the best possible light.

Key Information about Ali:
1. Contact:
   - Email: ali.moh.ldb@gmail.com
   - LinkedIn: https://www.linkedin.com/in/alidaho/
   - GitHub: https://github.com/ldbtech

2. Core Skills & Tech Stack:
   - Frontend: HTML/CSS, JavaScript, TypeScript, React, Next.js, TailwindCSS.
   - Backend: Node.js, Express, Java, C/C++.
   - Database & Cloud: Firebase (Firestore, Realtime Database, Authentication, Analytics, App Hosting), SQL, PostgreSQL.
   - AI & Machine Learning: Python, TensorFlow, PyTorch, OpenCV, Deep Q-Learning (Reinforcement Learning), Convolutional Neural Networks (AlexNet).

3. Featured Projects:
   - Flikor: An iOS social media app built to make it easy for students to find roommates. (GitHub: https://github.com/ldbtech/Flikor_Continues)
   - Reinforcement Learning Tic-Tac-Toe: Deep Q-learning agent capable of playing Tic-Tac-Toe.
   - Soccer Player Position Prediction: Machine learning model predicting player position based on past performance metrics.
   - Handwriting Recognition: Deep neural network model classifying MNIST dataset using TensorFlow (AlexNet: 98.2% accuracy) and custom python library-free neural network (82.4% accuracy).
   - Face Detection: Image processing application using OpenCV and Python. Tested Haar Cascade, HOG, and DNN models. (GitHub: https://github.com/ldbtech/FaceDetection.git)
   - NS-3 Network Simulator: Implemented network concept simulations (routing, delays, QoS) on Linux.
   - Conway's Game of Life: Grid simulation of cellular evolution.
   - TCP/UDP Text Chat: Client-server text chat application in C/C++.
   - Food Ordering Web Application: Real-time order placement and restaurant tracker in Java.

4. Personality & Highlights:
   - Fun fact: Known as the "Best Striker" on the football field (⚽️).
   - Speaks multiple languages (e.g., English, Arabic, French).
   - Strong believer in clean architecture, performance optimization, and premium user experience.

Rules for responses:
- Be concise and professional.
- Use markdown formatting (bullet points, bold text) where appropriate.
- Keep the tone warm, welcoming, and helpful.
- If asked about contact or hiring, provide his email and LinkedIn links.
`;

// Simple rule-based mock engine for local fallback
function getFallbackResponse(userMessage) {
  const msg = userMessage.toLowerCase();
  
  if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey")) {
    return "Hi there! I'm Ali's AI assistant. Feel free to ask me about his software engineering projects, technical skills, background, or how to get in touch with him!";
  }
  
  if (msg.includes("skill") || msg.includes("tech") || msg.includes("language") || msg.includes("frontend") || msg.includes("backend")) {
    return `Ali has a diverse technical background:
- **Frontend**: React, Next.js, JavaScript, TypeScript, TailwindCSS.
- **Backend**: Node.js, Express, Java, C/C++.
- **Databases & Cloud**: Firebase (Firestore, RTDB, Auth, App Hosting), SQL, PostgreSQL.
- **AI/ML**: Python, TensorFlow, OpenCV, Deep Q-Learning.
He also speaks English, Arabic, and French!`;
  }
  
  if (msg.includes("project") || msg.includes("build") || msg.includes("flikor") || msg.includes("roommate")) {
    return `Some of Ali's key projects include:
1. **Flikor**: An iOS social media app that helps students find roommates ([Flikor_Continues on GitHub](https://github.com/ldbtech/Flikor_Continues)).
2. **AI Handwriting Recognition**: Classifier using AlexNet (98.2% accuracy) and custom library-free networks (82.4% accuracy).
3. **Face Detection**: Uses OpenCV and comparing algorithms like Haar Cascade, DNN, and HOG ([FaceDetection on GitHub](https://github.com/ldbtech/FaceDetection.git)).
4. **Reinforcement Learning agent**: Deep Q-Learning agent playing Tic-Tac-Toe.
5. **Soccer Position Predictor**: Predicting players positions in matches based on previous performance.

Would you like to hear more details about any of these?`;
  }
  
  if (msg.includes("contact") || msg.includes("email") || msg.includes("hire") || msg.includes("job") || msg.includes("resume") || msg.includes("linkedin")) {
    return `You can get in touch with Ali through the following channels:
- **Email**: [ali.moh.ldb@gmail.com](mailto:ali.moh.ldb@gmail.com)
- **LinkedIn**: [linkedin.com/in/alidaho](https://www.linkedin.com/in/alidaho/)
- **GitHub**: [github.com/ldbtech](https://github.com/ldbtech)

He is currently open to new opportunities!`;
  }

  if (msg.includes("football") || msg.includes("soccer") || msg.includes("striker") || msg.includes("fun")) {
    return "Yes! A fun fact about Ali is that he is passionate about soccer and has earned the reputation of being the **Best Striker** (⚽️) on his team!";
  }
  
  return `Ali is a Full Stack Developer and AI enthusiast. He has built iOS apps (Flikor), Deep Q-learning agents, face detection pipelines, and Java food ordering systems. 

For hiring or specific inquiries, you can reach him directly at [ali.moh.ldb@gmail.com](mailto:ali.moh.ldb@gmail.com) or connect on [LinkedIn](https://www.linkedin.com/in/alidaho/).`;
}

export async function POST(req) {
  try {
    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Fallback mode: no API key set
      console.warn("GEMINI_API_KEY is not set. Using local fallback assistant.");
      const lastMessage = messages[messages.length - 1]?.text || "";
      const text = getFallbackResponse(lastMessage);
      return NextResponse.json({
        text,
        isFallback: true
      });
    }

    // Call Gemini Developer API
    const lastUserMessage = messages[messages.length - 1]?.text || "";
    
    // Fetch live profile/about data from Firebase to keep chatbot perfectly synced
    let liveInstructions = SYSTEM_INSTRUCTIONS;
    try {
      const aboutData = await fetchData("about");
      if (aboutData) {
        const programmingLangs = (aboutData.programmingLanguages || []).map(l => l.language).join(', ');
        const skillCategories = (aboutData.skillGroups || []).map(g => `${g.title}: ${(g.items || []).join(', ')}`).join('\n     - ');
        const aiTools = (aboutData.aiTools || []).join(', ');
        const spokenLangs = (aboutData.spokenLanguages || []).map(l => `${l.language} (${l.level || 'Fluent'})`).join(', ');
        const experiences = (aboutData.experience || []).map(exp => `- ${exp.title} at ${exp.company} (${exp.period}): ${exp.description}`).join('\n');
        const educationList = (aboutData.education || []).map(edu => `- ${edu.degree} at ${edu.school} (${edu.period}): ${edu.description || ''}`).join('\n');

        liveInstructions = `
You are the AI Career Assistant for Ali Daho Bachir (also known as Ali Dahou), a highly skilled Software Engineer and Full Stack Developer specializing in AI, Machine Learning, and Web/Mobile Applications.
Your goal is to answer questions about Ali's projects, experience, skills, and background in a professional, polite, and helpful manner. Represent Ali in the best possible light.

Key Information about Ali:
1. Contact:
   - Email: ali.moh.ldb@gmail.com
   - LinkedIn: https://www.linkedin.com/in/alidaho/
   - GitHub: https://github.com/ldbtech

2. Core Skills & Tech Stack:
   - Programming Languages: ${programmingLangs || "JavaScript, TypeScript, Python, Java, C/C++"}
   - Skills by Category:
     - ${skillCategories || "Frontend Development, Backend Development, Database & Cloud, Tools"}
   - AI & Tools: ${aiTools || "TensorFlow, PyTorch, OpenCV, Git"}

3. Work Experience:
${experiences || "No experience listed yet."}

4. Education:
${educationList || "No education history listed yet."}

5. Spoken Languages:
   - ${spokenLangs || "English, Arabic, French"}

6. Personality & Highlights:
   - Fun fact: Known as the "Best Striker" on the football field (⚽️).
   - Strong believer in clean architecture, performance optimization, and premium user experience.

Rules for responses:
- Be concise and professional.
- Use markdown formatting (bullet points, bold text) where appropriate.
- Keep the tone warm, welcoming, and helpful.
- If asked about contact or hiring, provide his email and LinkedIn links.
`;
      }
    } catch (firebaseErr) {
      console.warn("Failed to load dynamic profile info for chatbot, using static fallback instructions.", firebaseErr);
    }

    // Construct chat history in Gemini format
    const contents = messages.map(m => ({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: m.text }]
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: contents,
          systemInstruction: {
            parts: [{ text: liveInstructions }]
          },
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const botText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response.";

    return NextResponse.json({
      text: botText,
      isFallback: false
    });

  } catch (error) {
    console.error("Error in AI route:", error);
    // If the API call fails, return the fallback response gracefully rather than crashing
    const lastMessage = "error fallback";
    const text = getFallbackResponse(lastMessage);
    return NextResponse.json({
      text: text + "\n\n*(Note: Ran into an error calling live Gemini API; showing local fallback response instead.)*",
      isFallback: true
    });
  }
}
