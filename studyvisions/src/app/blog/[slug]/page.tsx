import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: { author: true }
  });

  if (!post || !post.isPublished) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/blog" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>
        
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          {post.thumbnailUrl && (
            <div className="w-full h-[400px] relative bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.thumbnailUrl} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}
          
          <div className="p-8 md:p-12">
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 mb-8 pb-8 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(post.createdAt).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {post.author?.fullName || 'StudyVisions Team'}
              </div>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-8">
              {post.title}
            </h1>
            
            <div className="prose prose-lg prose-blue max-w-none text-slate-700" dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        </div>
      </article>
    </div>
  );
}
