import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'path';
import lwc from 'vite-plugin-lwc';
import {
  resolveIconTemplatesPlugin,
  iconTemplateExcludeDirs,
  iconTemplateAliases,
} from './vite-plugins/icon-templates.js';

/**
 * Every LBC JS module under node_modules/lightning-base-components/src/lightning
 * that has NO sibling .html template is a plain internal helper, not a component.
 * The LWC plugin would otherwise rewrite its import into a component+template
 * pair and fail with ENOENT ....html. Computed once at config load; emitted as
 * cross-platform regexes ([/\\] separators) because picomatch string patterns
 * with Windows backslashes do not match reliably.
 */
function lwcNonComponentExcludePatterns() {
  const escapeSegment = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const toPattern = (absFile) =>
    new RegExp(
      absFile.split(path.sep).map(escapeSegment).join('[/\\\\]') + '(\\?.*)?$'
    );
  const root = path.resolve('./node_modules/lightning-base-components/src/lightning');
  const out = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      if (!entry.name.endsWith('.js')) continue;
      if (fs.existsSync(full.slice(0, -3) + '.html')) continue;
      // Heuristica: se o arquivo parece ser um componente LWC (usa @api,
      // LightningElement, ou importa .html), NAO excluir — mesmo sem
      // <nome>.html irmao (ex: baseComboboxItem importa card.html/inline.html).
      // So excluir helpers puros sem traco de LWC.
      try {
        const txt = fs.readFileSync(full, 'utf8');
        if (
          txt.includes('LightningElement') ||
          txt.includes('@api') ||
          (txt.includes("from './") && txt.includes('.html'))
        ) {
          continue;
        }
      } catch {}
      out.push(toPattern(full));
    }
  };
  try {
    walk(root);
  } catch {
    /* LBC not installed yet — `npm install` / prebuild fails first anyway. */
  }
  return out;
}

const LWC_NON_COMPONENT_EXCLUDES = lwcNonComponentExcludePatterns();

/** LBC ships templates that trip many LWC diagnostics; app code cannot fix those. */
const LBC_UNDER_NODE_MODULES = /node_modules[/\\]lightning-base-components[/\\]/;

function isLightningBaseComponentsLwcRollupWarning(warning) {
  const locFile = warning.loc?.file ?? '';
  const id = warning.id ?? '';
  const message = warning.message ?? '';
  return (
    LBC_UNDER_NODE_MODULES.test(String(locFile)) ||
    LBC_UNDER_NODE_MODULES.test(String(id)) ||
    LBC_UNDER_NODE_MODULES.test(String(message))
  );
}

function suppressLbcLwcLoggerNoisePlugin() {
  return {
    name: 'suppress-lbc-lwc-logger-noise',
    configResolved(config) {
      const { logger } = config;
      const origWarn = logger.warn.bind(logger);
      logger.warn = (msg, options) => {
        if (LBC_UNDER_NODE_MODULES.test(String(msg))) return;
        origWarn(msg, options);
      };
      const origWarnOnce = logger.warnOnce.bind(logger);
      logger.warnOnce = (msg, options) => {
        if (LBC_UNDER_NODE_MODULES.test(String(msg))) return;
        origWarnOnce(msg, options);
      };
    },
  };
}

export default defineConfig(({ mode }) => ({
  // Dev/preview precisam de base absoluta para que /src/* resolva da raiz
  // mesmo quando a pagina esta em /demo; gh-pages (project page
  // https://<user>.github.io/<repo>/) precisa de base relativa.
  base: mode === 'gh-pages' ? './' : '/',
  plugins: [
    suppressLbcLwcLoggerNoisePlugin(),
    resolveIconTemplatesPlugin(),
    lwc({
      modules: [
        {
          dir: path.resolve('./src/modules'),
        },
        {
          name: '@salesforce/gate/bc.260.enableComboboxElementInternals',
          path: path.resolve('./src/build/shim/gateComboboxElementInternalsClosed.js'),
        },
        {
          npm: 'lightning-base-components',
        },
      ],
      disableSyntheticShadowSupport: false,
      enableDynamicComponents: true,
      exclude: [
        path.resolve('./index.html'),
        /loading\.css/,
        path.resolve('./src/build/generated'),
        // Local pre-compiled icon bundles and build shims are plain JS, not LWC
        // components (no .html template). Without this, the LWC plugin rewrites
        // the aliased shim import into a component+template pair and the build
        // fails with ENOENT .../iconSvgTemplatesUtility.html. Regex with [/\\]
        // so it matches on Windows and POSIX alike.
        /src[/\\]build[/\\]lightning-icon[/\\]shims/,
        /src[/\\]build[/\\]generated/,
        /src[/\\]build[/\\]shim\//,
        // LBC scoped imports are plain JS shims for @salesforce/* — not components.
        // Without this Vite tries to load their .html templates as
        // /node_modules/.../@salesforce-*.html?import and returns 404.
        /node_modules[/\\]lightning-base-components[/\\]scopedImports\//,
        // LBC internal helpers without a sibling .html template (computed above).
        ...LWC_NON_COMPONENT_EXCLUDES,
        // Global SLDS from node_modules (new URL in slds-loader.js) must not pass through LWC:
        // LWC rejects :root in this pipeline when synthetic shadow is enabled.
        /(salesforce-lightning-design-system\.min\.css|slds2\.cosmos\.css)(\?.*)?$/,
        // Global styles loaded via new URL() pattern must also bypass LWC plugin
        /\/styles\/global\.css(\?.*)?$/,
        ...iconTemplateExcludeDirs,
      ],
    }),
  ],
  build: {
    rollupOptions: {
      onwarn(warning, defaultHandler) {
        if (isLightningBaseComponentsLwcRollupWarning(warning)) return;
        defaultHandler(warning);
      },
    },
  },
  appType: 'spa',
  server: {
    port: 3000,
    open: false,
  },
  optimizeDeps: {
    exclude: ['lightning/modal', 'lightning/toast', 'lightning/toastContainer', 'lightning/showToastEvent', 'lightning/primitiveOverlay', 'lightning/overlayUtils', 'lightning/modalBase', 'lightning/utilsPrivate'],
  },
  resolve: {
    alias: {
      '@salesforce-ux/design-system': path.resolve('./node_modules/@salesforce-ux/design-system'),
      '@salesforce-ux/design-system-2': path.resolve('./node_modules/@salesforce-ux/design-system-2'),
      ...iconTemplateAliases,
    },
  },
}));
