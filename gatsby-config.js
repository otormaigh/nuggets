module.exports = {
  siteMetadata: {
    title: 'til',
    description: 'A collection of TILs',
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
