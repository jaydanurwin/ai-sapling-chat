export function ChatInput({ id = "default" }: { id?: string }) {
  return (
    <sapling-island loading="visible">
      <template>
        <script type="module" src="/components/ChatInput.js"></script>
      </template>
      <div class="w-full max-w-3xl">
        <form 
          id={`chat-form-${id}`}
          hx-post="/chat"
          hx-target="#chat-messages"
          hx-swap="beforeend"
          hx-on={`htmx:afterRequest: window.clearInput?.('${id}'); window.scrollToBottom?.()`}
          class="relative bg-white rounded-3xl border border-gray-200 shadow-sm"
        >
          <input
            id={`chat-input-${id}`}
            name="message"
            type="text"
            placeholder="What do you want to know?"
            class="w-full px-6 py-6 bg-transparent rounded-3xl focus:outline-none text-black placeholder-gray-500 text-lg"
            onkeydown={`window.handleKeyDown?.(event, '${id}')`}
            oninput={`window.updateButton?.('${id}')`}
            required
          />
          <button 
            id={`chat-button-${id}`}
            type="submit"
            class="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black text-white rounded-full hover:bg-gray-800 transition-colors flex items-center justify-center"
          >
            <svg id={`mic-icon-${id}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" x2="12" y1="19" y2="22"/>
              <line x1="8" x2="16" y1="22" y2="22"/>
            </svg>
            <svg id={`send-icon-${id}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: none;">
              <line x1="22" x2="11" y1="2" y2="13"/>
              <polygon points="22,2 15,22 11,13 2,9 22,2"/>
            </svg>
          </button>
        </form>
      </div>
    </sapling-island>
  );
}