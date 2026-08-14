"use client";

import React, { useState, useEffect } from 'react';
import { decodeHtml } from '@/lib/wp';

interface Comment {
  id: number;
  author_name: string;
  date: string;
  content: { rendered: string };
  author_avatar_urls?: { [key: string]: string };
}

export default function Comments({ postId }: { postId: number }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

  // Fetch comments on load
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`https://premierleaguenewsnow.com/wp-json/wp/v2/comments?post=${postId}&order=asc`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (error) {
        console.error("Failed to fetch comments", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchComments();
  }, [postId]);

  // Handle Comment Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage({ type: '', text: '' });

    try {
      const res = await fetch('https://premierleaguenewsnow.com/wp-json/wp/v2/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post: postId,
          author_name: name,
          author_email: email,
          content: content,
        }),
      });

      if (res.ok) {
        setSubmitMessage({ type: 'success', text: 'Your comment has been submitted and is awaiting moderation.' });
        setName('');
        setEmail('');
        setContent('');
      } else {
        const errorData = await res.json();
        setSubmitMessage({ type: 'error', text: errorData.message || 'Failed to submit comment. Please try again.' });
      }
    } catch (error) {
      setSubmitMessage({ type: 'error', text: 'A network error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-12 pt-8 border-t border-slate-100 dark:border-zinc-800 max-w-3xl">
      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-8">
        Comments ({comments.length})
      </h3>

      {/* Existing Comments List */}
      <div className="flex flex-col gap-8 mb-12">
        {isLoading ? (
          <p className="text-sm text-slate-500">Loading comments...</p>
        ) : comments.length > 0 ? (
          comments.map((comment) => {
            const avatarUrl = comment.author_avatar_urls?.['48'] || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author_name)}&background=4a0e4e&color=fff`;
            const date = new Date(comment.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

            return (
              <div key={comment.id} className="flex gap-4">
                <img src={avatarUrl} alt={comment.author_name} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-800 shrink-0" />
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{decodeHtml(comment.author_name)}</span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">{date}</span>
                  </div>
                  <div 
                    className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed [&_p]:mb-2 [&_p:last-child]:mb-0 [&_a]:text-[#4a0e4e] [&_a]:dark:text-[#00ff85] [&_a]:underline"
                    dangerouslySetInnerHTML={{ __html: decodeHtml(comment.content.rendered) }}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-slate-500 italic">No comments yet. Be the first to share your thoughts!</p>
        )}
      </div>

      {/* Leave a Comment Form */}
      <div className="bg-slate-50 dark:bg-zinc-900/50 p-6 sm:p-8 rounded-2xl border border-slate-100 dark:border-zinc-800/80">
        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Leave a Reply</h4>
        
        {submitMessage.text && (
          <div className={`p-4 mb-6 rounded-xl text-sm font-semibold ${submitMessage.type === 'success' ? 'bg-[#00ff85]/10 text-[#00ff85] border border-[#00ff85]/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
            {submitMessage.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Name *</label>
              <input 
                type="text" 
                id="name" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#4a0e4e] dark:focus:border-[#00ff85] transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Email *</label>
              <input 
                type="email" 
                id="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#4a0e4e] dark:focus:border-[#00ff85] transition-colors"
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label htmlFor="content" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Comment *</label>
            <textarea 
              id="content" 
              required 
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#4a0e4e] dark:focus:border-[#00ff85] transition-colors resize-y"
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="mt-2 self-start bg-[#4a0e4e] hover:bg-[#38003c] dark:bg-[#00ff85] dark:hover:bg-[#00cc6a] text-white dark:text-black text-sm font-bold uppercase tracking-widest px-8 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Post Comment'}
          </button>
        </form>
      </div>
    </div>
  );
}