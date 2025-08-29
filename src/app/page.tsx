// src/app/page.tsx
"use client"; // এই লাইনটি নিশ্চিত করে যে এটি একটি ক্লায়েন্ট কম্পোনেন্ট নয়
// src/app/page.tsx

// প্রয়োজনীয় কম্পোনেন্ট এবং ডেটাবেস ক্লায়েন্ট ইম্পোর্ট করা হচ্ছে
import { db } from "@/lib/db";
import { MainLayout } from "@/components/layout/main-layout";
import { CreatePost } from "@/components/posts/create-post";
import { PostList } from "@/components/posts/post-list"; // এই নতুন ক্লায়েন্ট কম্পোনেন্টটি ডেটা দেখানোর জন্য

/**
 * Home page component.
 * এটি একটি সার্ভার কম্পোনেন্ট যা async/await ব্যবহার করে সরাসরি ডেটাবেস থেকে ডেটা Fetch করে।
 * এটি পেজ লোড হওয়ার সময় সার্ভারেই রান হয়।
 */
export default async function Home() {
  
  // সরাসরি সার্ভারে Prisma ব্যবহার করে পোস্টগুলো ডেটাবেস থেকে আনা হচ্ছে
  const posts = await db.post.findMany({
    // পোস্টগুলো নতুন থেকে পুরানো ক্রমে সাজানো হচ্ছে
    orderBy: {
      createdAt: "desc",
    },
    // পোস্টের সাথে লেখকের তথ্য এবং লাইক/কমেন্টের সংখ্যাও আনা হচ্ছে
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          avatar: true, // এখানে 'image' এর পরিবর্তে 'avatar' ব্যবহার করা হয়েছে
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
  });

  // সার্ভার থেকে পাওয়া ডেটা দিয়ে পেজটি রেন্ডার করা হচ্ছে
  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* CreatePost একটি ক্লায়েন্ট কম্পোনেন্ট, কারণ এখানে ইউজারের ইনপুট প্রয়োজন */}
        <CreatePost />
        
        {/* PostList হলো একটি ক্লায়েন্ট কম্পোনেন্ট।
          সার্ভার থেকে পাওয়া পোস্টগুলো 'initialPosts' prop হিসেবে এখানে পাঠানো হচ্ছে।
          এর ফলে পেজটি লোড হওয়ার সাথে সাথেই পোস্টগুলো দেখা যাবে।
        */}
        <PostList initialPosts={posts} />
      </div>
    </MainLayout>
  );
}
