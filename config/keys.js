if (process.env.NODE_ENV === "PROD") {
  module.exports = require("./keys_prod");
} else {
  module.exports = require("./keys_dev");
}
