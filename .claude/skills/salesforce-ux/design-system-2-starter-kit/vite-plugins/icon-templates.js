/**
 * Vite plugin and config for lightning-base-components icon templates.
 *
 * Redirects all icon template imports (LTR, RTL, and the package's internal
 * ./buildTemplates/templates) to our pre-compiled bundles so the package's HTML
 * in node_modules is never compiled (avoids parse5 errors in build).
 */

import path from 'path';

const projectRoot = path.resolve('./');
const lbcRoot = path.join(projectRoot, 'node_modules/lightning-base-components/src/lightning');
const srcLightning = path.join(projectRoot, 'src/build/lightning-icon/shims');

const ICON_TEMPLATE_DIR_NAMES = [
  'iconSvgTemplatesStandard',
  'iconSvgTemplatesStandardRtl',
  'iconSvgTemplatesUtility',
  'iconSvgTemplatesUtilityRtl',
  'iconSvgTemplatesDoctype',
  'iconSvgTemplatesDoctypeRtl',
  'iconSvgTemplatesAction',
  'iconSvgTemplatesActionRtl',
  'iconSvgTemplatesCustom',
  'iconSvgTemplatesCustomRtl',
  'iconSvgTemplates',
  'iconSvgTemplatesRtl',
];

/** Paths to exclude from LWC compilation so the package's icon template HTML is never compiled. */
export const iconTemplateExcludeDirs = ICON_TEMPLATE_DIR_NAMES.map((dir) => path.join(lbcRoot, dir));

/** Alias map: lightning/iconSvgTemplates* specifier -> path to our pre-compiled bundle. */
export const iconTemplateAliases = {
  'lightning/iconSvgTemplatesUtility': path.join(srcLightning, 'iconSvgTemplatesUtility/iconSvgTemplatesUtility.js'),
  'lightning/iconSvgTemplatesStandard': path.join(srcLightning, 'iconSvgTemplatesStandard/iconSvgTemplatesStandard.js'),
  'lightning/iconSvgTemplatesDoctype': path.join(srcLightning, 'iconSvgTemplatesDoctype/iconSvgTemplatesDoctype.js'),
  'lightning/iconSvgTemplatesAction': path.join(srcLightning, 'iconSvgTemplatesAction/iconSvgTemplatesAction.js'),
  'lightning/iconSvgTemplatesStandardRtl': path.join(srcLightning, 'iconSvgTemplatesStandard/iconSvgTemplatesStandard.js'),
  'lightning/iconSvgTemplatesUtilityRtl': path.join(srcLightning, 'iconSvgTemplatesUtility/iconSvgTemplatesUtility.js'),
  'lightning/iconSvgTemplatesDoctypeRtl': path.join(srcLightning, 'iconSvgTemplatesDoctype/iconSvgTemplatesDoctype.js'),
  'lightning/iconSvgTemplatesActionRtl': path.join(srcLightning, 'iconSvgTemplatesAction/iconSvgTemplatesAction.js'),
  'lightning/iconSvgTemplatesCustom': path.join(srcLightning, 'iconSvgTemplatesStandard/iconSvgTemplatesStandard.js'),
  'lightning/iconSvgTemplatesCustomRtl': path.join(srcLightning, 'iconSvgTemplatesStandard/iconSvgTemplatesStandard.js'),
  'lightning/iconSvgTemplates': path.join(srcLightning, 'iconSvgTemplatesStandard/iconSvgTemplatesStandard.js'),
  'lightning/iconSvgTemplatesRtl': path.join(srcLightning, 'iconSvgTemplatesStandard/iconSvgTemplatesStandard.js'),
};

const BUNDLE_BY_IMPORTER_KEY = [
  ['iconSvgTemplatesStandard', path.join(srcLightning, 'iconSvgTemplatesStandard/iconSvgTemplatesStandard.js')],
  ['iconSvgTemplatesUtility', path.join(srcLightning, 'iconSvgTemplatesUtility/iconSvgTemplatesUtility.js')],
  ['iconSvgTemplatesDoctype', path.join(srcLightning, 'iconSvgTemplatesDoctype/iconSvgTemplatesDoctype.js')],
  ['iconSvgTemplatesAction', path.join(srcLightning, 'iconSvgTemplatesAction/iconSvgTemplatesAction.js')],
];

/**
 * Vite plugin that resolves lightning/iconSvgTemplates* and the package's
 * ./buildTemplates/templates to our pre-compiled bundles (enforce: 'pre').
 */
export function resolveIconTemplatesPlugin() {
  const defaultBundle = iconTemplateAliases['lightning/iconSvgTemplatesStandard'];
  return {
    name: 'resolve-icon-templates',
    enforce: 'pre',
    resolveId(id, importer) {
      const resolved = iconTemplateAliases[id];
      if (resolved) return resolved;
      if (importer && id === './buildTemplates/templates' && importer.includes('lightning-base-components')) {
        for (const [key, bundlePath] of BUNDLE_BY_IMPORTER_KEY) {
          if (importer.includes(key)) return bundlePath;
        }
        return defaultBundle;
      }
      return null;
    },
  };
}
