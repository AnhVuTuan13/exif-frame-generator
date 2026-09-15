# EXIF Frame Generator (Vue 3 + Vite)

Ứng dụng client-side tạo khung ảnh kèm thông tin EXIF (hãng máy, ống kính,
thông số chụp, ngày/địa điểm), vẽ trực tiếp bằng Canvas — không dùng
html2canvas.

## Cài đặt & chạy

```bash
npm install
npm run dev       # môi trường phát triển, hot-reload
npm run build      # build ra thư mục dist/
npm run preview    # xem thử bản build
```

## Cấu trúc dự án

```
src/
  main.js                     # điểm khởi tạo Vue app
  App.vue                     # ghép các component + state chính
  style.css                   # style toàn cục (design tokens dạng CSS var)

  components/
    AppHeader.vue              # tiêu đề
    ImageDropzone.vue          # ô chọn/kéo-thả ảnh
    TemplatePicker.vue         # lưới chọn mẫu khung
    ControlsPanel.vue          # gộp toàn bộ form điều khiển bên trái
    CanvasPreview.vue          # canvas xem trước bên phải

  composables/
    useExif.js                 # đọc EXIF từ file ảnh, danh sách hãng/logo
    useFrameRenderer.js        # quản lý canvas ref, render(), download()

  templates/
    shared.js                  # helper dùng chung (bo góc, blur nền, tô logo)
    classic.js                 # mẫu Classic
    polaroid.js                # mẫu Polaroid
    minimal.js                 # mẫu Minimal
    filmstrip.js                # mẫu Filmstrip
    postcard.js                 # mẫu Postcard
    index.js                    # registry — nơi khai báo tất cả mẫu
```

## Thêm một mẫu khung mới

1. Tạo file `src/templates/ten-mau.js`, export một object theo đúng hình dạng:

```js
export const tenMau = {
  id: 'ten-mau',
  label: 'Tên hiển thị',
  swatch: '#111',                 // màu/gradient CSS cho ô thumbnail chọn mẫu

  layout(imgW, imgH) {
    // trả về kích thước canvas cuối cùng dựa theo kích thước ảnh gốc
    return { W: imgW, H: imgH };
  },

  async draw(ctx, W, H, data) {
    // data = { rawImage, imageLoaded, selectedBrand, modelText,
    //          paramsText, subText, brandLabel, BRAND_LOGOS }
    // vẽ trực tiếp lên ctx (Canvas 2D context) tại đây
  }
};
```

2. Import và thêm vào registry trong `src/templates/index.js`:

```js
import { tenMau } from './ten-mau.js';

export const TEMPLATES = {
  ...,
  tenMau
};
```

Không cần sửa gì ở `App.vue` hay các component — mẫu mới sẽ tự xuất hiện
trong lưới chọn mẫu.

## Ghi chú

- EXIF được đọc bằng thư viện `exif-js`; nếu ảnh không có EXIF, các trường sẽ
  giữ giá trị người dùng tự nhập.
- Logo hãng máy được tải dưới dạng SVG rồi tô lại màu trắng bằng cách thay
  thuộc tính `fill`, sau đó cache trong bộ nhớ theo cặp (hãng, màu) để tránh
  tải lại nhiều lần.
- Toàn bộ xử lý ảnh diễn ra phía client, không có request nào gửi ảnh lên
  server.
