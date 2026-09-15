export default function Page() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--sv-secondary)] mb-6 text-center">
          Privacy Policy
        </h1>
        <p className="text-lg text-slate-600 mb-10 text-center">
          How we handle and protect your personal data.
        </p>
        <div className="prose prose-blue max-w-none">
          <p className="text-slate-500 text-center italic">Content for this page is currently being updated. Please check back later.</p>
        </div>
      </div>
    </div>
  );
}