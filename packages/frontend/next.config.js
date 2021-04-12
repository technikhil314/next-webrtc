module.exports = {
  async redirects() {
    return [
      {
        source: "/vlog",
        destination: "/",
        permanent: true,
      },
    ];
  },
};
