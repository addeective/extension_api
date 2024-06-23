import { Ratelimit } from '@upstash/ratelimit'
import { kv } from '@vercel/kv'

console.log("Rate limit function is",Ratelimit)
console.log("kv is",kv)

//const express = require('express');
import express from 'express';

//const emojis = require('./emojis.mjs');
import emojis from './emojis.mjs'

// Configure rate limiting
const ratelimit = new Ratelimit({
  redis: kv,
  // 5 requests from the same IP in 10 seconds
  limiter: Ratelimit.slidingWindow(5, '10 s'),
})
console.log("Rate limit function is",ratelimit)

const router = express.Router();

router.get('/', async (req, res) => {
  const ip = req.ip || req.connection.remoteAddress;
  console.log("Ip="+ip);
  const { limit, reset, remaining } = await ratelimit.limit("toto")
  console.log("Toto Remaining "+remaining)
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/emojis', emojis);

export default router;
