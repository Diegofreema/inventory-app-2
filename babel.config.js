module.exports = function (api) {
  api.cache(true);
  const plugins = [];

  plugins.push([
    '@tamagui/babel-plugin',
    {
      components: ['tamagui'],
      config: './tamagui.config.ts',
    },
  ]);

  plugins.push([
    'react-native-reanimated/plugin',
    {
      relativeSourceLocation: true,
    },
  ]);
  plugins.push(['inline-import', { extensions: ['.sql'] }]);
  return {
    presets: ['babel-preset-expo'],

    plugins,
  };
};
