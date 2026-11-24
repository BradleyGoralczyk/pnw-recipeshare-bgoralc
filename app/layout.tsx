import type { Metadata } from "next";
import Link from "next/link";

import "./globals.css";

export const metadata: Metadata = {
  title: "RecipeShare",
  description: "Discover and share recipes from cuisines around the world.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <Link className="brand" href="/">
            RecipeShare
          </Link>
          <nav aria-label="Main navigation" className="header-actions">
            <span className="header-note">A world of recipes</span>
            <Link className="header-cta" href="/recipes/new">
              Share a recipe
            </Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
