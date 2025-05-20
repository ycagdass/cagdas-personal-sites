import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";

const ARTICLES_DIR = path.join(process.cwd(), "public", "articles");

export interface Post {
  slug: string;
  title: string;
  date: string;
  description: string;
  content: string;
  tags: string[];
  readingTime?: string;
  image?: string | undefined;
  author?: string | undefined;
}

interface FrontMatter {
  title: string;
  date: string;
  description: string;
  tags?: string[];
}

export async function getAllPosts(): Promise<Post[]> {
  try {
    try {
      await fs.access(ARTICLES_DIR);
    } catch {
      await fs.mkdir(ARTICLES_DIR, { recursive: true });
      console.log(`Created directory: ${ARTICLES_DIR}`);
    }

    const files = await fs.readdir(ARTICLES_DIR);

    const posts = await Promise.all(
      files
        .filter((file) => file.endsWith(".md"))
        .map(async (file) => {
          const filePath = path.join(ARTICLES_DIR, file);
          const source = await fs.readFile(filePath, "utf8");
          const { data, content } = matter(source);

          return {
            ...data,
            content,
            slug: file.replace(".md", ""),
            readingTime: calculateReadingTime(content),
            tags: data.tags || [],
          } as Post;
        })
    );

    return posts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    console.error("Error getting posts:", error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const source = await fs.readFile(
      path.join(ARTICLES_DIR, `${slug}.md`),
      "utf8"
    );
    const { data, content } = matter(source) as unknown as {
      data: FrontMatter;
      content: string;
    };

    const readingTime = calculateReadingTime(content);

    return {
      ...data,
      content: content,
      slug,
      readingTime,
      tags: data.tags || [],
    } as Post;
  } catch (error) {
    return null;
  }
}

function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

export async function BlogPost(slug: string) {
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
  };
}

export function extractHeadings(
  content: string
): Array<{ id: string; text: string; level: number }> {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: Array<{ id: string; text: string; level: number }> = [];
  const usedIds = new Set<string>();

  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    let id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    if (usedIds.has(id)) {
      let counter = 1;
      while (usedIds.has(`${id}-${counter}`)) {
        counter++;
      }
      id = `${id}-${counter}`;
    }

    usedIds.add(id);
    headings.push({ id, text, level });
  }
  return headings;
}
