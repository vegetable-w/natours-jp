/* eslint-disable import/no-extraneous-dependencies */
const Redis = require('ioredis');
const { connectRabbitMQ } = require('./rabbitmq');
const { clients } = require('./websocket');
const getUsersByTourId = require('../utils/getUsersByTourId');

const redisClient = new Redis();

async function initRabbitMQConsumer() {
  const channel = await connectRabbitMQ();

  channel.consume('priceChangeQueue', async (msg) => {
    const { tourId, tourName, newPrice } = JSON.parse(msg.content.toString());
    const userIds = await getUsersByTourId(tourId);

    userIds.forEach(async (userId) => {
      if (clients[userId]) {
        clients[userId].send(
          JSON.stringify({
            type: 'priceUpdate',
            payload: {
              tourName,
              newPrice,
              timeStamp: new Date().toLocaleString(),
              message: `Price for your favorite tour "${tourName}" has changed to $${newPrice}`,
            },
          }),
        );
      } else {
        await redisClient.lpush(
          `unreadMessages:${userId}`,
          JSON.stringify({
            tourName,
            newPrice,
            timestamp: new Date().toLocalString(),
            message: `Price for your favorite tour "${tourName}" has changed to $${newPrice}`,
          }),
        );
      }
    });

    channel.ack(msg);
  });
}

module.exports = { initRabbitMQConsumer };
