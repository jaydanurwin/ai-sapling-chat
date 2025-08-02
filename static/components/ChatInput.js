window.handleKeyDown = (event, id = "default") => {
  if (event.key === "Enter") {
    event.preventDefault();
    const form = document.getElementById(`chat-form-${id}`);
    if (form) {
      htmx.trigger(form, "submit");
    }
  }
};

window.updateButton = (id = "default") => {
  const input = document.getElementById(`chat-input-${id}`);
  const micIcon = document.getElementById(`mic-icon-${id}`);
  const sendIcon = document.getElementById(`send-icon-${id}`);
  
  if (input && micIcon && sendIcon) {
    const hasText = input.value.trim().length > 0;
    
    if (hasText) {
      micIcon.style.display = "none";
      sendIcon.style.display = "block";
    } else {
      micIcon.style.display = "block";
      sendIcon.style.display = "none";
    }
  }
};

window.clearInput = (id = "default") => {
  const input = document.getElementById(`chat-input-${id}`);
  if (input) {
    input.value = "";
    window.updateButton(id);
  }
};

window.scrollToBottom = () => {
  setTimeout(() => {
    const chatContainer = document.querySelector('#chat-view .overflow-y-auto');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, 100);
};