const { node } = require("@nuuji/config");

const config = node.babel({ targets: { esmodules: true } });

module.exports = config;
