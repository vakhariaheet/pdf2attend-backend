import AddBatch from '@/Controllers/Student/AddBatch/AddBatch.controller';
import AddBatchValidate from '@/Controllers/Student/AddBatch/AddBatch.validator';
import AddClass from '@/Controllers/Student/AddClass/AddClass.controller';
import AllBatches from '@/Controllers/Student/AllBatches/AllBatches.controller';
import AllBatchesValidate from '@/Controllers/Student/AllBatches/AllBatches.validator';
import VerifyToken from '@/Middleware/VerifyToken';
import { Router } from 'express';
import multer from 'multer';


const router = Router();
const upload = multer({
    dest: 'files/'
});

router.use(VerifyToken);

router.post('/', upload.single("file"), AddClass);
router.post('/add-batch', AddBatchValidate, AddBatch);
router.get('/batches', AllBatchesValidate, AllBatches);


export default router;