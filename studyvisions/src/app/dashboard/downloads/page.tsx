import { Download, FileText, CheckCircle2, AlertTriangle, BookOpen, Layers } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { getStudentDownloads } from "@/lib/services/download-service";
import DownloadButton from "./DownloadButton";

function formatProductType(type: string): string {
  switch (type) {
    case "PREMIUM_NOTES":
      return "Premium Notes";
    case "EBOOK":
      return "E-Book";
    case "COURSE":
    case "SKILL_COURSE":
    case "CERTIFICATE_COURSE":
      return "Course Material";
    case "PYQ_COLLECTION":
      return "PYQ Collection";
    case "PRACTICE_SET":
      return "Practice Set";
    case "QUESTION_BANK":
      return "Question Bank";
    case "STUDY_MATERIAL":
      return "Study Material";
    default:
      return type.replace(/_/g, " ");
  }
}

export default async function DownloadsPage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  let downloads: Array<Awaited<ReturnType<typeof getStudentDownloads>>[number]> = [];
  let userLoggedIn = false;

  if (session?.user?.email) {
    userLoggedIn = true;
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (dbUser) {
      downloads = await getStudentDownloads(dbUser.id);
    }
  }

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Downloads</h1>
          <p className="text-slate-500 text-sm mt-1">
            Access, view, and securely download your purchased digital study materials.
          </p>
        </div>
        {downloads.length > 0 && (
          <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3.5 py-1.5 rounded-full text-xs font-semibold self-start md:self-auto border border-blue-200">
            <Layers className="w-3.5 h-3.5" />
            <span>{downloads.length} Downloadable {downloads.length === 1 ? "Product" : "Products"}</span>
          </div>
        )}
      </div>

      {!userLoggedIn ? (
        <div className="bg-white rounded-2xl border border-[var(--sv-border)] p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4 border border-blue-100">
            <Download className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Please Sign In</h2>
          <p className="text-slate-500 mb-6 max-w-md mx-auto text-sm">
            Sign in to your StudyVisions student account to access your digital downloads and purchased study resources.
          </p>
          <Link href="/login" className="btn-primary">
            Sign In to Account
          </Link>
        </div>
      ) : downloads.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[var(--sv-border)] p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center text-purple-500 mb-6 border border-purple-100">
            <Download className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">No Downloads Available Yet</h2>
          <p className="text-slate-500 mb-8 max-w-md mx-auto text-sm leading-relaxed">
            You don&apos;t have any active downloadable purchases yet. Explore our curated library of verified notes, eBooks, and practice sets.
          </p>
          <div className="flex items-center gap-3">
            <Link href="/categories" className="btn-primary">
              Browse Study Materials
            </Link>
            <Link
              href="/dashboard/library"
              className="py-2.5 px-5 rounded-xl border border-slate-200 font-semibold text-slate-700 hover:bg-slate-50 text-sm transition-colors"
            >
              My Library
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {downloads.map((item) => {
            const formattedDate = new Intl.DateTimeFormat("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }).format(new Date(item.purchaseDate));

            return (
              <div
                key={item.purchaseId}
                className="bg-white rounded-2xl border border-[var(--sv-border)] overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail / Header */}
                  <div className="relative w-full aspect-video bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden border-b border-slate-100">
                    {item.thumbnailUrl ? (
                      <Image
                        src={item.thumbnailUrl}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-slate-400 gap-1">
                        <BookOpen className="w-9 h-9" />
                        <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                          StudyVisions Digital
                        </span>
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-2.5 right-2.5">
                      {item.isAvailable ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 backdrop-blur-sm">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Ready
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 backdrop-blur-sm">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          Pending Asset
                        </span>
                      )}
                    </div>

                    {/* Type Badge */}
                    <div className="absolute bottom-2.5 left-2.5">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 text-white backdrop-blur-sm">
                        {formatProductType(item.type)}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3">
                    <div>
                      {item.academicLevel && (
                        <p className="text-[11px] font-semibold text-blue-600 uppercase tracking-wide">
                          {item.academicLevel}
                        </p>
                      )}
                      <h3
                        className="font-bold text-slate-800 text-sm leading-snug line-clamp-2 mt-0.5"
                        title={item.title}
                      >
                        {item.title}
                      </h3>
                    </div>

                    {/* File Meta Information */}
                    <div className="bg-slate-50 rounded-xl p-2.5 text-xs text-slate-600 space-y-1.5 border border-slate-100">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Purchased On:</span>
                        <span className="font-medium text-slate-700">{formattedDate}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">File Type:</span>
                        <span className="font-medium text-slate-700 flex items-center gap-1">
                          <FileText className="w-3 h-3 text-slate-400" />
                          {item.fileType}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">File Size:</span>
                        <span className="font-medium text-slate-700">{item.fileSize}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-4 pt-0">
                  <DownloadButton
                    productId={item.productId}
                    isAvailable={item.isAvailable}
                    fileName={item.fileName}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
