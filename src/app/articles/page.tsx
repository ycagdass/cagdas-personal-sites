import { Suspense } from "react";
import ArticlesContent from "./ArticlesContent";
import { getAllPosts } from "@/lib/article";

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <Suspense>
      <ArticlesContent posts={posts} />
    </Suspense>
  );
}
