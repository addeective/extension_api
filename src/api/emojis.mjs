
import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  console.log("emojis")
  res.json(['😀', '😳', '🙄']);
});

export default router;
