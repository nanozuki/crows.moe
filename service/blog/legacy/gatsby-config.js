module.exports = {
  siteMetadata: {
    siteUrl: "https://crows.moe",
    title: "Nanozuki's personal website",
  },
  plugins: [
    "gatsby-plugin-emotion",
    "gatsby-plugin-image",
    "gatsby-plugin-react-helmet",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        short_name: "鸦之歌",
        name: "鸦之歌",
        icon: "src/images/icon.jpg",
        start_url: "/",
        description: "Nanozuki's personal website",
      },
    },
    "gatsby-transformer-remark",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./src/images/",
      },
      __key: "images",
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "pages",
        path: "./src/pages/",
      },
      __key: "pages",
    },
    {
      resolve: `gatsby-source-strapi`,
      options: {
        apiURL: `https://strapi.crows.moe`,
        queryLimit: 1000, // Default to 100
        collectionTypes: [`Article`, `Tag`],
        singleTypes: [],
      },
    },
    {
      resolve: "gatsby-plugin-eslint",
      options: {
        stages: ["develop"],
        extensions: ["js", "jsx"],
        exclude: ["node_modules", ".cache", "public"],
      },
    },
  ],
};
