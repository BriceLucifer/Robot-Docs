import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Robot-Docs",
  description: "A website for learing embodied AI🤖",
  base: '/Robot-Docs/',
  // favicon
  head: [
    ['link', { rel: 'icon', href: '/Robot-Docs/favicon.ico' }]
  ],

  // 主题设置
  themeConfig: {
    logo: '/robot.png',
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
          { text: 'Setup', link: '/setup' },
          { text: 'Windows Setup', link: '/windows'},
        ]
      },
      {
        text: 'Robot Tutorials',
        items: [
          { text: 'SO-100 机械臂使用指南', link: '/so100' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/BriceLucifer' }
    ],

    // 搜索栏
    search: {
      provider: 'local',
    },
  },
  // math
  markdown: {
    math: true
  },
})