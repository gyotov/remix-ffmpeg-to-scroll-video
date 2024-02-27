/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ["**/*.css"],
  browserNodeBuiltinsPolyfill: {
    modules: {
      url: true,
      crypto: true,
      querystring: true,
      fs: true,
      path: true,
      stream: true,
      https: true,
      http: true,
      events: true,
      util: true,
      os: true,
      buffer: true,
      child_process: true,
    },
  },
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
  // serverBuildPath: "build/index.js",
};
