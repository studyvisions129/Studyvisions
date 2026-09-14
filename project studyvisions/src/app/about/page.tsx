export default function AboutPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--sv-secondary)] mb-6">
          About <span className="text-[var(--sv-primary)]">StudyVisions</span>
        </h1>
        <p className="text-lg text-slate-600 mb-10 leading-relaxed">
          StudyVisions ek digital learning platform hai jiska maksad Indian students ko best quality study materials sabse affordable daam me provide karna hai. Humara manna hai ki har student ke paas top-class education ka access hona chahiye, chahe wo kisi bhi sheher ya gaon se ho.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mt-16">
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
            <h3 className="text-xl font-bold text-blue-900 mb-3">Our Mission</h3>
            <p className="text-blue-800/80">
              Students ke liye learning ko aasaan aur accessible banana. Quality resources ke zariye unhe exams me excel karne me help karna.
            </p>
          </div>
          <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
            <h3 className="text-xl font-bold text-amber-900 mb-3">Our Vision</h3>
            <p className="text-amber-800/80">
              India ka sabse bada aur trusted educational content marketplace banna, jahan har student apni zaroorat ka material dhund sake.
            </p>
          </div>
          <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
            <h3 className="text-xl font-bold text-emerald-900 mb-3">Our Values</h3>
            <p className="text-emerald-800/80">
              Student-first approach, quality content, affordability, aur continuous improvement humare core principles hain.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
