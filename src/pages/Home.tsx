import Layout from "../layouts/Layout.tsx";
import { ChatInput } from "../components/ChatInput.tsx";

export function Home() {
  return (
    <Layout>
      <main class="h-screen bg-gray-50 flex flex-col font-sans overflow-hidden">
        {/* Header - shown when no messages */}
        <div id="welcome-header" class="flex-1 flex flex-col items-center justify-center px-4">
          <div class="w-full max-w-4xl mx-auto flex flex-col items-center gap-8">
            <div class="flex items-center gap-3 mb-8">
              <div class="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <div class="w-6 h-6 border-2 border-white rounded-full"></div>
              </div>
              <h1 class="text-5xl font-normal text-black">Sapling Chat</h1>
            </div>
            
            <p class="text-sm text-gray-500 text-center mt-8">
              By messaging Sapling Chat, you agree to our Terms and Privacy Policy.
            </p>
          </div>
        </div>

        {/* Chat view - shown when there are messages */}
        <div id="chat-view" class="hidden h-full flex flex-col">
          <div class="flex items-center gap-3 p-4 border-b border-gray-200 bg-white flex-shrink-0">
            <div class="w-6 h-6 bg-black rounded-full flex items-center justify-center">
              <div class="w-4 h-4 border-2 border-white rounded-full"></div>
            </div>
            <h1 class="text-2xl font-normal text-black">Sapling Chat</h1>
          </div>
          
          <div class="flex-1 overflow-y-auto p-4">
            <div id="chat-messages" class="max-w-3xl mx-auto space-y-4">
              {/* Messages will be inserted here by HTMX */}
            </div>
          </div>
          
          <div class="p-4 border-t border-gray-200 bg-white flex-shrink-0">
            <div class="max-w-3xl mx-auto">
              <ChatInput id="chat" />
            </div>
          </div>
        </div>
        
        {/* Floating input - shown initially */}
        <div id="floating-input" class="fixed bottom-0 left-0 right-0 p-4 bg-gray-50">
          <div class="max-w-3xl mx-auto">
            <ChatInput id="floating" />
          </div>
        </div>

        <script dangerouslySetInnerHTML={{
          __html: `
            // Show chat view when first message is sent
            document.body.addEventListener('htmx:afterRequest', function(evt) {
              if (evt.detail.xhr.status === 200 && evt.detail.target.id === 'chat-messages') {
                // Hide welcome header and floating input
                document.getElementById('welcome-header').style.display = 'none';
                document.getElementById('floating-input').style.display = 'none';
                
                // Show chat view
                document.getElementById('chat-view').classList.remove('hidden');
                document.getElementById('chat-view').classList.add('flex');
                
                // Scroll to bottom of chat area
                setTimeout(() => {
                  const chatContainer = document.querySelector('#chat-view .overflow-y-auto');
                  if (chatContainer) {
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                  }
                }, 50);
              }
            });
          `
        }}></script>
      </main>
    </Layout>
  );
}
