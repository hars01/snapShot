import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('http://localhost:3000/posts');
        setPosts(res.data.posts || []);
      } catch (error) {
        console.error('Unable to fetch posts:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <section className="min-h-screen bg-slate-950 px-4 py-10 text-slate-50">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-300">Feed</p>
            <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">Snapshots</h1>
          </div>
          <button
            onClick={() => (window.location.href = '/create-post')}
            className="rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/30 transition duration-300 hover:scale-[1.02]"
          >
            New post
          </button>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-80 animate-pulse rounded-3xl border border-white/10 bg-slate-800/70" />
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post._id}
                className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-[0_18px_45px_rgba(15,23,42,0.5)] backdrop-blur-md transition duration-500 hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(34,211,238,0.18)]"
              >
                <div className="overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.caption || 'Post image'}
                    className="h-72 w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="space-y-3 p-5">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-400">
                    <span>Story</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-base leading-7 text-slate-100">{post.caption}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-slate-700 bg-slate-900/50 p-12 text-center text-slate-300">
            <h2 className="text-2xl font-semibold text-white">No posts available</h2>
            <p className="mt-3 text-slate-400">Create the first snapshot to start the feed.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Feed;