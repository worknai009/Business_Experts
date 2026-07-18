import { ArrowLeft, CalendarDays, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiGet, formatDate, type BlogPost } from "../api";
import { Img } from "../components/Cards";
import Reveal from "../components/Reveal";
import RichText from "../components/RichText";
import { useSeo } from "../context/SiteContext";

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [missing, setMissing] = useState(false);
  useSeo(post?.seoTitle || post?.title || "Article", post?.seoDescription || post?.excerpt);

  useEffect(() => {
    setPost(null);
    setMissing(false);
    apiGet<BlogPost>(`/blogs/${slug}`)
      .then(setPost)
      .catch(() => setMissing(true));
  }, [slug]);

  if (missing) {
    return (
      <div className="container-x py-24 text-center">
        <h1 className="text-2xl font-bold">Article not found</h1>
        <Link to="/blog" className="btn-primary mt-6">Back to blog</Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <div className="size-10 animate-spin rounded-full border-4 border-brand-soft border-t-brand" />
      </div>
    );
  }

  return (
    <article className="section-pad">
      <div className="container-x max-w-3xl">
        <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
          <ArrowLeft className="size-4" /> All articles
        </Link>
        <Reveal className="mt-6">
          <span className="eyebrow">{post.category || "Insights"}</span>
          <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight md:text-4xl">{post.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
            {post.author ? (
              <span className="inline-flex items-center gap-1.5">
                <UserRound className="size-4 text-brand" /> {post.author}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4 text-brand" /> {formatDate(post.publishDate)}
            </span>
          </div>
        </Reveal>
        <Reveal className="mt-8">
          <Img src={post.banner} alt={post.title} className="aspect-video w-full rounded-2xl object-cover shadow-xl" />
        </Reveal>
        <Reveal className="mt-10">
          <RichText text={post.content || post.excerpt} />
        </Reveal>
        {post.tags?.length ? (
          <div className="mt-10 flex flex-wrap gap-2 border-t border-slate-100 pt-6">
            {post.tags.map((tag) => (
              <span key={tag} className="chip bg-slate-100 text-slate-600">#{tag}</span>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}
