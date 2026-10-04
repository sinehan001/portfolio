import type { Metadata, Viewport } from "next";
import { Cinzel, Inter, Rajdhani } from "next/font/google";
import { site } from "@/lib/content";
import LightningLayer from "@/components/doom/LightningLayer";
import FaviconSync from "@/components/FaviconSync";
import Preloader from "@/components/Preloader";
import LazyChrome from "@/components/LazyChrome";
import AnimPauser from "@/components/AnimPauser";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  display: "swap",
  // Doom-only face; new visitors start in Iron, so it loads on demand.
  preload: false,
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} | ${site.title}`, template: `%s | ${site.name}` },
  description: site.description,
  authors: [{ name: site.name, url: site.url }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: `${site.name} Portfolio`,
    title: `${site.name} | ${site.title}`,
    description: site.description,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | ${site.title}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#040705" },
    { media: "(prefers-color-scheme: light)", color: "#f3f5f8" },
  ],
};

// Runs before paint: Iron (light) by default; Doom (dark) only if the visitor chose it.
const themeScript = `document.documentElement.classList.add("is-loading");try{if(localStorage.getItem("theme")==="dark")document.documentElement.classList.add("dark")}catch(e){}`;

// Lifts the first-load screen once the DOM and fonts are ready (min 300ms, max 1.5s).
// It deliberately does not wait for every asset: a long loader hurts Speed Index.
const loaderScript = `(function(){var d=document.documentElement,done=false;function hide(){if(done)return;done=true;d.classList.remove("is-loading")}var min=new Promise(function(r){setTimeout(r,300)});var load=new Promise(function(r){if(document.readyState!=="loading")r();else document.addEventListener("DOMContentLoaded",r,{once:true})});var fonts=document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve();Promise.all([min,load,fonts]).then(hide,hide);setTimeout(hide,1500)})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${cinzel.variable} ${rajdhani.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <noscript>
          <style>{"#preloader{display:none}"}</style>
        </noscript>
      </head>
      <body className="antialiased">
        <Preloader />
        <script dangerouslySetInnerHTML={{ __html: loaderScript }} />
        {children}
        <FaviconSync />
        <LightningLayer />
        <LazyChrome />
        <AnimPauser />
      </body>
    </html>
  );
}
