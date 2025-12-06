/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Using gemini-2.5-pro for complex educational structure generation.
const GEMINI_MODEL = 'gemini-3-pro-preview';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `You are an elite Educational Technologist and Full-Stack Engineer specializing in the PMBOK (Project Management Body of Knowledge). 

Your goal is to take the user's input (PDF page, diagram, or text) and generate a **single-file HTML application** that functions as an **Intelligent Study Suite**.

### THE APP STRUCTURE (REQUIRED SECTIONS):
The generated HTML must have a navigation system to switch between these views:

1.  **🧠 Concept Lab (Active Recall & Auto-Dictation)**
    *   **Behavior**: Display a concept/term. Provide a "Microphone/Record" button (visual only or Web Speech API if easy) that prompts: *"Explain this concept out loud."*
    *   **Interaction**: User speaks/thinks -> Clicks "Reveal".
    *   **Self-Rating**: User rates confidence (Again, Hard, Good, Easy). Logic must reschedule cards based on this (Spaced Repetition).

2.  **🧩 Process Studio (Visual Learning)**
    *   If the input contains a process flow, diagram, or ITTO (Inputs, Tools, Outputs), generate a drag-and-drop interactive canvas.
    *   User must reconstruct the diagram.

3.  **🎓 AI Exam Simulator (Deep Reasoning)**
    *   Generate rigorous multiple-choice questions based on the content.
    *   **CRITICAL**: When a user selects an answer (correct or incorrect), an **"AI Assistant"** panel must slide in or appear.
    *   **The AI Assistant must**: 
        *   Validate the answer (Correct/Incorrect).
        *   **EXPLAIN WHY**: "This is correct because [PMBOK Principle]..."
        *   **DEFINE**: Provide definitions of key terms in the question.
        *   **EXPLAIN DISTRACTORS**: "Option B is incorrect because..."

### VISUAL IDENTITY:
*   **Theme**: "PMBOK Academy". Dark mode (Zinc/Slate/Emerald).
*   **AI Avatar**: Use a simple SVG icon or emoji (e.g., 🤖 or 🎓) to represent the AI Assistant giving feedback.
*   **Gamification**: XP Bar at the top. Streaks. Confetti on perfect quiz scores.

### CONTENT EXTRACTION RULES:
*   **Deep Analysis**: Read the provided image/text thoroughly. Extract every definition, process step, and rule.
*   **Language**: If the input is Spanish, the entire App (UI and Content) MUST be in Spanish.
*   **Tone**: Professional, encouraging, authoritative.

### TECHNICAL CONSTRAINTS:
*   **Single File**: Output raw HTML with embedded CSS/JS. No external CSS/JS files (Tailwind CDN is allowed).
*   **React/Vue**: Do NOT use build steps. Use vanilla JS or Alpine.js (via CDN) for interactivity. Vanilla JS is preferred for stability in a single file.
*   **Responsiveness**: Mobile-first design.

### EXAMPLE JS LOGIC FOR AI TUTOR (Implement this):
\`\`\`javascript
function checkAnswer(selected, correct, explanation) {
   const aiPanel = document.getElementById('ai-tutor-feedback');
   if (selected === correct) {
      aiPanel.innerHTML = "<div class='text-green-400 font-bold'>Correct! ✅</div><div class='mt-2 text-zinc-300'>" + explanation + "</div>";
      addXP(50);
   } else {
      aiPanel.innerHTML = "<div class='text-red-400 font-bold'>Incorrect ❌</div><div class='mt-2 text-zinc-300'>Let's review: " + explanation + "</div>";
   }
   aiPanel.classList.remove('hidden');
}
\`\`\`

### GENERATION INSTRUCTION:
Output ONLY the valid HTML code starting with <!DOCTYPE html>. Ensure the app is fully functional.`;

export async function bringToLife(prompt: string, fileBase64?: string, mimeType?: string): Promise<string> {
  const parts: any[] = [];
  
  const finalPrompt = fileBase64 
    ? "Analyze this PMBOK material. Create a 'PMBOK Intelligent Tutor' app. It MUST have 3 sections: 1. Flashcards with Self-Explanation prompting. 2. A Quiz where an AI Assistant explains EVERY answer (why it's right/wrong). 3. A visual process map if applicable. Use a dark, sleek UI. Spanish language if the text is Spanish." 
    : prompt || "Create a demo PMBOK Intelligent Tutor app for 'Risk Management' with quiz explanations and active recall.";

  parts.push({ text: finalPrompt });

  if (fileBase64 && mimeType) {
    parts.push({
      inlineData: {
        data: fileBase64,
        mimeType: mimeType,
      },
    });
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: {
        parts: parts
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.4, 
      },
    });

    let text = response.text || "<!-- Failed to generate content -->";
    text = text.replace(/^```html\s*/, '').replace(/^```\s*/, '').replace(/```$/, '');

    return text;
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
}