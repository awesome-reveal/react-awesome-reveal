const path = require("path");
const effects = require("./src/effects");

exports.createPages = ({ actions }) => {
  const { createPage } = actions;

  effects.forEach((effect) => {
    createPage({
      path: `/${effect.name}`,
      component: path.resolve(`src/templates/effect-showcase.js`),
      context: {
        effect: effect.name,
        title: effect.title,
        directions: effect.directions,
      },
    });
  });
};
