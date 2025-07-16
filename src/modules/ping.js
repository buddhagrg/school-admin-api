import express from 'express';
import expressAsyncHandler from 'express-async-handler';
const router = express.Router();

const ping = expressAsyncHandler(async (req, res) => {
  res.json({ message: 'ping success' });
});

router.get('', ping);

export { router as pingRoute };
