import exifr from 'exifr';

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

const EMPTY_RESULT = { brandKey: null, modelText: '', paramsText: '', subText: '' };

// Only pull the tags this app actually renders — keeps exifr fast since it
// doesn't have to parse the whole EXIF/XMP/IPTC tree.
const PICK_TAGS = ['Make', 'Model', 'FocalLength', 'FNumber', 'ExposureTime', 'ISO', 'DateTimeOriginal'];

function pad2(n) {
  return String(n).padStart(2, '0');
}

/**
 * Read EXIF metadata from a File and resolve to a plain object of the fields
 * this app cares about, already formatted as display strings.
 *
 * Never rejects: if the file has no EXIF (common for screenshots, re-saved
 * or messaging-app-compressed images) or parsing fails for any reason, this
 * resolves with EMPTY_RESULT instead so callers can safely `await` it.
 */
export async function readExif(file) {
  let tags;
  try {
    tags = await exifr.parse(file, { pick: PICK_TAGS });
  } catch (err) {
    console.warn('Không đọc được EXIF của ảnh này:', err);
    return EMPTY_RESULT;
  }

  if (!tags) {
    console.info('Ảnh này không có dữ liệu EXIF (hoặc đã bị xoá khi lưu/chia sẻ).');
    return EMPTY_RESULT;
  }

  const {
    Make: make = '',
    Model: model = '',
    FocalLength: focal,
    FNumber: fNumber,
    ExposureTime: exposure,
    ISO: iso,
    DateTimeOriginal: dateTime
  } = tags;

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
  if (dateTime instanceof Date && !isNaN(dateTime)) {
    subText = `${dateTime.getFullYear()}.${pad2(dateTime.getMonth() + 1)}.${pad2(dateTime.getDate())}`;
  }

  return { brandKey, modelText, paramsText, subText };
}
