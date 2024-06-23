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
  const { success, limit, reset, remaining } = await ratelimit.limit(ip)
  console.log("Ip success "+success)
  if (remaining){
    res.json({
      message: 'API - 👋🌎🌍🌏',
    });
  }
  else {
    res.status(429).json({
      message: "Too many requests, please try again later."
    });
  }
});

router.use('/emojis', emojis);

export default router;
