
import { Ratelimit } from '@upstash/ratelimit'
import { kv } from '@vercel/kv'

console.log("Rate limit function is",Ratelimit)
console.log("kv is",kv)

// Configure rate limiting
const ratelimit = new Ratelimit({
  redis: kv,
  // 5 requests from the same IP in 10 seconds
  limiter: Ratelimit.slidingWindow(5, '10 s'),
})
console.log("Rate limit function is",ratelimit)

// const express = require('express');
import express from 'express';

//const morgan = require('morgan');
import morgan from 'morgan';

//const helmet = require('helmet');
import helmet from 'helmet';

//const cors = require('cors');
import cors from 'cors';

//require('dotenv').config();
import dotenv from 'dotenv';
if (process.env.BUILD_ENV==='development'){
  dotenv.config({path:"./.env.local"});
  console.log("KV_REST_API_URL:"+process.env.KV_REST_API_URL)
}

//const middlewares = require('./middlewares');
import {notFound, errorHandler} from './middlewares.mjs';


//const api = require('./api');
import api from './api/index.mjs'

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  console.log("I'm the api called")
  const { limit, reset, remaining } = await ratelimit.limit("toto")
  console.log("Remaining "+remaining)
  await kv.set('jml', {type:'engineer'});
  let data = await kv.get('jml');
  console.log(data.type); // 'value'
  
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
  });
});

app.use('/api/v1', api);

app.use(notFound);
app.use(errorHandler);

export default app;
