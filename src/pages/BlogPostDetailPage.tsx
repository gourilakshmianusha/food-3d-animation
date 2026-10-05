import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { BlogPost } from '../types';
import { ArrowLeft, Clock, Calendar, User, Share2, Tag, ArrowRight } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { SocialShareModal } from '../components/common/SocialShareModal';

interface BlogPostDetailPageProps {
  slug: string;
}

export const BlogPostDetailPage: React.FC<BlogPostDetailPageProps> = ({ slug }) => {
  const { navigate, showToast } = useApp();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  useEffect(() => {
    const all = api.getBlogs();
    const found = all.find((b) => b.slug === slug);
    if (found) {
      setPost(found);
      setRelated(all.filter((b) => b.id !== found.id).slice(0, 3));
    } else if (all.length > 0) {
      setPost(all[0]);
      setRelated(all.slice(1, 4));
    }
  }, [slug]);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#08090b] text-white flex items-center justify-center pt-24">
        <p className="font-serif text-xl">Loading culinary essay...</p>
      </div>
    );
  }

  const handleShare = () => {
    setShareModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#08090b] text-[#e2e8f0] pt-28 pb-24 px-6">
      <SEO
        title={post.title}
        description={post.excerpt}
        keywords={`${post.tags.join(', ')}, ${post.category}, culinary essay, The Ember Table`}
        ogImage={post.featuredImage}
        ogType="article"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.excerpt,
          image: post.featuredImage,
          datePublished: post.publishDate,
          author: {
            '@type': 'Person',
            name: post.author,
          },
          publisher: {
            '@type': 'Organization',
            name: 'The Ember Table',
            logo: {
              '@type': 'ImageObject',
              url: 'https://theembertable.com/favicon.svg',
            },
          },
        }}
      />

      <article className="max-w-4xl mx-auto space-y-10">
        <button
          onClick={() => navigate('/blog')}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-slate-400 hover:text-[#d4af37] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Hearth Chronicle</span>
        </button>

        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-xs text-[#d4af37]">
            <span className="uppercase tracking-widest font-semibold">{post.category}</span>
            <span>·</span>
            <span className="text-slate-400">{post.readTime}</span>
            <span>·</span>
            <span className="text-slate-400">{post.publishDate}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-light leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="text-white font-medium">By {post.author}</span>
              <span>·</span>
              <span>The Ember Table Culinary Brigade</span>
            </div>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded glass-dark hover:text-white transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Essay</span>
            </button>
          </div>
        </div>

        {/* Featured Banner */}
        <div className="rounded-2xl overflow-hidden glass-card p-3 border border-gold-subtle">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-80 sm:h-[480px] object-cover rounded-xl"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Content Body */}
        <div className="prose prose-invert max-w-none space-y-6 text-slate-300 text-base sm:text-lg leading-relaxed font-serif">
          {post.content.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className="leading-loose">
              {paragraph.trim()}
            </p>
          ))}
        </div>

        {/* Tags */}
        <div className="pt-8 border-t border-white/10 flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold mr-2 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Topics:</span>
          </span>
          {post.tags.map((tag, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded bg-white/5 border border-white/10 text-xs text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Related Articles */}
        <div className="pt-16 border-t border-white/10 space-y-8">
          <h3 className="font-serif text-2xl text-white font-medium">
            Further Reading from the Line
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((rel) => (
              <div
                key={rel.id}
                onClick={() => navigate(`/blog/${rel.slug}`)}
                className="glass-card rounded-xl overflow-hidden border border-white/10 p-4 group cursor-pointer hover:-translate-y-1 transition-all"
              >
                <img
                  src={rel.featuredImage}
                  alt={rel.title}
                  className="w-full h-36 object-cover rounded-lg mb-3"
                  referrerPolicy="no-referrer"
                />
                <span className="text-[10px] uppercase tracking-wider text-[#d4af37] font-semibold block mb-1">
                  {rel.category}
                </span>
                <h4 className="font-serif text-base text-white group-hover:text-[#d4af37] transition-colors line-clamp-2">
                  {rel.title}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </article>

      {/* 3D Animated Social Card Modal for Blog Article */}
      <SocialShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title={post.title.toUpperCase()}
        subtitle={`The Hearth Chronicle · By ${post.author}`}
      />
    </div>
  );
};
