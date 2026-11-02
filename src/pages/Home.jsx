
import React, { useEffect, useState } from "react";
import appwriteService from "../appwrite/configuration";
import { Container, PostCard } from "../components";
import { Link } from "react-router-dom";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    appwriteService
      .getPosts()
      .then((response) => {
        if (isMounted && response && response.rows) {
          setPosts(response.rows);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch homepage posts:", error);
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

  const featuredPost = posts[0];
  const latestPosts = posts.slice(1);

  return (
    <div className="min-h-screen w-full bg-[#FAFAF8]">
      <Container>
        {/* Hero section */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="max-w-3xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#7956A8] sm:text-sm">
              A space for curious minds
            </p>

            <h1 className="mb-5 text-4xl font-bold leading-tight tracking-tight text-[#211D25] sm:text-5xl lg:text-6xl">
              Stories worth
              <span className="block text-[#7956A8]">
                your time.
              </span>
            </h1>

            <p className="max-w-xl text-base leading-7 text-[#77717C] sm:text-lg">
              Discover ideas, perspectives and stories from curious
              minds. Read something meaningful. Share something valuable.
            </p>
          </div>
        </section>

        {/* Loading state */}
        {loading && (
          <div className="py-16 text-center text-[#77717C]">
            Loading stories...
          </div>
        )}

        {/* Empty state */}
        {!loading && posts.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#DCD5E3] bg-white px-5 py-16 text-center">
            <h2 className="mb-2 text-xl font-semibold text-[#242127]">
              No stories published yet.
            </h2>
            <p className="text-sm text-[#77717C]">
              Be the first to share something interesting.
            </p>
          </div>
        )}

        {/* Featured story */}
        {!loading && featuredPost && (
          <section className="pb-12 sm:pb-16">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.15em] text-[#7956A8]">
                  Editor's pick
                </p>
                <h2 className="text-2xl font-bold text-[#242127] sm:text-3xl">
                  Featured story
                </h2>
              </div>
            </div>

            <div className="max-w-3xl">
              <PostCard {...featuredPost} />
            </div>
          </section>
        )}

        {/* Latest stories */}
        {!loading && latestPosts.length > 0 && (
          <section className="pb-16 sm:pb-20">
            <div className="mb-7 flex items-end justify-between gap-4">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.15em] text-[#7956A8]">
                  Freshly published
                </p>
                <h2 className="text-2xl font-bold text-[#242127] sm:text-3xl">
                  Latest stories
                </h2>
              </div>

              <Link
                to="/all-posts"
                className="shrink-0 text-sm font-semibold text-[#7956A8] hover:underline"
              >
                View all →
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {latestPosts.map((post) => (
                <PostCard key={post.$id} {...post} />
              ))}
            </div>
          </section>
        )}
      </Container>
    </div>
  );
}

export default Home;
