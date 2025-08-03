import "dotenv/config";
import { Hono, type Context } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import NotFoundLayout from "./layouts/NotFoundLayout.tsx";
import { Home } from "./pages/Home.tsx";
import { AIService } from "./services/ai.ts";


const site = new Hono();

// Home page
site.get("/", (c: Context) => c.html(<Home />));


// SSE streaming endpoint for AI responses
site.get("/chat/stream/:sessionId", async (c: Context) => {
  const sessionId = c.req.param('sessionId');
  const message = c.req.query('message');
  
  if (!message) {
    return c.text("Message required", 400);
  }

  // Set SSE headers
  c.header('Content-Type', 'text/event-stream');
  c.header('Cache-Control', 'no-cache');
  c.header('Connection', 'keep-alive');
  c.header('Access-Control-Allow-Origin', '*');

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      
      try {
        // Send start event
        controller.enqueue(encoder.encode(`event: start\ndata: ${JSON.stringify({ type: 'start' })}\n\n`));
        
        // Get streaming AI response
        const aiStream = await AIService.sendMessageStream(message);
        let accumulatedText = "";
        
        for await (const chunk of aiStream) {
          accumulatedText += chunk;
          
          // Send each chunk
          const data = {
            type: 'chunk',
            content: chunk,
            accumulated: accumulatedText
          };
          
          controller.enqueue(encoder.encode(`event: chunk\ndata: ${JSON.stringify(data)}\n\n`));
        }
        
        // Send completion event
        controller.enqueue(encoder.encode(`event: complete\ndata: ${JSON.stringify({ 
          type: 'complete', 
          content: accumulatedText 
        })}\n\n`));
        
      } catch (error) {
        console.error("Streaming error:", error);
        const errorData = {
          type: 'error',
          content: "Sorry, I'm having trouble responding right now."
        };
        controller.enqueue(encoder.encode(`event: error\ndata: ${JSON.stringify(errorData)}\n\n`));
      }
      
      controller.close();
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    }
  });
});

// Chat message route - now initiates streaming
site.post("/chat", async (c: Context) => {
  const body = await c.req.parseBody();
  const message = body.message as string;
  
  if (!message?.trim()) {
    return c.html(<div></div>);
  }
  
  const responseId = `response-${Date.now()}`;
  const sessionId = `session-${Date.now()}`;
  
  try {
    // Return user message and AI response container
    return c.html(
      <>
        <div class="flex justify-end">
          <div class="bg-black text-white px-4 py-2 rounded-2xl max-w-xs break-words">
            {message}
          </div>
        </div>
        <div class="flex justify-start">
          <div 
            id={responseId} 
            class="bg-gray-100 text-black px-4 py-2 rounded-2xl max-w-xs break-words prose"
            data-session={sessionId}
            data-message={message}
          >
            <div class="typing-indicator">
              <span class="animate-pulse">●</span>
              <span class="animate-pulse animation-delay-200">●</span>
              <span class="animate-pulse animation-delay-400">●</span>
            </div>
          </div>
        </div>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const responseElement = document.getElementById('${responseId}');
              const sessionId = responseElement.getAttribute('data-session');
              const message = responseElement.getAttribute('data-message');
              
              // Start SSE connection
              const eventSource = new EventSource('/chat/stream/' + sessionId + '?message=' + encodeURIComponent(message));
              
              eventSource.addEventListener('start', function(e) {
                // Clear typing indicator when stream starts
                responseElement.innerHTML = '';
              });
              
              eventSource.addEventListener('chunk', function(e) {
                const data = JSON.parse(e.data);
                
                // Update content with accumulated text, converted from markdown
                if (typeof marked !== 'undefined') {
                  responseElement.innerHTML = marked.parse(data.accumulated);
                } else {
                  responseElement.textContent = data.accumulated;
                }
                
                // Auto-scroll to bottom
                setTimeout(() => {
                  const chatContainer = document.querySelector('#chat-view .overflow-y-auto');
                  if (chatContainer) {
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                  }
                }, 10);
              });
              
              eventSource.addEventListener('complete', function(e) {
                const data = JSON.parse(e.data);
                
                // Final render with complete content
                if (typeof marked !== 'undefined') {
                  responseElement.innerHTML = marked.parse(data.content);
                } else {
                  responseElement.textContent = data.content;
                }
                
                eventSource.close();
                
                // Final scroll
                setTimeout(() => {
                  const chatContainer = document.querySelector('#chat-view .overflow-y-auto');
                  if (chatContainer) {
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                  }
                }, 10);
              });
              
              eventSource.addEventListener('error', function(e) {
                const data = JSON.parse(e.data);
                responseElement.innerHTML = '<span class="text-red-600">' + data.content + '</span>';
                eventSource.close();
              });
              
              // Handle connection errors
              eventSource.onerror = function(e) {
                console.error('SSE connection error:', e);
                responseElement.innerHTML = '<span class="text-red-600">Connection error. Please try again.</span>';
                eventSource.close();
              };
            })();
          `
        }}></script>
      </>
    );
  } catch (error) {
    console.error("Chat error:", error);
    return c.html(
      <>
        <div class="flex justify-end">
          <div class="bg-black text-white px-4 py-2 rounded-2xl max-w-xs break-words">
            {message}
          </div>
        </div>
        <div class="flex justify-start">
          <div class="bg-red-100 text-red-800 px-4 py-2 rounded-2xl max-w-xs break-words">
            Sorry, I'm having trouble responding right now. Please try again.
          </div>
        </div>
      </>
    );
  }
});

// Enter additional routes here

// Serve static files
// The location of this is important. It should be the last route you define.
site.get("*", serveStatic({ root: "./static" }));

// 404 Handler
site.notFound((c: Context) => c.html(<NotFoundLayout />));

const port = 8080;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: site.fetch,
  port,
});

