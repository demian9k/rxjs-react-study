import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import type { UserConfig } from "vite";

// @ts-ignore
async function asyncFunction() {

}

// https://vitejs.dev/config/
export default defineConfig(async (configEnv) => {
  const { command, mode } = configEnv

  //config 에 필요한 값을 비동기로 가져올 수 있다.
  const data = await asyncFunction()

  const emotionSwcPlugin:[string, Record<string, any>] = ['@swc/plugin-emotion', {
    // default is true. It will be disabled when build type is production.
    // sourceMap?: boolean,
    sourceMap:true,

    // default is 'dev-only'.
    // autoLabel?: 'never' | 'dev-only' | 'always',
    autoLabel: 'dev-only'
    // default is '[local]'.
    // Allowed values: `[local]` `[filename]` and `[dirname]`
    // This option only works when autoLabel is set to 'dev-only' or 'always'.
    // It allows you to define the format of the resulting label.
    // The format is defined via string where variable parts are enclosed in square brackets [].
    // For example labelFormat: "my-classname--[local]", where [local] will be replaced with the name of the variable the result is assigned to.
    // labelFormat?: string,
  }]

  const config:UserConfig = {
    server: {
      port:4000,
    },
    plugins: [
      react({ plugins: [
        ]})
    ],
    resolve: {
      alias: {
      },
    },

    css: {
      postcss: {

      },
      preprocessorOptions: {
        scss: {
        },
      }
    },
    // envPrefix: "VITE_"
    experimental: {

    }
  }

  return config
})