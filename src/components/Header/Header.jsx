
import React, { useState } from "react";
import { Container, Logo, LogoutBtn } from "../index";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", slug: "/", active: true },
    { name: "Sign In", slug: "/login", active: !authStatus },
    { name: "Sign Up", slug: "/signup", active: !authStatus },
    { name: "All Posts", slug: "/all-posts", active: authStatus },
    { name: "Add Post", slug: "/add-post", active: authStatus },
  ];

  const handleNavigation = (slug) => {
    navigate(slug);
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#EAE7E2] bg-[#FAFAF8]/95 backdrop-blur-md">
      <Container>
        <nav className="flex min-h-[72px] items-center justify-between gap-4">
          <Logo width="auto" />

          {/* Desktop navigation */}
          <div className="hidden items-center gap-2 md:flex">
            {navItems.map(
              (item) =>
                item.active && (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.slug)}
                    className="rounded-full px-4 py-2 text-sm font-medium text-[#55515B] transition hover:bg-[#F0ECF5] hover:text-[#7956A8]"
                  >
                    {item.name}
                  </button>
                )
            )}

            {authStatus && <LogoutBtn />}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#EAE7E2] text-[#171717] transition hover:bg-[#F0ECF5] md:hidden"
          >
            {menuOpen ? (
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </nav>

        {/* Mobile navigation */}
        {menuOpen && (
          <div className="border-t border-[#EAE7E2] py-4 md:hidden">
            <div className="flex flex-col gap-1">
              {navItems.map(
                (item) =>
                  item.active && (
                    <button
                      key={item.name}
                      onClick={() => handleNavigation(item.slug)}
                      className="rounded-lg px-4 py-3 text-left text-sm font-medium text-[#55515B] transition hover:bg-[#F0ECF5] hover:text-[#7956A8]"
                    >
                      {item.name}
                    </button>
                  )
              )}

              {authStatus && (
                <div className="px-4 pt-2">
                  <LogoutBtn />
                </div>
              )}
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}

export default Header;
