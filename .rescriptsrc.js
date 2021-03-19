const path = require('path');

const transform = ({
  module: {
    rules: [rule0, { oneOf: matchers }],
    ...module
  },
  ...config
}) => {
  return {
    ...config,
    // Edit the Webpack config
    module: {
      ...module,
      rules: [
        rule0,
        // Edit file matchers
        {
          oneOf: matchers.map(ruleset =>
            // Babel Loader rule
            String(ruleset.test) === String(/\.(js|mjs|jsx|ts|tsx)$/)
              ? {
                  ...ruleset,
                  include: [
                    ruleset.include,
                    // This module uses TS 3.8+ `import type` and `export type`
                    // syntax, and we need Babel remove these imports in order
                    // to compile the app.
                    path.resolve(
                      'node_modules/@mstable/protocol/types/generated',
                    ),
                    path.resolve('../contracts/types/generated'),
                  ],
                }
              : ruleset,
          ),
        },
      ],
    },
  };
};

module.exports = transform;
