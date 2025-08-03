# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development**: `npm run dev` - Starts development server with CSS watching and TypeScript compilation
- **CSS Development**: `npm run dev:css` - Watches and compiles Tailwind CSS
- **Server Development**: `npm run dev:sapling` - Runs TypeScript server with tsx watch
- **Build**: `npm run build` - Builds CSS and TypeScript, copies static files to dist/
- **Production**: `npm start` - Runs the built application in production mode
- **Clean**: `npm run clean` - Removes the dist directory

The application runs on http://localhost:8080 by default.

## Architecture Overview

This is a real-time chat application built with:

**Core Technologies:**
- **Hono**: Web framework for the server (src/index.tsx)
- **Sapling**: Component framework for SSR with islands architecture
- **Google Generative AI**: AI service integration for chat responses
- **TypeScript**: Full TypeScript implementation
- **Tailwind CSS**: Utility-first CSS framework

**Key Architecture Patterns:**

1. **Server-Side Rendering with Islands**: Uses Sapling framework for SSR with selective client-side hydration via `<sapling-island>` components

2. **Real-time Streaming**: Implements Server-Sent Events (SSE) for streaming AI responses:
   - Chat messages trigger SSE streams at `/chat/stream/:sessionId`
   - Client-side JavaScript handles progressive content updates
   - Markdown rendering with `marked.js` library

3. **HTMX Integration**: Uses HTMX for seamless form submissions and DOM updates without page refreshes

4. **Session Management**: In-memory chat session storage (not persistent) in AIService

**File Structure:**
- `src/index.tsx`: Main server entry point with Hono routes
- `src/services/ai.ts`: Google AI integration with streaming support
- `src/layouts/Layout.tsx`: Base layout wrapper using Sapling
- `src/pages/Home.tsx`: Main chat interface with dynamic UI states
- `src/components/ChatInput.tsx`: Reusable chat input component
- `static/components/`: Client-side JavaScript for interactive components

**API Endpoints:**
- `GET /`: Home page
- `POST /chat`: Chat message submission (returns HTML response)
- `GET /chat/stream/:sessionId`: SSE endpoint for streaming AI responses

**Environment Requirements:**
- Requires Google AI API credentials (configured via environment variables)
- Uses dotenv for environment variable management

**UI Behavior:**
- Initially shows welcome screen with floating input
- Transitions to chat view after first message
- Real-time typing indicators and progressive message rendering
- Auto-scrolling chat interface

The application demonstrates modern web patterns with SSR, progressive enhancement, and real-time features while maintaining a simple, focused chat interface.