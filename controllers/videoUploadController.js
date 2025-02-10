/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');
const { v2: cloudinary } = require('cloudinary');
const mongoose = require('mongoose');
const Video = require('../models/videoModel');
const Tour = require('../models/tourModel');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const handleUploadFinish = async (store, upload) => {
  try {
    const { metadata, id } = upload;
    console.log(metadata);

    // eslint-disable-next-line no-unused-vars
    const { filename, title, content, user, tour } = metadata || {};
    const tourDoc = await Tour.findOne({ name: tour });
    const userId = mongoose.Types.ObjectId(user);

    const ext = filename ? path.extname(filename) : '.mp4';

    const localFilePath = path.join(store.directory, id);
    const newFilePath = localFilePath + ext;

    fs.renameSync(localFilePath, newFilePath);

    // 上传到 Cloudinary
    const result = await cloudinary.uploader.upload(newFilePath, {
      resource_type: 'video',
      chunk_size: 6000000,
    });

    const { public_id, secure_url } = result;

    await Video.create({
      title: title,
      discription: content,
      user: userId,
      tour: tourDoc._id,
      cloudinaryPublicId: public_id,
      filePath: secure_url,
    });

    if (fs.existsSync(newFilePath)) {
      fs.unlinkSync(newFilePath);
    }

    const jsonFilePath = `${localFilePath}.json`;
    if (fs.existsSync(jsonFilePath)) {
      fs.unlinkSync(jsonFilePath);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = { handleUploadFinish };
