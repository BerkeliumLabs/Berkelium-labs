import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Berkelium Labs",
  description: "The AI Lab, Made Simple for Everyone.",
  head: [
    ["link", { rel: "icon", href: "/favicon.ico" }],
    [
      'script',
      {
        async: 'true',
        src: 'https://www.googletagmanager.com/gtag/js?id=G-61Q4F7F0RK',
      },
    ],
    [
      'script',
      {},
      "window.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());\ngtag('config', 'G-61Q4F7F0RK');",
    ],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "/images/logo.png",
    nav: [
      { text: "Home", link: "/" },
      { text: "Guide", link: "/guide" },
      {
        text: 'About',
        items: [
          { text: 'About Berkelium Labs', link: '/about' },
          { text: 'Privacy Policy', link: '/privacy-policy' },
          { text: 'Terms and Conditions', link: '/toc' }
        ]
      },
      {
        text: "Blog",
        link: "https://www.buddhilive.com/berkelium-labs/",
        target: "_blank",
      },
    ],

    /* sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ], */

    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/BerkeliumLabs/berkelium-labs",
      },
      { icon: "facebook", link: "https://web.facebook.com/BerKeliumLabs" },
      { icon: "linkedin", link: "https://www.linkedin.com/company/berkelium/" },
      { icon: "youtube", link: "https://www.youtube.com/@Buddhilive" }
    ],
    footer: {
      message: 'Released under the <a href="https://github.com/BerkeliumLabs/Berkelium-labs/blob/main/LICENSE">MIT License</a>.',
      copyright: 'Copyright © 2025 - present | <a href="https://www.buddhilive.com/">Buddhi Kavindra</a>'
    }
  },
  sitemap: {
    hostname: 'https://berkeliumlabs.com'
  },
  outDir: '../dist'
});
