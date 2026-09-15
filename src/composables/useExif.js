import EXIF from 'exif-js';

export const BRAND_LOGOS = {
  nikon: 'https://images.contentstack.io/v3/assets/blt0e5ec1de4817c440/bltf00f95fc75d3ad2e/65dcd55ceb46a6e99e7e8089/_nikon-logo-tm.svg',
  sony: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg',
  canon: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8d/Canon_logo.svg/120px-Canon_logo.svg.png',
  fujifilm: 'https://upload.wikimedia.org/wikipedia/commons/a/a1/Fujifilm_logo.svg',
  leica: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ec/Leica_Camera_logo.svg/960px-Leica_Camera_logo.svg.png',
  apple: 'https://www.svgrepo.com/show/503173/apple-logo.svg'
};

export const BRAND_OPTIONS = [
  { value: 'nikon', label: 'Nikon' },
  { value: 'sony', label: 'Sony' },
  { value: 'canon', label: 'Canon' },
  { value: 'fujifilm', label: 'Fujifilm' },
  { value: 'leica', label: 'Leica' },
  { value: 'apple', label: 'Apple' },
  { value: 'custom', label: 'Chữ tự nhập' }
];

function parseRational(val) {
  if (!val) return null;
  if (typeof val === 'number') return val;
  if (val.numerator && val.denominator) return val.numerator / val.denominator;
  return parseFloat(val);
}

/**
 * Read EXIF metadata from a File and resolve to a plain object of the fields
 * this app cares about, already formatted as display strings.
 */
export function readExif(file) {
  return new Promise((resolve) => {
    EXIF.getData(file, function () {
      const make = EXIF.getTag(this, 'Make') || '';
      const model = EXIF.getTag(this, 'Model') || '';
      const focal = parseRational(EXIF.getTag(this, 'FocalLength'));
      const fNumber = parseRational(EXIF.getTag(this, 'FNumber'));
      const exposure = parseRational(EXIF.getTag(this, 'ExposureTime'));
      const iso = EXIF.getTag(this, 'ISOSpeedRatings');
      const dateTime = EXIF.getTag(this, 'DateTimeOriginal') || '';

      let brandKey = null;
      if (make) {
        const lowerMake = make.toLowerCase();
        for (const key in BRAND_LOGOS) {
          if (lowerMake.includes(key)) { brandKey = key; break; }
        }
      }

      const modelText = model ? model.replace(make, '').trim() : '';

      const fText = fNumber ? `f/${fNumber.toFixed(1)}` : '';
      const expText = exposure
        ? (exposure < 1 ? `1/${Math.round(1 / exposure)}s` : `${exposure}s`)
        : '';
      const paramsText = [focal ? `${Math.round(focal)}mm` : '', fText, expText, iso ? `ISO${iso}` : '']
        .filter(Boolean)
        .join('  ');

      let subText = '';
      if (dateTime) {
        const parts = dateTime.split(' ')[0].split(':');
        if (parts.length === 3) subText = `${parts[0]}.${parts[1]}.${parts[2]}`;
      }

      resolve({ brandKey, modelText, paramsText, subText });
    });
  });
}
