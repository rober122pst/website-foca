import multer from 'multer'
import path from 'path';

// Configuração de armazenamento
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = Date.now() + '-' + Math.round(Math.random() * 1000) + ext;
        cb(null, filename);
    },
});

// Filtro opcional de tipo de arquivo
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de arquivo não permitido'), false);
    }
};

// Exporta o middleware pronto pra usar
const upload = multer({ storage, fileFilter });
module.exports = upload;
