/// <reference types="vitest" />

import path from 'node:path'
import process from 'node:process'
import react from '@vitejs/plugin-react-swc'
import { defineConfig, loadEnv } from 'vite'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const publicDir = path.resolve(__dirname, '../../public')

  return {
    plugins: [
      react(),
      svgr({
        svgrOptions: {
          icon: true
        }
      })
    ],
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: './src/test/setup.ts',
      css: false,
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html']
      }
    },
    define: {
      'process.env': process.env
    },
    build: {
      sourcemap: true,
      target: 'es2022',
      outDir: publicDir,
      emptyOutDir: true,
      minify: true,
      esbuild: {
        keepNames: true
      },
      rollupOptions: {
        output: {
          entryFileNames: `assets/[name]-[hash].js`,
          chunkFileNames: `assets/[name]-[hash].js`,
          assetFileNames: `assets/[name]-[hash].[ext]`,
          manualChunks: {
            vendor: ['react', 'react-dom', '@tanstack/react-query'],
            'tanstack-table': ['@tanstack/react-table'],
            'tanstack-virtual': ['@tanstack/react-virtual'],
            // 'direct-page': ['src/pages/DirectReportPages/DirectPage.tsx'],
            // 'direct-hooks': [
            //   'src/api/hooks/direct/useDirectReportAds.ts',
            //   'src/api/hooks/direct/useDirectDays.ts',
            //   'src/api/hooks/direct/useDirectDaysFull.ts',
            //   'src/api/hooks/direct/useDirectCampaigns.ts'
            // ],
            // 'table-components': [
            //   'src/components/ReportTable/components/TableHeader/TableHeader.tsx',
            //   'src/components/ReportTable/TableRow.tsx'
            // ],
            // 'ui-components-direct': [
            //   'src/pages/DirectReportPages/DirectFilters/DirectFilters.tsx'
            // ],
            // 'ui-components-common': [
            //   'src/components/ui/tabs.tsx',
            //   'src/components/@common/CustomLoader.tsx'
            // ],
            // 'report-table': ['src/components/ReportTable/ReportTable.tsx'],
            // 'direct-table-segment': [
            //   'src/pages/DirectReportPages/components/DirectTableSegment.tsx'
            // ]
            // 'export-utils': [
            //   'src/pages/DirectReportPages/components/useExport.ts'
            // ],
            // utils: ['src/components/utils/hooks/useSearchState.ts']
          }
        }
      }
    },
    esbuild: {
      target: 'es2022'
    },
    server: {
      host: true,
      proxy: {
        '/api/': {
          target: env.VITE_SERVER_ROOT || 'http://localhost:3141',
          changeOrigin: true,
          secure: false
          // rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    optimizeDeps: {
      include: ['lodash/uniqueId']
    }
  }
})
