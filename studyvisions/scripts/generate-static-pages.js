const fs = require('fs');
const path = require('path');

const pages = [
  { dir: 'contact', title: 'Contact Us', desc: 'Get in touch with the StudyVisions team.' },
  { dir: 'faq', title: 'Frequently Asked Questions', desc: 'Find answers to common queries about our platform.' },
  { dir: 'refund-policy', title: 'Refund Policy', desc: 'Information about our refund and cancellation policies.' },
  { dir: 'privacy', title: 'Privacy Policy', desc: 'How we handle and protect your personal data.' },
  { dir: 'terms', title: 'Terms & Conditions', desc: 'The rules and guidelines for using StudyVisions.' }
];

const template = (title, desc) => `export default function Page() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--sv-secondary)] mb-6 text-center">
          ${title}
        </h1>
        <p className="text-lg text-slate-600 mb-10 text-center">
          ${desc}
        </p>
        <div className="prose prose-blue max-w-none">
          <p className="text-slate-500 text-center italic">Content for this page is currently being updated. Please check back later.</p>
        </div>
      </div>
    </div>
  );
}`;

pages.forEach(page => {
  const dirPath = path.join(__dirname, '../src/app', page.dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  fs.writeFileSync(path.join(dirPath, 'page.tsx'), template(page.title, page.desc));
});

console.log('Pages generated successfully!');
