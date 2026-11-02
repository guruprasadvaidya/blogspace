import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import parse from "html-react-parser";

import appwriteService from "../appwrite/configuration";
import { Container } from "../components";
import DOMPurify from "dompurify";

export default function Post() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const { slug } = useParams();
  const navigate = useNavigate();

  // Get authenticated user from Redux
  const userData = useSelector((state) => state.auth.userData);

  // Support the existing Appwrite field name
  const featuredImage =
    post?.featuredimage || post?.featuredImage || "";

  // Check whether the logged-in user owns this post
  const isAuthor =
    post && userData
      ? post.userid === userData.$id
      : false;

  // Fetch post using slug
  useEffect(() => {
    let isMounted = true;

    const fetchPost = async () => {
      if (!slug) {
        navigate("/", { replace: true });
        return;
      }

      setLoading(true);
      setError("");
      setPost(null);

      try {
        const postData = await appwriteService.getPost(slug);

        if (!isMounted) return;

        if (postData) {
          setPost(postData);
        } else {
          setError("This story could not be found.");
        }
      } catch (err) {
        console.error("Failed to load post:", err);

        if (isMounted) {
          setError("Unable to load this story. Please try again.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPost();

    return () => {
      isMounted = false;
    };
  }, [slug, navigate]);

  // Delete post and its featured image
  const deletePost = async () => {
    if (!post || deleting || !isAuthor) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this story? This action cannot be undone."
    );

    if (!confirmed) return;

    setDeleting(true);
    setError("");

    try {
      // First delete the database row
      const status = await appwriteService.deletePost(post.$id);

      if (!status) {
        throw new Error("Unable to delete the post.");
      }

      // Database deletion succeeded.
      // Image deletion is a separate operation.
      if (featuredImage) {
        try {
          const fileDeleted =
            await appwriteService.deleteFile(featuredImage);

          if (!fileDeleted) {
            console.warn(
              "Post deleted, but its featured image could not be deleted."
            );
          }
        } catch (imageError) {
          console.warn(
            "Post deleted, but image cleanup failed:",
            imageError
          );
        }
      }

      // Navigate after successful post deletion
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Delete post failed:", err);

      setError(
        err?.message || "Unable to delete this story. Please try again."
      );

      setDeleting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#FAFAF8] px-4">
        <p className="text-sm font-medium text-[#77717C]">
          Loading story...
        </p>
      </div>
    );
  }

  // Error or missing post state
  if (error && !post) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-[#FAFAF8] px-4 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F0ECF5] text-2xl text-[#7956A8]">
          !
        </div>

        <h1 className="mb-3 text-2xl font-bold text-[#211D25]">
          Story unavailable
        </h1>

        <p className="mb-6 max-w-md text-sm leading-relaxed text-[#77717C]">
          {error}
        </p>

        <Link
          to="/all-posts"
          className="rounded-full bg-[#7956A8] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#68458F]"
        >
          Explore all stories
        </Link>
      </div>
    );
  }

  if (!post) return null;

  return (
    <article className="min-h-screen w-full bg-[#FAFAF8] py-8 sm:py-12 lg:py-16">
      <Container>
        <div className="mx-auto max-w-4xl">

          {/* Back navigation */}
          <Link
            to="/all-posts"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#77717C] transition hover:text-[#7956A8]"
          >
            <span aria-hidden="true">←</span>
            Back to stories
          </Link>

          {/* Article heading */}
          <header className="mb-8 sm:mb-10">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#7956A8]">
              Blogspace · Article
            </p>

            <h1 className="mb-6 break-words text-3xl font-bold leading-tight tracking-tight text-[#211D25] sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>

            {/* Author actions */}
            {isAuthor && (
              <div className="flex flex-wrap items-center gap-3 border-y border-[#EAE7E2] py-4">
                <span className="mr-auto text-sm font-medium text-[#77717C]">
                  Manage your story
                </span>

                <Link
                  to={`/edit-post/${post.slug}`}
                  className="rounded-full border border-[#DCD5E3] px-5 py-2 text-sm font-semibold text-[#7956A8] transition hover:bg-[#F0ECF5]"
                >
                  Edit story
                </Link>

                <button
                  type="button"
                  onClick={deletePost}
                  disabled={deleting}
                  aria-label="Delete this story"
                  className="rounded-full border border-red-200 px-5 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Delete story"}
                </button>
              </div>
            )}
          </header>

          {/* Featured image */}
          {featuredImage ? (
            <div className="mb-10 overflow-hidden rounded-2xl bg-[#F0EDF2] sm:mb-12">
              <img
                src={appwriteService.getFilePreview(featuredImage)}
                alt={post.title || "Article featured image"}
                className="max-h-[560px] w-full object-cover"
              />
            </div>
          ) : (
            <div className="mb-10 flex min-h-40 items-center justify-center rounded-2xl bg-[#F0EDF2] text-sm text-[#77717C]">
              No featured image available.
            </div>
          )}

          {/* Article content */}
          <div className="mx-auto max-w-3xl">

            {/* Delete or other action errors */}
            {error && (
              <p
                role="alert"
                className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </p>
            )}

            <div className="article-content">
  {parse(DOMPurify.sanitize(post.content || ""))}
</div>

            {/* End of article */}
            <div className="mt-14 border-t border-[#EAE7E2] pt-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7956A8]">
                End of story
              </p>

              <h2 className="mt-3 text-2xl font-bold text-[#211D25]">
                Thanks for reading.
              </h2>

              <Link
                to="/all-posts"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#7956A8] hover:underline"
              >
                Discover more stories
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </article>
  );
}