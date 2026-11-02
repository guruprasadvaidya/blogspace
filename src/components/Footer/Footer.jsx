
import React from "react";
import { Link } from "react-router-dom";
import Logo from "../Logo";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[#EAE7E2] bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">

          <div className="max-w-sm">
            <Logo width="auto" />

            <p className="mt-4 max-w-xs text-sm leading-7 text-[#77717C]">
              A space for curious minds. Discover ideas, share perspectives
              and explore stories worth your time.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:gap-16">

            <div>
              <h3 className="mb-4 text-sm font-semibold text-[#171717]">
                Explore
              </h3>

              <ul className="space-y-3 text-sm text-[#77717C]">
                <li>
                  <Link to="/" className="transition hover:text-[#7956A8]">
                    Home
                  </Link>
                </li>

                <li>
                  <Link to="/all-posts" className="transition hover:text-[#7956A8]">
                    All Posts
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold text-[#171717]">
                Account
              </h3>

              <ul className="space-y-3 text-sm text-[#77717C]">
                <li>
                  <Link to="/login" className="transition hover:text-[#7956A8]">
                    Sign In
                  </Link>
                </li>

                <li>
                  <Link to="/signup" className="transition hover:text-[#7956A8]">
                    Create Account
                  </Link>
                </li>
              </ul>
            </div>

          </div>
        </div>

        <div className="mt-10 border-t border-[#EAE7E2] pt-6">
          <p className="text-center text-xs text-[#99929D] sm:text-left">
            © {new Date().getFullYear()} Blogspace. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
