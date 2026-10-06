export default {
  ignoreFiles: [
    "amo-metadata.json",
    "README.md",
    "web-ext-config.mjs",
    "icons/amo-icon-128.png",
  ],
  sign: {
    channel: "listed",
    amoMetadata: "amo-metadata.json",
  },
};
