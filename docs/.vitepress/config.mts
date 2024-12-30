import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Robot-Docs",
  description: "A website for learing embodied AI",
  base: '/Robot-Docs/',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Docs', link: '/start' }
    ],

    sidebar: [
      {
        text: 'Guide Lines',
        items: [
          { text: 'Get Started', link: '/start' },
          { text: 'Examples', link: '/examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/BriceLucifer' }
    ]
  },
  markdown: {
    math: true
  }
})
