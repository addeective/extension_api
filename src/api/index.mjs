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
  redis:kv,
  keyPrefix: 'ratelimit:',
  limit: 100,  // Requests per window
  window: 60 * 1000  // 1 minute window
});
console.log("Rate limit function is",ratelimit)

const router = express.Router();

router.get('/', async (req, res) => {
  const { limit, reset, remaining } = await ratelimit.limit("toto")
  console.log("Toto Remaining "+remaining)
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/emojis', emojis);

export default router;
