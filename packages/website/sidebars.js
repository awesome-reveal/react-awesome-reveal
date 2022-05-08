/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

module.exports = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  docsSidebar: [
    "intro",
    "features",
    {
      "Getting Started": [
        "getting-started/installation",
        "getting-started/quick-start",
      ],
    },
    {
      "Supported Effects": [
        "supported-effects/attention-seekers",
        "supported-effects/props",
        "supported-effects/example",
        "supported-effects/chaining-multiple-animations",
      ],
    },
    "custom-animations",
    "advanced-concepts",
    "past-releases",
    "license",
  ],
  examplesSidebar: [
    "effects/attention-seekers",
    "effects/bounce",
    "effects/fade",
    "effects/flip",
    "effects/hinge",
    "effects/jack-in-the-box",
    "effects/roll",
    "effects/rotate",
    "effects/slide",
    "effects/zoom",
  ],

  // But you can create a sidebar manually
  /*
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Tutorial',
      items: ['hello'],
    },
  ],
   */
};
