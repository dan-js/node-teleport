const { node } = require("@nuuji/config");

const config = node.rollup();

// TODO Not needed when config bumped
config.output[0].inlineDynamicImports = true;

module.exports = config;
