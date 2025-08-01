import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import HomePage from "./pages/Home.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";

const app = new Hono();

app.get("/", (c) => c.html(<HomePage />));

app.notFound((c) => c.html(<NotFoundPage />));

// Serve static files
// if the file is located at ./static/images/img.png, serve the file
// the file will be served at /images/img.png
app.get("*", serveStatic({ root: "./static" }))

Deno.serve(app.fetch);