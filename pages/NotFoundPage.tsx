import Layout from "../layouts/BaseLayout.tsx";

export default function NotFoundPage() {
    return (
      <Layout title="Page Not Found">
          <div class="flex flex-col items-center justify-center h-screen mx-auto px-6 text-center">
              <h1 class="text-6xl font-bold mb-4">404</h1>
              <h2 class="text-2xl font-semibold mb-4">Page Not Found</h2>
              <p class="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
              <a href="/" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                Go Home
              </a>
          </div>
      </Layout>
    );
}