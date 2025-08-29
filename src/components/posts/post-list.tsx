"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/posts/post-card";

// Post interface টি এখানেও রাখুন বা একটি shared types ফাইলে রাখুন
interface Post {
  id: string;
  content: string;
  image?: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
  };
  _count: {
    likes: number;
    comments: number;
  };
}

// initialPosts props হিসেবে আসছে
export function PostList({ initialPosts }: { initialPosts: Post[] }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [error, setError] = useState("");

  // নতুন পোস্ট তৈরি বা আপডেটের পর ডেটা রিফ্রেশ করার জন্য
  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts");
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
      } else {
        setError("পোস্ট লোড করা যায়নি");
      }
    } catch (error) {
      setError("কিছু ভুল হয়েছে");
    }
  };

  // আপনি handlePostCreated বা handlePostUpdate ফাংশনগুলো এখানে রাখতে পারেন
  // এবং CreatePost কম্পোনেন্ট থেকে কল করতে পারেন

  if (error) {
    return (
      <Card className="bg-white dark:bg-gray-800 shadow-sm">
        <CardContent className="p-6 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchPosts}>আবার চেষ্টা করুন</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {posts.length === 0 ? (
        <Card className="bg-white dark:bg-gray-800 shadow-sm">
          <CardContent className="p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              কোন পোস্ট নেই। প্রথম পোস্টটি করুন!
            </p>
          </CardContent>
        </Card>
      ) : (
        posts.map((post) => (
          <PostCard 
            key={post.id} 
            post={post} 
            onPostUpdate={fetchPosts} // পোস্ট আপডেটের পর রিফ্রেশ
          />
        ))
      )}
    </div>
  );
}