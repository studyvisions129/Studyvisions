export const dynamic = 'force-dynamic';
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  BookOpen,
  Zap,
  Shield,
  Star,
  ArrowRight,
  Users,
  FileText,
  Award,
  ChevronRight,
  Sparkles,
  Search,
  GraduationCap
} from "lucide-react";

/* ---------- Featured Product Card ---------- */
function ProductCard({
  title,
  slug,
  subject,
  board,
  price,
  originalPrice,
  tag,
  color,
}: {
  title: string;
  slug: string;
  subject: string;
  board: string;
  price: number;
  originalPrice: number;
  tag?: string;
  color: string;
}) {
  return (
    <div className="card-hover bg-white rounded-2xl border border-[var(--sv-border)] overflow-hidden group">
      {/* Color Top Bar */}
      <div className={`h-1.5 ${color}`} />
      <div className="p-6">
        {tag && (
          <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 text-[var(--sv-accent-dark)] mb-3">
            {tag}
          </span>
        )}
        <h3 className="text-lg font-bold text-[var(--sv-secondary)] mb-1 group-hover:text-[var(--sv-primary)] transition-colors">
          {title}
        </h3>
        <p className="text-sm text-[var(--sv-text-muted)] mb-4">
          {subject} • {board}
        </p>
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-bold text-[var(--sv-secondary)]">
            ₹{price}
          </span>
          <span className="text-sm line-through text-slate-400">
            ₹{originalPrice}
          </span>
          <span className="text-xs font-semibold text-[var(--sv-success)] ml-1">
            {Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF
          </span>
        </div>
        <Link 
          href={`/products/${slug}`}
          className="block w-full py-2.5 rounded-xl bg-[var(--sv-surface-dim)] text-[var(--sv-primary)] text-center font-semibold text-sm hover:bg-[var(--sv-primary)] hover:text-white transition-all duration-300 border border-blue-100 hover:border-transparent"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

/* ---------- Stat Counter ---------- */
function StatItem({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ElementType;
  value: string;
  label: string;
}) {
  return (
    <div className="text-center">
      <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-3 backdrop-blur-sm border border-white/10">
        <Icon className="w-7 h-7 text-[var(--sv-accent)]" />
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-slate-400">{label}</div>
    </div>
  );
}

/* ---------- Feature Card ---------- */
function FeatureCard({
  icon: Icon,
  title,
  description,
  iconBg,
  iconColor,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="card-hover p-7 bg-white rounded-2xl border border-[var(--sv-border)] group">
      <div
        className={`w-14 h-14 ${iconBg} ${iconColor} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
      >
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-bold text-[var(--sv-secondary)] mb-2">
        {title}
      </h3>
      <p className="text-[var(--sv-text-muted)] leading-relaxed">{description}</p>
    </div>
  );
}

/* ========== HOME PAGE ========== */
export default async function Home() {
  const featuredProducts = await prisma.product.findMany({
    where: {
      status: "PUBLISHED",
      isFeatured: true,
    },
    take: 4,
    include: {
      academicLevel: true,
    }
  });

  return (
    <>
      {/* 1. ANNOUNCEMENT BAR (Optional) */}
      <div className="bg-blue-600 text-white text-sm text-center py-2 font-medium">
        Welcome to StudyVisions! Get 20% off on all premium notes this week.
      </div>

      {/* 2. HERO SECTION */}
      {/* ===== NEW HERO SECTION ===== */}
      <section className="relative bg-[#F8FAFC] overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32">
        {/* Subtle Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/40 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[40%] bg-amber-100/50 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16">
          {/* Left Content */}
          <div className="lg:w-[55%] text-center lg:text-left pt-12">
            <div className="flex items-center justify-center lg:justify-start gap-3 text-xs md:text-sm font-bold tracking-[0.2em] text-slate-500 uppercase mb-6 md:mb-8">
              <span>Learn</span>
              <span className="w-1 h-1 rounded-full bg-blue-500"></span>
              <span>Create</span>
              <span className="w-1 h-1 rounded-full bg-blue-500"></span>
              <span>Grow</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-800 mb-6 leading-[1.1]">
              Learn Better.
              <br />
              <span className="text-blue-600">
                Build Your Future.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 mb-4 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Discover premium digital products designed to help you learn, prepare, improve your skills, and move forward.
            </p>
            <p className="text-base text-slate-500 mb-10 max-w-xl mx-auto lg:mx-0">
              Notes, eBooks, Courses, PYQs, Practice Materials and more — all in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Link
                href="/categories"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/20"
                id="hero-cta-explore"
              >
                Explore Digital Products
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/categories?type=free"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-xl transition-all shadow-sm"
                id="hero-cta-free"
              >
                Explore Free Resources
              </Link>
            </div>

            {/* Features Row */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-bold text-slate-700">Quality Resources</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-bold text-slate-700">Instant Access</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span className="text-sm font-bold text-slate-700">Secure Payments</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-bold text-slate-700">Trusted by Students</span>
              </div>
            </div>
          </div>

          {/* Right Visual Area */}
          <div className="lg:w-[45%] relative mt-16 lg:mt-0 hidden md:block">
            {/* Hand-drawn Text & Arrow */}
            <div className="absolute top-[-40px] right-20 z-0 text-slate-500 font-serif italic text-lg transform rotate-[-5deg]">
              Your Learning<br/>Journey Starts Here
              <svg className="w-8 h-8 absolute -bottom-6 right-8 text-slate-400 rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>

            {/* The Laptop Mockup */}
            <div className="relative z-20 w-full max-w-[600px] mx-auto">
              <div className="bg-slate-800 p-3 rounded-[2rem] rounded-b-none border-b-4 border-slate-900 shadow-2xl relative">
                <div className="bg-white rounded-xl aspect-[16/10] overflow-hidden flex flex-col items-center justify-center p-8 relative">
                  <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-red-400"></div>
                  <div className="absolute top-4 left-8 w-2 h-2 rounded-full bg-amber-400"></div>
                  <div className="absolute top-4 left-12 w-2 h-2 rounded-full bg-green-400"></div>
                  
                  <div className="flex items-center gap-2 mb-2 mt-4">
                     <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-md">
                       <GraduationCap className="w-5 h-5 text-white" />
                     </div>
                     <span className="text-xl font-bold text-slate-800 tracking-tight">StudyVisions</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-8 font-medium">Learn Better. Build Your Future.</p>
                  
                  <div className="w-full max-w-sm flex items-center bg-slate-50 border border-slate-200 rounded-lg p-1 pl-4 mb-10 shadow-sm">
                    <span className="text-xs text-slate-400 flex-1 truncate">Search for notes, eBooks, courses...</span>
                    <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center shrink-0">
                      <Search className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  <div className="flex gap-8 w-full justify-center">
                     <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600"><FileText className="w-6 h-6"/></div>
                        <span className="text-[10px] font-bold text-slate-600">Notes</span>
                     </div>
                     <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600"><BookOpen className="w-6 h-6"/></div>
                        <span className="text-[10px] font-bold text-slate-600">eBooks</span>
                     </div>
                     <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600"><GraduationCap className="w-6 h-6"/></div>
                        <span className="text-[10px] font-bold text-slate-600">Courses</span>
                     </div>
                     <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600"><FileText className="w-6 h-6"/></div>
                        <span className="text-[10px] font-bold text-slate-600">PYQs</span>
                     </div>
                  </div>
                </div>
              </div>
              <div className="h-4 w-[110%] -ml-[5%] bg-slate-300 rounded-b-xl shadow-xl border-t border-slate-400 relative">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-slate-400 rounded-b-md"></div>
              </div>
            </div>

            {/* Floating Card: Premium Notes (Top Left) */}
            <div className="absolute -left-12 top-10 z-30 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 animate-float" style={{animationDelay: '0s'}}>
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-3">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-slate-800">Premium Notes</h4>
              <p className="text-[10px] text-slate-500">Class 12 • Science</p>
            </div>

            {/* Floating Card: eBooks (Bottom Left) */}
            <div className="absolute -left-4 bottom-10 z-30 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 animate-float" style={{animationDelay: '1.5s'}}>
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-500 mb-3">
                <BookOpen className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-slate-800">eBooks</h4>
              <p className="text-[10px] text-slate-500">Exam Guides & References</p>
            </div>

            {/* Floating Card: Courses (Top Right) */}
            <div className="absolute -right-8 top-0 z-30 bg-white py-3 px-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 animate-float" style={{animationDelay: '0.7s'}}>
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-800">Courses</h4>
                <p className="text-[10px] text-slate-500">Learn at Your Pace</p>
              </div>
            </div>

            {/* Floating Card: PYQs (Middle Right) */}
            <div className="absolute -right-16 top-40 z-30 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 animate-float" style={{animationDelay: '2s'}}>
              <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 mb-3">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-slate-800">PYQs & Practice Sets</h4>
              <p className="text-[10px] text-slate-500">500+ Questions</p>
            </div>

            {/* Books stack visual at bottom right */}
            <div className="absolute -bottom-8 -right-10 z-30 flex flex-col items-end rotate-2">
              <div className="bg-blue-100 border border-blue-200 w-48 h-10 rounded-sm flex items-center px-4 shadow-sm relative z-10 translate-x-2">
                <span className="text-xs font-bold text-blue-800">Better Knowledge</span>
              </div>
              <div className="bg-white border border-slate-200 w-52 h-12 rounded-sm flex items-center px-4 shadow-md -translate-y-1">
                <span className="text-xs font-bold text-slate-600">Brighter Future</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED CATEGORIES */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800">Browse by Category</h2>
            <p className="text-slate-500 mt-2">Find exactly what you need for your exams</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {['BSEB', 'CBSE', 'BCA', 'Engineering', 'Medical', 'Competitive'].map((category) => (
              <Link key={category} href={`/categories?board=${category}`} className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all group">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors mb-3">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="font-semibold text-slate-700">{category}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. POPULAR NOTES */}
      <section className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-800">Popular Notes</h2>
              <p className="text-slate-500 mt-2">Most downloaded study materials this week</p>
            </div>
            <Link href="/categories?tag=Notes" className="text-blue-600 font-semibold hover:underline hidden sm:block">View all notes</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.filter(p => p.type === "NOTES").length > 0 ? (
              featuredProducts.filter(p => p.type === "NOTES").map((product) => (
                <ProductCard
                  key={product.id}
                  title={product.title}
                  slug={product.slug}
                  subject={product.academicLevel?.name || "General"}
                  board={product.tags.find(t => t.includes("Class")) ? `CBSE ${product.tags.find(t => t.includes("Class"))}` : "CBSE"}
                  price={Number(product.price)}
                  originalPrice={Number(product.compareAtPrice || product.price)}
                  tag={product.tags[0]}
                  color="bg-gradient-to-r from-blue-500 to-blue-600"
                />
              ))
            ) : (
               <div className="col-span-full text-center text-slate-500 py-12 border-2 border-dashed border-slate-200 rounded-2xl">
                No popular notes available yet.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. PREMIUM PRODUCTS (Featured) */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
            <div>
              <span className="inline-block text-sm font-semibold text-amber-500 uppercase tracking-wider mb-2">
                Premium Picks
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
                Premium Digital Products
              </h2>
            </div>
            <Link
              href="/categories"
              className="flex items-center gap-1 text-blue-600 font-semibold hover:gap-2 transition-all"
            >
              Explore Library
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  title={product.title}
                  slug={product.slug}
                  subject={product.academicLevel?.name || "General"}
                  board={product.tags.find(t => t.includes("Class")) ? `CBSE ${product.tags.find(t => t.includes("Class"))}` : "CBSE"}
                  price={Number(product.price)}
                  originalPrice={Number(product.compareAtPrice || product.price)}
                  tag={product.tags[0]}
                  color="bg-gradient-to-r from-purple-500 to-purple-600"
                />
              ))
            ) : (
              <div className="col-span-full text-center text-slate-500 py-12">
                No premium products found.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6. WHY CHOOSE US */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold text-[var(--sv-primary)] uppercase tracking-wider mb-3">
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--sv-secondary)] mb-4">
              Why StudyVisions?
            </h2>
            <p className="text-[var(--sv-text-muted)] max-w-2xl mx-auto text-lg">
              Hum focus karte hain best learning experience dene par, bina
              unnecessary clutter ke.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={BookOpen}
              title="High Quality Notes & eBooks"
              description="Expertly crafted study materials jo perfectly aapke syllabus aur exams ke saath align hote hain."
              iconBg="bg-blue-50"
              iconColor="text-[var(--sv-primary)]"
            />
            <FeatureCard
              icon={Zap}
              title="Fast & Simple"
              description="Koi complex setup nahi. Bas log in karo, purchase karo, aur kisi bhi device par instantly start karo."
              iconBg="bg-amber-50"
              iconColor="text-[var(--sv-accent)]"
            />
            <FeatureCard
              icon={Shield}
              title="Reliable Access"
              description="Aapki purchases securely aapke account se tied hain. Kabhi apne content ka access mat khoo."
              iconBg="bg-green-50"
              iconColor="text-[var(--sv-success)]"
            />
          </div>
        </div>
      </section>

      {/* 7. STUDENT TESTIMONIALS */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Trusted by Students
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
              Hear from thousands of students who have improved their scores with StudyVisions.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {/* Testimonial 1 */}
             <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 relative">
               <div className="flex text-amber-400 mb-4"><Star className="w-5 h-5 fill-current"/><Star className="w-5 h-5 fill-current"/><Star className="w-5 h-5 fill-current"/><Star className="w-5 h-5 fill-current"/><Star className="w-5 h-5 fill-current"/></div>
               <p className="text-slate-600 mb-6 italic">"The Class 12 Physics notes are incredible! They saved me so much time during my final revision."</p>
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">R</div>
                 <div>
                   <h4 className="font-bold text-slate-800 text-sm">Rahul K.</h4>
                   <p className="text-xs text-slate-500">CBSE Class 12</p>
                 </div>
               </div>
             </div>
             {/* Testimonial 2 */}
             <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 relative">
               <div className="flex text-amber-400 mb-4"><Star className="w-5 h-5 fill-current"/><Star className="w-5 h-5 fill-current"/><Star className="w-5 h-5 fill-current"/><Star className="w-5 h-5 fill-current"/><Star className="w-5 h-5 fill-current"/></div>
               <p className="text-slate-600 mb-6 italic">"I bought the BCA semester 3 bundle. It's exactly what I needed. Very concise and easy to understand."</p>
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">P</div>
                 <div>
                   <h4 className="font-bold text-slate-800 text-sm">Priya M.</h4>
                   <p className="text-xs text-slate-500">BCA Student</p>
                 </div>
               </div>
             </div>
             {/* Testimonial 3 */}
             <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 relative">
               <div className="flex text-amber-400 mb-4"><Star className="w-5 h-5 fill-current"/><Star className="w-5 h-5 fill-current"/><Star className="w-5 h-5 fill-current"/><Star className="w-5 h-5 fill-current"/><Star className="w-5 h-5 fill-current"/></div>
               <p className="text-slate-600 mb-6 italic">"Instant access after payment worked perfectly. I could start studying immediately before my exam."</p>
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">A</div>
                 <div>
                   <h4 className="font-bold text-slate-800 text-sm">Amit S.</h4>
                   <p className="text-xs text-slate-500">BSEB Class 10</p>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* 8. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
             {/* Simple FAQ Items (To be replaced with Accordion component later) */}
             <div className="bg-white p-6 rounded-xl border border-slate-200">
               <h3 className="font-bold text-slate-800 mb-2">Notes kaise download kare?</h3>
               <p className="text-slate-600 text-sm">Purchase karne ke baad 'My Library' section me jayein wahan aapko download ka option mil jayega.</p>
             </div>
             <div className="bg-white p-6 rounded-xl border border-slate-200">
               <h3 className="font-bold text-slate-800 mb-2">Payment safe hai?</h3>
               <p className="text-slate-600 text-sm">Haan, hum Razorpay use karte hain jo 100% secure aur encrypted transactions provide karta hai.</p>
             </div>
             <div className="bg-white p-6 rounded-xl border border-slate-200">
               <h3 className="font-bold text-slate-800 mb-2">Refund policy kya hai?</h3>
               <p className="text-slate-600 text-sm">Kyunki yeh digital products hain, hum generally refund offer nahi karte, lekin agar file me koi issue hai toh support team help karegi.</p>
             </div>
          </div>
        </div>
      </section>

      {/* 9. NEWSLETTER SECTION */}
      <section className="py-20 bg-blue-600 border-t border-blue-700 relative overflow-hidden">
         {/* Background pattern */}
         <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px'}}></div>
         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Never Miss an Update</h2>
            <p className="text-blue-100 mb-8 max-w-lg mx-auto">Latest notes aur study updates directly email par paaiye. Join our newsletter today.</p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
               <input type="email" placeholder="Enter your email address" className="flex-1 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white border-none" required />
               <button type="submit" className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors">Subscribe</button>
            </form>
         </div>
      </section>

      {/* 10. FOOTER CTA */}
      <section className="relative bg-animated-gradient hero-mesh overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            Ready to Start
            <br />
            <span className="bg-gradient-to-r from-[var(--sv-accent)] to-orange-300 bg-clip-text text-transparent">
              Your Learning Journey?
            </span>
          </h2>
          <p className="text-lg text-slate-300 mb-10 max-w-xl mx-auto">
            Join thousands of students already using StudyVisions to ace their
            exams. Sign up for free today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="btn-primary flex items-center justify-center gap-2 text-base !py-4 !px-10"
              id="cta-register"
            >
              <Sparkles className="w-5 h-5" />
              Get Started for Free
            </Link>
            <Link
              href="/categories"
              className="flex items-center justify-center gap-2 px-10 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold transition-all backdrop-blur-sm"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
