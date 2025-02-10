/* eslint-disable import/no-extraneous-dependencies */
const amqp = require('amqplib');

let channel;

async function connectRabbitMQ() {
  const connection = await amqp.connect('amqp://localhost');
  channel = await connection.createChannel();

  await channel.assertQueue('priceChangeQueue', { durable: true });

  console.log('Connected to RabbitMQ');
  return channel;
}

function getChannel() {
  if (!channel) {
    throw new Error('RabbitMQ channel is not initialized');
  }
  return channel;
}

module.exports = { connectRabbitMQ, getChannel };
