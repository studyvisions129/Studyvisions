import Image from "next/image";
import Link from "next/link";
import { 
  BookOpen, 
  FileText, 
  GraduationCap, 
  Search, 
  Users, 
  Star, 
  ShieldCheck 
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ===== HERO IMAGE (USER PROVIDED) ===== */}
      <section className="w-full">
        <Image 
          src="/images/about-hero-full.png" 
          alt="About StudyVisions Hero"
          width={1920}
          height={800}
          className="w-full h-auto object-contain"
          priority
        />
      </section>

      {/* ===== MAIN CONTENT GRID ===== */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          
          {/* Section: What Is StudyVisions? */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-4 lg:sticky lg:top-24">
              <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4">What Is StudyVisions?</h2>
              <p className="text-xl text-blue-600 font-medium">More Than Just Learning Resources</p>
            </div>
            <div className="lg:col-span-8 prose prose-lg prose-slate max-w-none text-slate-600">
              <p>StudyVisions is a digital platform created to bring useful learning resources and digital products closer to the people who need them.</p>
              <p>Learning today is no longer limited to classrooms or textbooks. Students and learners need accessible, well-organized resources that can help them understand concepts, prepare effectively, develop skills, and continue learning at their own pace.</p>
              <p>StudyVisions aims to make that experience simpler by bringing carefully selected and thoughtfully created digital products together in one place.</p>
              <p>Whether you are looking for concise Notes, detailed eBooks, structured Courses, previous-year questions, Practice Materials, or other useful digital resources, StudyVisions is designed to help you find what you need and move forward with confidence.</p>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section: Mission & Vision */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="bg-blue-50 p-10 rounded-3xl border border-blue-100">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Our Mission</h2>
              <p className="text-lg text-blue-600 font-medium mb-6">Making Learning More Accessible</p>
              <p className="text-slate-700 leading-relaxed mb-6">
                Our mission is simple: to make useful, quality digital learning resources easier to discover, access, and use. We believe good learning resources should be:
              </p>
              <ul className="space-y-2 text-slate-700 font-medium list-disc pl-5">
                <li>Easy to understand</li>
                <li>Convenient to access</li>
                <li>Well organized</li>
                <li>Purpose-driven</li>
                <li>Worth the learner's time</li>
              </ul>
              <p className="text-slate-700 leading-relaxed mt-6">
                Through StudyVisions, we want to create a platform where learners can discover resources that genuinely support their learning journey.
              </p>
            </div>

            <div className="bg-amber-50 p-10 rounded-3xl border border-amber-100">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Our Vision</h2>
              <p className="text-lg text-amber-600 font-medium mb-6">A Better Way to Learn, Discover & Grow</p>
              <p className="text-slate-700 leading-relaxed mb-6">
                Our vision is to build a trusted digital platform where people can discover quality resources that help them learn better, develop valuable skills, and build a better future.
              </p>
              <p className="text-slate-700 leading-relaxed mb-6">
                StudyVisions is designed to grow beyond a single type of educational product.
              </p>
              <p className="text-slate-700 leading-relaxed">
                As the platform evolves, we aim to bring together a broader range of useful digital products and learning experiences while keeping the experience simple, reliable, and learner-focused.
              </p>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section: What You'll Find */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-4 lg:sticky lg:top-24">
              <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4">What You'll Find on StudyVisions</h2>
              <p className="text-xl text-blue-600 font-medium">Everything You Need to Learn & Grow</p>
            </div>
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-2xl mb-4">📘</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Notes</h3>
                  <p className="text-slate-600 mb-4">Clear, focused, and easy-to-use study resources designed to make learning and revision more convenient.</p>
                  <Link href="/categories?tag=Notes" className="text-blue-600 font-semibold hover:underline flex items-center gap-1">Explore Notes →</Link>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-2xl mb-4">📚</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">eBooks</h3>
                  <p className="text-slate-600 mb-4">Detailed digital books, guides, and reference materials for deeper learning and exploration.</p>
                  <Link href="/categories?tag=eBooks" className="text-blue-600 font-semibold hover:underline flex items-center gap-1">Explore eBooks →</Link>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-2xl mb-4">🎓</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Courses</h3>
                  <p className="text-slate-600 mb-4">Structured learning experiences designed to help learners understand concepts and develop useful skills.</p>
                  <Link href="/categories?tag=Courses" className="text-blue-600 font-semibold hover:underline flex items-center gap-1">Explore Courses →</Link>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-2xl mb-4">📝</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">PYQs & Practice</h3>
                  <p className="text-slate-600 mb-4">Previous-year questions, practice sets, and other resources to help learners practice with greater confidence.</p>
                  <Link href="/categories?tag=PYQs" className="text-blue-600 font-semibold hover:underline flex items-center gap-1">Explore Practice →</Link>
                </div>

              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section: Why StudyVisions & How it Works */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Why StudyVisions?</h2>
              <p className="text-lg text-blue-600 font-medium mb-8">Built Around What Learners Need</p>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-bold text-slate-800 mb-1">Quality First</h4>
                  <p className="text-slate-600">We focus on creating and offering digital resources that are useful, organized, and designed with the learner in mind.</p>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-800 mb-1">Simple Experience</h4>
                  <p className="text-slate-600">Finding, choosing, purchasing, and accessing digital products should not feel complicated. We aim to keep the experience straightforward.</p>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-800 mb-1">Learn at Your Own Pace</h4>
                  <p className="text-slate-600">Digital learning gives you the flexibility to learn whenever and wherever it works for you.</p>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-800 mb-1">Instant Digital Access</h4>
                  <p className="text-slate-600">After a successful purchase, eligible digital products can be accessed conveniently through your StudyVisions account.</p>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-800 mb-1">Secure & Reliable</h4>
                  <p className="text-slate-600">We are committed to providing a secure platform, protected digital access, and reliable purchasing experiences.</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-10 rounded-3xl border border-slate-200">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-2">How StudyVisions Works</h2>
              <p className="text-lg text-blue-600 font-medium mb-8">Discover. Choose. Learn.</p>
              
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-blue-100 text-blue-600 font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">01</div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
                    <h4 className="font-bold text-slate-800">Discover</h4>
                    <p className="text-sm text-slate-600">Explore Notes, eBooks, Courses, PYQs, and other digital products.</p>
                  </div>
                </div>
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-blue-100 text-blue-600 font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">02</div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
                    <h4 className="font-bold text-slate-800">Choose</h4>
                    <p className="text-sm text-slate-600">Find the resource that matches your learning goals and requirements.</p>
                  </div>
                </div>
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-blue-100 text-blue-600 font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">03</div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
                    <h4 className="font-bold text-slate-800">Purchase</h4>
                    <p className="text-sm text-slate-600">Complete your purchase through our secure payment process.</p>
                  </div>
                </div>
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-blue-100 text-blue-600 font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">04</div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
                    <h4 className="font-bold text-slate-800">Access</h4>
                    <p className="text-sm text-slate-600">Access your purchased digital product through your StudyVisions account.</p>
                  </div>
                </div>
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-blue-100 text-blue-600 font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">05</div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
                    <h4 className="font-bold text-slate-800">Learn & Grow</h4>
                    <p className="text-sm text-slate-600">Use your resources at your own pace and keep moving toward your goals.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section: Our Commitment */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-4 lg:sticky lg:top-24">
              <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4">Our Commitment</h2>
              <p className="text-xl text-blue-600 font-medium">We Care About the Experience Behind Every Product</p>
            </div>
            <div className="lg:col-span-8 prose prose-lg prose-slate max-w-none text-slate-600">
              <p>At StudyVisions, we believe that selling a digital product is not just about providing a file or course. It is about providing something that is genuinely useful to the person who chooses to spend their time and money on it.</p>
              <p>That is why we aim to maintain:</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                <div className="bg-white p-5 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-1 mt-0">Useful Content</h4>
                  <p className="text-sm m-0">Resources should have a clear purpose and provide meaningful value.</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-1 mt-0">Clear Information</h4>
                  <p className="text-sm m-0">Product descriptions, pricing, features, and access information should be presented clearly.</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-1 mt-0">Reliable Access</h4>
                  <p className="text-sm m-0">Purchased digital products should be accessible according to their applicable terms.</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-1 mt-0">Transparent Policies</h4>
                  <p className="text-sm m-0">Our terms, privacy practices, refund policies, and other important information should remain clear and accessible.</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 sm:col-span-2">
                  <h4 className="font-bold text-slate-900 mb-1 mt-0">Continuous Improvement</h4>
                  <p className="text-sm m-0">We will continue improving our products, platform, and user experience based on feedback and real-world learning.</p>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section: Quality & Copyright */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Quality Standards</h2>
              <p className="text-lg text-blue-600 font-medium mb-6">Quality Matters</p>
              <p className="text-slate-700 leading-relaxed mb-6">Every digital product represents the StudyVisions brand. Where applicable, products go through appropriate checks for:</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {["Content quality", "Accuracy", "Readability", "Formatting", "File integrity", "Product information", "Categorization", "Version information"].map((tag) => (
                  <span key={tag} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium">{tag}</span>
                ))}
              </div>
              <p className="text-slate-700 leading-relaxed font-medium">Our goal is not simply to offer more products, but to build a collection of resources that learners can confidently explore.</p>
            </div>

            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Originality & Copyright</h2>
              <p className="text-lg text-blue-600 font-medium mb-6">Respecting Content & Intellectual Property</p>
              <p className="text-slate-700 leading-relaxed mb-4">StudyVisions respects copyright, intellectual property, and the rights of content creators.</p>
              <p className="text-slate-700 leading-relaxed mb-4">Products offered through the platform should be original, properly licensed, or otherwise legally authorized for distribution. We do not support the unauthorized distribution or sale of copyrighted content.</p>
              <p className="text-slate-700 leading-relaxed mb-6">If you believe that content available on StudyVisions infringes your intellectual property rights, an appropriate copyright complaint process will be available to help address the issue.</p>
              <Link href="/privacy" className="text-blue-600 font-semibold hover:underline">Learn More About Our Copyright Policy →</Link>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section: Built for Different Learning Goals */}
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4">Built for Different Learning Goals</h2>
            <p className="text-xl text-blue-600 font-medium mb-12">One Platform. Different Ways to Learn.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-left">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Students</h3>
                <p className="text-slate-600">Find Notes, PYQs, Practice Materials, and other resources for academic learning and preparation.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Exam Aspirants</h3>
                <p className="text-slate-600">Access focused resources that can support structured preparation and revision.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Skill Learners</h3>
                <p className="text-slate-600">Explore Courses, eBooks, guides, and other resources for developing useful skills.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Self-Learners</h3>
                <p className="text-slate-600">Learn independently with digital resources that fit your own pace and schedule.</p>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section: Meet the Founder & Approach */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-6 bg-slate-900 text-white p-10 rounded-3xl relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-3xl font-extrabold mb-2">Meet the Founder</h2>
                <p className="text-blue-400 font-medium mb-8">The Idea Behind StudyVisions</p>
                <p className="text-slate-300 leading-relaxed mb-6">
                  StudyVisions began with a simple idea: make useful digital learning resources easier for people to discover and access. The platform is being built with a long-term vision of creating a trusted digital ecosystem where learning resources and useful digital products can come together in one place.
                </p>
                <blockquote className="border-l-4 border-blue-500 pl-4 py-1 mb-8 italic text-slate-200">
                  “I believe learning becomes more powerful when the right resources are accessible at the right time. StudyVisions is being built to make that experience simpler, more useful, and more accessible.”
                </blockquote>
                <div>
                  <h4 className="font-bold text-lg">Manish Kumar Prasad</h4>
                  <p className="text-sm text-slate-400">Founder, StudyVisions</p>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            </div>

            <div className="lg:col-span-6 space-y-12">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Our Approach</h2>
                <p className="text-lg text-blue-600 font-medium mb-6">Simple. Useful. Learner-Focused.</p>
                <p className="text-slate-700 leading-relaxed mb-6">We believe a good digital platform does not need to be complicated. Our approach is based on three principles:</p>
                <ul className="space-y-4">
                  <li className="flex gap-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold shrink-0">1</span>
                    <div>
                      <strong className="block text-slate-900">Discover Easily</strong>
                      <span className="text-slate-600">Help users find relevant products without unnecessary complexity.</span>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold shrink-0">2</span>
                    <div>
                      <strong className="block text-slate-900">Learn Effectively</strong>
                      <span className="text-slate-600">Provide resources that are organized around real learning needs.</span>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold shrink-0">3</span>
                    <div>
                      <strong className="block text-slate-900">Move Forward</strong>
                      <span className="text-slate-600">Make digital resources useful beyond a single purchase or learning session.</span>
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Transparency</h2>
                <p className="text-lg text-blue-600 font-medium mb-4">Everything You Need to Know</p>
                <p className="text-slate-700 leading-relaxed mb-4">We believe trust starts with transparency. You can learn more about how StudyVisions works through:</p>
                <div className="flex flex-wrap gap-3 mb-4">
                  <Link href="/terms" className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors">Terms & Conditions</Link>
                  <Link href="/privacy" className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors">Privacy Policy</Link>
                  <Link href="/refund-policy" className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors">Refund Policy</Link>
                  <Link href="/contact" className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors">Contact Us</Link>
                </div>
                <p className="text-sm text-slate-500 italic">All important policies should remain easily accessible throughout the website.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ===== FINAL CTA SECTION ===== */}
      <section className="bg-gradient-to-br from-blue-900 to-slate-900 py-24 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Ready to Learn Better?</h2>
          <p className="text-xl text-blue-200 mb-10 max-w-2xl mx-auto">
            Discover digital resources designed to help you learn, improve, and build your future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/categories"
              className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-all shadow-lg"
            >
              Explore Digital Products →
            </Link>
            <Link
              href="/categories?type=free"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl transition-all backdrop-blur-sm"
            >
              Explore Free Resources →
            </Link>
          </div>
          
          <div className="pt-16 border-t border-white/10">
            <div className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
              <GraduationCap className="w-8 h-8" />
              StudyVisions
            </div>
            <p className="text-blue-300 font-medium mb-1">Learn Better. Build Your Future.</p>
            <p className="text-slate-400 text-sm">Discover. Learn. Grow.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
