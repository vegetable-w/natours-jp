/* eslint-disable import/no-extraneous-dependencies */
const WebSocket = require('ws');
const Redis = require('ioredis');

const redisClient = new Redis();
const clients = {};

function setupWebSocketServer(server) {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    let userId;

    ws.on('message', async (message) => {
      const data = JSON.parse(message);
      if (data.type === 'auth') {
        // eslint-disable-next-line prefer-destructuring
        userId = data.userId;
        clients[userId] = ws;
        console.log(`User ${userId} connected.`);
      }

      const unreadMessages = await redisClient.lrange(
        `unreadMessages:${userId}`,
        0,
        -1,
      );
      if (unreadMessages.length > 0) {
        ws.send(
          JSON.stringify({
            type: 'unreadMessages',
            payload: unreadMessages.map((msg) => JSON.parse(msg)),
          }),
        );

        await redisClient.del(`unreadMessages:${userId}`);
      }
    });

    ws.on('close', () => {
      if (userId) {
        delete clients[userId];
        console.log(`User ${userId} disconnected.`);
      }
    });
  });
}

module.exports = { setupWebSocketServer, clients };
