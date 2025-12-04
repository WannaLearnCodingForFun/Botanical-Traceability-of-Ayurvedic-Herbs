import { Router } from 'express';
import QRCode from 'qrcode';

export const router = Router();

router.get('/batch/:batchId.png', async (req, res) => {
  const { batchId } = req.params;
  const dataUrl = await QRCode.toDataURL(JSON.stringify({ t: 'batch', batchId }));
  const img = Buffer.from(dataUrl.split(',')[1], 'base64');
  res.setHeader('Content-Type', 'image/png');
  res.send(img);
});




