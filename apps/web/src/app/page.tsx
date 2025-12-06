export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <section className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            LumenForge.io
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            A comprehensive Unity development IDE running entirely in the browser
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/spark"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Try SPARK
            </a>
            <a
              href="/slate"
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              Try SLATE
            </a>
            <a
              href="/storybook"
              className="px-6 py-3 border border-gray-600 hover:border-gray-500 rounded-lg transition-colors"
            >
              View Storybook
            </a>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-8 mt-16">
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4">SPARK</h2>
            <p className="text-gray-300 mb-4">
              AI-powered component generation with engine adapters for Unity, Godot, PICO-8, and more.
            </p>
            <a href="/spark" className="text-blue-400 hover:text-blue-300">
              Learn more →
            </a>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4">SLATE</h2>
            <p className="text-gray-300 mb-4">
              Complete IDE/editor experience with code editor, preview panel, and AI assistant integration.
            </p>
            <a href="/slate" className="text-purple-400 hover:text-purple-300">
              Learn more →
            </a>
          </div>
        </section>

        <section className="mt-16 text-center">
          <p className="text-gray-400">
            Built with WIS2L Framework - Workspace, Identity, Spark, Slate, Ignis, Landing
          </p>
        </section>
      </div>
    </main>
  );
}

