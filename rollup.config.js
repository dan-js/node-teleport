const { node } = require("@nuuji/config");

const config = node.rollup();

config.output[0].inlineDynamicImports = true;

module.exports = config;
