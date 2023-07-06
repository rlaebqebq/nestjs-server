import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { format } from 'date-fns';

export const multerDiskDestinationOutOptions = {
  storage: diskStorage({
    destination(req, file, callback) {
      const uploadPath = 'uploads';
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath);
      }
      callback(null, uploadPath);
    },
    filename: async (request, file, callback) => {
      const newName = format(new Date(), 'yyyy-MM-dd_HH:mm:ss.SSS');
      callback(null, `${newName}${extname(file.originalname)}`);
    },
  }),
};
