
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, PostCard } from "../components";
import appwriteService from "../appwrite/configuration";

function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    appwriteService
      .getPosts([])
      .then((response) => {
        if (isMounted && response && response.rows) {
          setPosts(response.rows);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch posts:", error);
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#FAFAF8]">
      <Container>
        <section className="py-12 sm:py-16">
          <div className="mb-10 border-b border-[#EAE7E2] pb-8">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#7956A8]">
              The collection
            </p>

            <h1 className="mb-3 text-4xl font-bold tracking-tight text-[#211D25] sm:text-5xl">
              All stories.
            </h1>

            <p className="max-w-xl text-base leading-7 text-[#77717C]">
              Explore every published story, idea and perspective
              shared with our community.
            </p>

            {!loading && (
              <p className="mt-5 text-sm font-medium text-[#77717C]">
                {posts.length} {posts.length === 1 ? "story" : "stories"}
              </p>
            )}
          </div>

          {loading && (
            <div className="py-16 text-center text-[#77717C]">
              Loading stories...
            </div>
          )}

          {!loading && posts.length === 0 && (
            <div className="rounded-2xl border border-dashed border-[#DCD5E3] bg-white px-5 py-16 text-center">
              <h2 className="mb-2 text-xl font-semibold text-[#242127]">
                No stories available.
              </h2>
              <p className="text-sm text-[#77717C]">
                Check back later for new articles.
              </p>
              <Link
                to="/"
                className="mt-5 inline-block text-sm font-semibold text-[#7956A8] hover:underline"
              >
                Back to Home →
              </Link>
            </div>
          )}

          {!loading && posts.length > 0 && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {posts.map((post) => (
                <PostCard key={post.$id} {...post} />
              ))}
            </div>
          )}
        </section>
      </Container>
    </div>
  );
}

export default AllPosts;
