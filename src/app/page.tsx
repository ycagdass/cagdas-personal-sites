import { getAllPosts } from "@/lib/article";
import ClientHome from "./ClientHome";
import { Suspense } from "react";

export default async function Home() {
  const posts = await getAllPosts();
  const recentPosts = posts.slice(0, 2);

  return (
    <Suspense>
      <ClientHome posts={recentPosts} />
    </Suspense>
  );
}
