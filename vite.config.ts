import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import dotenv from "dotenv";

dotenv.config({ path: "../Blacket/.env" });

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@components": "/src/components",
            "@functions": "/src/functions",
            "@stores": "/src/stores",
            "@styles": "/src/styles"
        },
        preserveSymlinks: true
    },
    server: {
        proxy: {
            "/api": {
                target: process.env.VITE_BACKEND_URL,
                changeOrigin: true
            }
        }
    },
    css: {
        modules: {
            scopeBehaviour: "local",
            localsConvention: "camelCaseOnly",
            generateScopedName: "[name]__[local]___[hash:base64:5]"
        }
    },
    build: {
        target: "es2022",
        outDir: "./dist",
        rollupOptions: {
            output: {
                manualChunks: (id: any) => {
                    if (id.includes("node_modules")) return "vendor";
                    else return "main";
                },
                chunkFileNames: "[name].[hash].js",
                entryFileNames: "[name].[hash].js",
                assetFileNames: "[name].[hash].[ext]"
            }
        },
        chunkSizeWarningLimit: 1000,
        manifest: true,
        minify: "terser",
        terserOptions: {
            format: {
                comments: false
            },
            compress: {
                sequences: true,
                booleans: true,
                loops: true,
                toplevel: true,
                unsafe: true,
                drop_console: true,
                unsafe_comps: true,
                passes: 2
            },
            module: true
        }
    }
});
