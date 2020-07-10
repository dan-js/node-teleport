const { node } = require("@nuuji/config");

const config = node.babel();

config.presets[0][1]['targets'] = { esmodules: true };

module.exports = config;
