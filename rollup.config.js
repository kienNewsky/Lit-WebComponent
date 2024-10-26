/**
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/js/pages/department/exec-department.js',
  output: {
    file: 'dist/exec-department.js',
    format: 'es',
  },
  plugins: [resolve(), terser()],
};


import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

export default {
  input: {
    'exec-department': 'src/js/pages/department/exec-department.js',
    'exec-category': 'src/js/pages/product/exec-category.js',
    // Add more components as needed
  },
  output: {
    dir: 'dist',
    format: 'es',
    entryFileNames: '[name].js', // This will use the key from the input object as the filename
    manualChunks: undefined, // Prevent Rollup from creating a separate shared module
  },
  plugins: [resolve(), terser()],
};
*
*/

import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

const configs = [
  {
    input: 'src/js/pages/department/exec-department.js',
    output: {
      file: 'dist/exec-department.js',
      format: 'es',
      inlineDynamicImports: true,
    },
    plugins: [resolve(), terser()],
  },
  {
    input: 'src/js/pages/product/exec-category.js',
    output: {
      file: 'dist/exec-category.js',
      format: 'es',
      inlineDynamicImports: true,
    },
    plugins: [resolve(), terser()],
  },
];

export default configs;
