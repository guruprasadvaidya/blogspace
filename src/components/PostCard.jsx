
import React from "react";
import appwriteService from "../appwrite/configuration";
import { Link } from "react-router-dom";

function PostCard({ title, slug, featuredimage }) {
  const imageUrl = featuredimage
    ? appwriteService.getFilePreview(featuredimage)
    : null;

  return (
    <Link
      to={`/post/${slug}`}
      className="group block h-full min-w-0"
    >
      <article className="h-full overflow-hidden rounded-2xl border border-[#EAE7E2] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="aspect-[16/10] w-full overflow-hidden bg-[#F0EDF2]">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-[#77717C]">
              No featured image
            </div>
          )}
        </div>

        <div className="p-4 sm:p-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#7956A8]">
            Featured story
          </p>

          <h2 className="break-words text-lg font-semibold leading-snug text-[#242127] transition group-hover:text-[#7956A8] sm:text-xl">
            {title}
          </h2>

          <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#7956A8]">
            Read story
            <span aria-hidden="true">→</span>
          </span>
        </div>
      </article>
    </Link>
  );
}

export default PostCard;
