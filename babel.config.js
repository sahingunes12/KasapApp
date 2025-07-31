module.exports = {
  presets: ['@react-native/babel-preset'],
  plugins: [
    'nativewind/babel',
  ],
  env: {
    test: {
      plugins: [
        'nativewind/babel',
      ],
    },
  },
  overrides: [
    {
      test: /\.tsx?$/,
      plugins: [
        ['@babel/plugin-transform-modules-commonjs'],
      ],
    },
  ],
};
