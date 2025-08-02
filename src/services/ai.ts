import { GoogleGenAI } from "@google/genai";

// Initialize the AI client
const ai = new GoogleGenAI({});

// Store chat sessions in memory (in production, you'd use a database)
const chatSessions = new Map<string, any>();

export interface ChatMessage {
  role: "user" | "model";
  parts: Array<{ text: string }>;
}

// Helper function for error handling in streaming
async function* createErrorGenerator(message: string) {
  yield message;
}

export class AIService {
  private static getSessionId(): string {
    // For now, use a single session. In production, you'd use user IDs or session tokens
    return "default-session";
  }

  static async sendMessage(userMessage: string): Promise<string> {
    try {
      const sessionId = this.getSessionId();
      
      // Get or create chat session
      let chat = chatSessions.get(sessionId);
      
      if (!chat) {
        // Create new chat with initial history
        chat = ai.chats.create({
          model: "gemini-2.5-flash-lite",
          history: [
            {
              role: "user",
              parts: [{ text: "Hello! I'm here to chat with you." }],
            },
            {
              role: "model",
              parts: [{ text: "Hello! I'm an AI assistant. I'm here to help answer your questions and have a conversation with you. What would you like to talk about?" }],
            },
          ],
        });
        chatSessions.set(sessionId, chat);
      }

      // Send message and get response
      const result = await chat.sendMessage({
        message: userMessage
      });

      console.log("AI Result:", result); // Debug log
      
      // Try different properties that might contain the text
      if (typeof result === 'string') {
        return result;
      } else if (result.text) {
        return result.text;
      } else if (result.content) {
        return result.content;
      } else if (result.response) {
        return result.response;
      } else {
        console.log("Unknown result format:", JSON.stringify(result));
        return "Sorry, I received an unexpected response format.";
      }
    } catch (error) {
      console.error("AI Service Error:", error);
      return "I'm sorry, I'm having trouble responding right now. Please try again.";
    }
  }

  static async sendMessageStream(userMessage: string): Promise<AsyncGenerator<string, void, unknown>> {
    const sessionId = this.getSessionId();
    
    try {
      // Get or create chat session
      let chat = chatSessions.get(sessionId);
      
      if (!chat) {
        chat = ai.chats.create({
          model: "gemini-2.5-flash",
          history: [
            {
              role: "user",
              parts: [{ text: "Hello! I'm here to chat with you." }],
            },
            {
              role: "model",
              parts: [{ text: "Hello! I'm an AI assistant. I'm here to help answer your questions and have a conversation with you. What would you like to talk about?" }],
            },
          ],
        });
        chatSessions.set(sessionId, chat);
      }

      // Send message and get streaming response
      const stream = await chat.sendMessageStream({
        message: userMessage
      });
      
      // Create a proper async generator that extracts text from chunks
      async function* processStream() {
        try {
          for await (const chunk of stream) {
            console.log("Raw chunk:", chunk); // Debug log
            
            // Try different properties that might contain the text
            if (typeof chunk === 'string') {
              yield chunk;
            } else if (chunk.text) {
              yield chunk.text;
            } else if (chunk.content) {
              yield chunk.content;
            } else if (chunk.delta) {
              yield chunk.delta;
            } else {
              console.log("Unknown chunk format:", JSON.stringify(chunk));
              yield JSON.stringify(chunk); // Fallback to show what we got
            }
          }
        } catch (streamError) {
          console.error("Stream processing error:", streamError);
          yield "Error processing stream.";
        }
      }
      
      return processStream();
    } catch (error) {
      console.error("AI Streaming Error:", error);
      return createErrorGenerator("I'm sorry, I'm having trouble responding right now. Please try again.");
    }
  }

  static clearSession(): void {
    const sessionId = this.getSessionId();
    chatSessions.delete(sessionId);
  }
}