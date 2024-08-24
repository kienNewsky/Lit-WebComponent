import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/newsky-table.js',
  output: {
    file: 'dist/newsky-table.js',
    format: 'es',
  },
  plugins: [
    resolve(),
    terser()
  ]
};

/**
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

export default {
  input: {
    'ns-data-table': 'src/ns-data-table.js',
    'ns-other-component': 'src/ns-other-component.js',
    // Add more components as needed
  },
  output: {
    dir: 'dist',
    format: 'es',
    entryFileNames: '[name].js', // This will use the key from the input object as the filename
  },
  plugins: [
    resolve(),
    terser()
  ]
};

 *
 */
