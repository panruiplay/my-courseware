require('dotenv').config();
const open = require('open');

open(`http://localhost:${process.env.APP_PORT}`);
