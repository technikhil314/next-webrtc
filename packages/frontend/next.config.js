module.exports = {
  target: "serverless",
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
