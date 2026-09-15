import { classic } from './classic.js';
import { polaroid } from './polaroid.js';
import { minimal } from './minimal.js';
import { filmstrip } from './filmstrip.js';
import { postcard } from './postcard.js';

// Registry of all available frame templates.
// To add a new template: create src/templates/yourTemplate.js exporting an
// object with { id, label, swatch, layout(imgW, imgH), async draw(ctx, W, H, data) }
// then import + list it here. Nothing else needs to change.
export const TEMPLATES = {
  classic,
  polaroid,
  minimal,
  filmstrip,
  postcard
};

export const TEMPLATE_LIST = Object.values(TEMPLATES).map(t => ({
  id: t.id,
  label: t.label,
  swatch: t.swatch
}));
