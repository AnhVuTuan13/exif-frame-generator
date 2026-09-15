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

const EMPTY_RESULT = { brandKey: null, modelText: '', paramsText: '', subText: '' };

/**
 * Read EXIF metadata from a File and resolve to a plain object of the fields
 * this app cares about, already formatted as display strings.
 *
 * Never rejects and never hangs: if exif-js is missing, throws, or simply
 * never calls its callback (seen on some file types/browsers), this resolves
 * with EMPTY_RESULT instead so callers can safely `await` it.
 */
export function readExif(file) {
  const readPromise = new Promise((resolve) => {
    if (typeof EXIF === 'undefined' || typeof EXIF.getData !== 'function') {
      console.warn('exif-js chưa sẵn sàng (EXIF.getData không phải là hàm).');
      resolve(EMPTY_RESULT);
      return;
    }

    try {
      EXIF.getData(file, function () {
        try {
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

          if (!make && !model && !focal && !fNumber && !exposure && !iso && !dateTime) {
            console.info('Ảnh này không có dữ liệu EXIF (hoặc đã bị xoá khi lưu/chia sẻ).');
          }

          resolve({ brandKey, modelText, paramsText, subText });
        } catch (err) {
          console.warn('Lỗi khi phân tích dữ liệu EXIF:', err);
          resolve(EMPTY_RESULT);
        }
      });
    } catch (err) {
      console.warn('exif-js ném lỗi khi gọi getData:', err);
      resolve(EMPTY_RESULT);
    }
  });

  // Safety net: some files/browsers never invoke exif-js's callback at all.
  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => resolve(EMPTY_RESULT), 4000);
  });

  return Promise.race([readPromise, timeoutPromise]);
}
