import { useState } from "react";
import { usePetContext } from "@/context/PetContext";
import { Button } from "@/components/ui/button";

const Forum = () => {
  const { posts, addPost, loading } = usePetContext();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    addPost({ title, content, author: author || "Anonymous" });
    setTitle("");
    setContent("");
    setAuthor("");
  };

  return (
    <section className="py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4">Community Forum</h2>
        <form onSubmit={onSubmit} className="space-y-3 mb-6 bg-card p-4 rounded-2xl">
          <input className="w-full p-2 rounded-md border border-input bg-background" placeholder="Your name" value={author} onChange={(e) => setAuthor(e.target.value)} />
          <input className="w-full p-2 rounded-md border border-input bg-background" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea className="w-full p-2 rounded-md border border-input bg-background" placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} />
          <div className="flex justify-end">
            <Button type="submit" variant="hero">Post</Button>
          </div>
        </form>

        <div className="space-y-4">
          {posts.length === 0 && <div className="text-muted-foreground">No posts yet.</div>}
          {posts.map((p) => (
            <div key={p.id} className="p-4 bg-background rounded-md border border-input">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold">{p.title}</div>
                <div className="text-xs text-muted-foreground">{new Date(p.date).toLocaleString()}</div>
              </div>
              <div className="text-sm text-muted-foreground mb-2">by {p.author || "Anonymous"}</div>
              <div>{p.content}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Forum;
