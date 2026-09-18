import React from 'react';
import axios from 'axios';

function CreatePost() {
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const file = formData.get('image');

    if (!file || file.size === 0) {
      alert('Please select an image before posting.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:3000/create-post', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log(res.data);
      e.target.reset();
      alert('Post created successfully!');
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert(error.response?.data?.message || 'Something went wrong while creating the post.');
    }
  };

  return (
    <section className="min-h-screen bg-slate-950 px-4 py-10 text-slate-50">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center">
        <div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_25px_80px_rgba(15,23,42,0.65)] backdrop-blur-xl animate-float-in md:p-8">
          <div className="mb-8 text-center">
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.25em] text-cyan-300">Create Snapshot</p>
            <h1 className="text-3xl font-bold text-white md:text-4xl">Share your moment</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">Image</span>
              <input
                type="file"
                name="image"
                accept="image/*"
                className="block w-full cursor-pointer rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-slate-200 file:mr-4 file:rounded-full file:border-0 file:bg-cyan-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-950 hover:file:bg-cyan-400"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">Caption</span>
              <textarea
                name="caption"
                rows="4"
                placeholder="Write a caption..."
                required
                className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-base text-white placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
              />
            </label>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="rounded-full border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 transition duration-200 hover:border-slate-400 hover:bg-slate-800"
              >
                Back
              </button>

              <button
                type="submit"
                className="rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-violet-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/30 transition duration-300 hover:scale-[1.02] hover:shadow-cyan-500/50"
              >
                Publish post
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default CreatePost;