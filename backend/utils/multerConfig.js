// // utils/multerConfig.js
// import multer from 'multer';
// import path from 'path';

// // กำหนดที่เก็บไฟล์
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/'); // โฟลเดอร์ปลายทาง
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     const ext = path.extname(file.originalname);
//     cb(null, file.fieldname + '-' + uniqueSuffix + ext); // ตั้งชื่อไฟล์ใหม่
//   }
// });

// // ตรวจสอบชนิดไฟล์ PDF
// const fileFilter = function (req, file, cb) {
//   if (file.mimetype === 'application/pdf') {
//     cb(null, true);
//   } else {
//     cb(new Error('Only PDF files are allowed'), false);
//   }
// };

// // สร้าง middleware upload
// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
//   limits: { fileSize: 10 * 1024 * 1024 } // จำกัดขนาด 10MB
// });

// export default upload;
