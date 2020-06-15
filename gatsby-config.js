module.exports = {
  siteMetadata: {
    title: 'Nuggets',
    description: 'A collection of nuggets of information',
    author: 'Elliot Tormey',
  },
  plugins: [
    {
      resolve: 'gatsby-theme-code-notes',
      options: {
        contentPath: 'notes',
        basePath: '/',
        showThemeInfo: false,
        showDescriptionInSidebar: true,
      },
    },
  ],
}
