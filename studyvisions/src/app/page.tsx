import Link from "next/link";
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
export default function Home() {
  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section className="relative bg-animated-gradient hero-mesh overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36 flex flex-col md:flex-row items-center gap-12">
          {/* Left Content */}
          <div className="md:w-1/2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-sm text-blue-300 mb-6 backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              India&apos;s Trusted Learning Platform
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
              Learn Better.
              <br />
              <span className="bg-gradient-to-r from-[var(--sv-accent)] to-orange-300 bg-clip-text text-transparent">
                Build Your Future.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-xl mx-auto md:mx-0 leading-relaxed">
              High-quality, affordable digital learning resources for Indian
              students. Complete your syllabus, practice tests, aur apne
              subjects master karo.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                href="/categories"
                className="btn-primary flex items-center justify-center gap-2 text-base"
                id="hero-cta-explore"
              >
                Explore Courses
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/auth/register"
                className="flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold transition-all backdrop-blur-sm"
                id="hero-cta-join"
              >
                Join for Free
              </Link>
            </div>
          </div>

          {/* Right - Hero Visual Card */}
          <div className="md:w-1/2 flex justify-center">
            <div className="animate-float glass rounded-3xl p-6 max-w-md w-full shadow-2xl">
              {/* Fake Course Card Preview */}
              <div className="bg-slate-800/80 rounded-2xl p-5 mb-4 shadow-inner">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                    Py
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">
                      Python Masterclass
                    </h3>
                    <p className="text-xs text-slate-400">
                      Class 11 & 12 • CBSE
                    </p>
                  </div>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2.5 mb-2">
                  <div
                    className="bg-gradient-to-r from-[var(--sv-accent)] to-orange-400 h-2.5 rounded-full"
                    style={{ width: "75%" }}
                  />
                </div>
                <p className="text-xs text-right text-slate-400">
                  75% Completed
                </p>
              </div>
              <div className="flex justify-between items-center px-2">
                <span className="text-sm font-medium text-slate-300">
                  Resume Learning
                </span>
                <button className="bg-white text-[var(--sv-secondary)] rounded-full w-10 h-10 flex items-center justify-center hover:bg-slate-100 transition-colors shadow-lg animate-pulse-glow">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="bg-[var(--sv-secondary)] border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatItem icon={Users} value="10,000+" label="Active Students" />
            <StatItem icon={FileText} value="500+" label="Study Resources" />
            <StatItem icon={Star} value="4.8★" label="Average Rating" />
            <StatItem icon={Award} value="50+" label="Expert Authors" />
          </div>
        </div>
      </section>

      {/* ===== WHY STUDYVISIONS ===== */}
      <section className="py-24 bg-white">
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

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="py-24 bg-[var(--sv-surface-dim)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
            <div>
              <span className="inline-block text-sm font-semibold text-[var(--sv-primary)] uppercase tracking-wider mb-2">
                Popular Picks
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--sv-secondary)]">
                Featured Products
              </h2>
            </div>
            <Link
              href="/categories"
              className="flex items-center gap-1 text-[var(--sv-primary)] font-semibold hover:gap-2 transition-all"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ProductCard
              title="Complete Physics Notes"
              slug="complete-physics-notes"
              subject="Physics"
              board="CBSE Class 12"
              price={149}
              originalPrice={499}
              tag="Bestseller"
              color="bg-gradient-to-r from-blue-500 to-blue-600"
            />
            <ProductCard
              title="Mathematics Formulae Book"
              slug="mathematics-formulae-book"
              subject="Maths"
              board="CBSE Class 11"
              price={99}
              originalPrice={299}
              tag="New"
              color="bg-gradient-to-r from-purple-500 to-purple-600"
            />
            <ProductCard
              title="Chemistry NCERT Solutions"
              slug="chemistry-ncert-solutions"
              subject="Chemistry"
              board="CBSE Class 12"
              price={129}
              originalPrice={399}
              color="bg-gradient-to-r from-emerald-500 to-emerald-600"
            />
            <ProductCard
              title="Python Programming eBook"
              slug="python-programming-ebook"
              subject="Computer Science"
              board="CBSE Class 11-12"
              price={199}
              originalPrice={599}
              tag="Popular"
              color="bg-gradient-to-r from-amber-500 to-amber-600"
            />
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
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
