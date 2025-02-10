/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const { Server, EVENTS } = require('@tus/server');
const { FileStore } = require('@tus/file-store');
const path = require('path');
const { handleUploadFinish } = require('../controllers/videoUploadController');

const router = express.Router();

const store = new FileStore({
  directory: path.join(__dirname, '../uploads'),
});

const tusServer = new Server({
  path: '/api/v1/videos/upload/files',
  datastore: store,
});

tusServer.on(EVENTS.POST_FINISH, async (req, res, upload) => {
  try {
    await handleUploadFinish(store, upload);
  } catch (err) {
    console.error(err);
  }
});

router.all('/files/*', (req, res) => {
  if (req.method === 'POST') {
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    // eslint-disable-next-line prefer-destructuring
    const host = req.headers.host;
    const locationUrl = `${protocol}://${host}${req.baseUrl}${req.url}`;

    res.setHeader('Location', locationUrl);
  }

  tusServer.handle(req, res);
});

module.exports = router;
