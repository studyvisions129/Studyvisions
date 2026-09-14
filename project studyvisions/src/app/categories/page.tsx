import Link from "next/link";
import { BookOpen, Beaker, Calculator, Code, Atom, Globe, Palette, Languages } from "lucide-react";

const categories = [
  {
    name: "Physics",
    icon: Atom,
    description: "Mechanics, Optics, Thermodynamics aur sab kuch",
    count: 45,
    color: "from-blue-500 to-cyan-500",
    bg: "bg-blue-50",
  },
  {
    name: "Chemistry",
    icon: Beaker,
    description: "Organic, Inorganic & Physical Chemistry notes",
    count: 38,
    color: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-50",
  },
  {
    name: "Mathematics",
    icon: Calculator,
    description: "Calculus, Algebra, Trigonometry aur more",
    count: 52,
    color: "from-purple-500 to-violet-500",
    bg: "bg-purple-50",
  },
  {
    name: "Computer Science",
    icon: Code,
    description: "Python, Java, Data Structures & Algorithms",
    count: 30,
    color: "from-amber-500 to-orange-500",
    bg: "bg-amber-50",
  },
  {
    name: "Biology",
    icon: BookOpen,
    description: "Botany, Zoology aur complete NEET prep",
    count: 41,
    color: "from-green-500 to-lime-500",
    bg: "bg-green-50",
  },
  {
    name: "English",
    icon: Languages,
    description: "Grammar, Literature & Writing Skills",
    count: 22,
    color: "from-pink-500 to-rose-500",
    bg: "bg-pink-50",
  },
  {
    name: "Social Science",
    icon: Globe,
    description: "History, Geography, Civics & Economics",
    count: 35,
    color: "from-indigo-500 to-blue-500",
    bg: "bg-indigo-50",
  },
  {
    name: "Art & Design",
    icon: Palette,
    description: "Fine Arts, Painting & Creative subjects",
    count: 15,
    color: "from-fuchsia-500 to-pink-500",
    bg: "bg-fuchsia-50",
  },
];

export default function CategoriesPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-br from-[var(--sv-secondary)] to-slate-800 hero-mesh py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
            Browse <span className="text-gradient">Categories</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Apne subject choose karo aur high-quality study materials dhundo jo tumhare exams crack karne me help karenge.
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20 bg-[var(--sv-surface-dim)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters - Board selector */}
          <div className="flex flex-wrap gap-3 mb-12">
            {["All Boards", "CBSE", "ICSE", "UP Board", "Bihar Board"].map(
              (board) => (
                <button
                  key={board}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    board === "All Boards"
                      ? "bg-[var(--sv-primary)] text-white shadow-md"
                      : "bg-white text-[var(--sv-text-muted)] hover:bg-blue-50 hover:text-[var(--sv-primary)] border border-[var(--sv-border)]"
                  }`}
                >
                  {board}
                </button>
              )
            )}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                href={`/categories/${cat.name.toLowerCase().replace(/ /g, "-")}`}
                key={cat.name}
                className="card-hover bg-white rounded-2xl border border-[var(--sv-border)] p-6 group cursor-pointer"
              >
                <div
                  className={`w-14 h-14 rounded-2xl ${cat.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                >
                  <cat.icon className={`w-7 h-7 bg-gradient-to-br ${cat.color} bg-clip-text`} style={{ color: `var(--sv-primary)` }} />
                </div>
                <h3 className="text-lg font-bold text-[var(--sv-secondary)] mb-1 group-hover:text-[var(--sv-primary)] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-sm text-[var(--sv-text-muted)] mb-4">
                  {cat.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[var(--sv-primary)] bg-blue-50 px-3 py-1 rounded-full">
                    {cat.count} Resources
                  </span>
                  <span className="text-[var(--sv-primary)] opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
