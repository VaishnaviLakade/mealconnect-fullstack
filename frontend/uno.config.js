// uno.config.js
import { defineConfig, presetUno, presetAttributify, presetIcons } from 'unocss';

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons(),
  ],
  css: {
    devSourcemap: true, // Enables better debugging
  },
});
