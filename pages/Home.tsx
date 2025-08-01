import Layout from "../layouts/BaseLayout.tsx";
import WavingHand from "../components/WavingHand.tsx";
import { Counter } from "../components/Counter.tsx";

export default function HomePage() {
  return (
    <Layout title="Home">
      <div class="flex flex-col items-center justify-center h-screen mx-auto px-6">
        <h1 class="text-4xl font-bold">
          Hello World <WavingHand />
        </h1>
        <Counter />
      </div>
    </Layout>
  );
}
