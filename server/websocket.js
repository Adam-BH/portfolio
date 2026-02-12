const http = require('http');
const { Server } = require('socket.io');
const crypto = require('crypto');
const express = require('express');

const PORT = process.env.PORT || 4001;
const ORIGIN = process.env.CORS_ORIGIN || '*';

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.sendStatus(204); return; }
  next();
});
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: ORIGIN,
		methods: ['GET', 'POST'],
	},
});

const users = new Map();
const sockets = new Map();
const messages = [];

const log = (...args) => console.log(new Date().toISOString(), ...args);
const MESSAGE_TTL_MINUTES = Number(process.env.MESSAGE_TTL_MINUTES || 60);
const PRUNE_INTERVAL_MS = Number(process.env.PRUNE_INTERVAL_MS || 900000);
const pruneOldMessages = () => {
  const before = messages.length;
  if (!before) return;
  const cutoff = Date.now() - MESSAGE_TTL_MINUTES * 60 * 1000;
  let i = 0;
  while (i < messages.length) {
    const created = Date.parse(messages[i].createdAt);
    if (!Number.isNaN(created) && created < cutoff) {
      messages.splice(i, 1);
    } else {
      i++;
    }
  }
  const after = messages.length;
  if (after !== before) {
    log('prune', { before, after });
    io.emit('msgs-receive-init', messages);
  }
};
setInterval(pruneOldMessages, PRUNE_INTERVAL_MS);

const randomName = () => `Guest-${Math.floor(1000 + Math.random() * 9000)}`;
const randomColor = () => {
	const colors = [
		'#60a5fa',
		'#f87171',
		'#4ade80',
		'#facc15',
		'#c084fc',
		'#fb923c',
		'#f43f5e',
		'#818cf8',
		'#22d3ee',
		'#a3e635',
	];
	return colors[Math.floor(Math.random() * colors.length)];
};

const buildUser = (sessionId, socketId) => ({
	id: sessionId,
	socketId,
	name: randomName(),
	avatar: sessionId.slice(0, 8),
	color: randomColor(),
	isOnline: 'online',
	posX: 0,
	posY: 0,
	location: 'Earth',
	flag: '🌍',
	lastSeen: new Date().toISOString(),
	createdAt: new Date().toISOString(),
});

const emitUsers = () => {
  io.emit('users-updated', Array.from(users.values()));
};

io.on('connection', (socket) => {
  	const requestedSessionId = socket.handshake.auth?.sessionId;
  	const sessionId = requestedSessionId || crypto.randomUUID();

  	let user = users.get(sessionId);
  	if (user) {
  		user.socketId = socket.id;
  		user.isOnline = 'online';
  		user.lastSeen = new Date().toISOString();
  	} else {
  		user = buildUser(sessionId, socket.id);
  		users.set(sessionId, user);
  	}

  	sockets.set(socket.id, sessionId);

  	socket.emit('session', { sessionId });
  	socket.emit('msgs-receive-init', messages);
  	emitUsers();
  log('connect', { sessionId, socketId: socket.id, users: users.size, messages: messages.length });

	socket.on('cursor-change', (data) => {
		const sessionId = sockets.get(socket.id);
		const user = sessionId ? users.get(sessionId) : null;
		if (!user) return;

		user.posX = data?.pos?.x ?? user.posX;
		user.posY = data?.pos?.y ?? user.posY;

		io.emit('cursor-changed', {
			...user,
			pos: { x: user.posX, y: user.posY },
			socketId: socket.id,
		});
	});

	socket.on('update-user', (data) => {
		const sessionId = sockets.get(socket.id);
		const user = sessionId ? users.get(sessionId) : null;
		if (!user) return;

		if (typeof data?.username === 'string') user.name = data.username;
		if (typeof data?.avatar === 'string') user.avatar = data.avatar;
		if (typeof data?.color === 'string') user.color = data.color;

		emitUsers();
    log('update-user', { sessionId, name: user.name, avatar: user.avatar, color: user.color });
	});

	socket.on('msg-send', (data) => {
		const sessionId = sockets.get(socket.id);
		const user = sessionId ? users.get(sessionId) : null;
		if (!user || !data?.content) return;

		const msg = {
			id: `${Date.now()}-${Math.random()}`,
			sessionId: user.id,
			flag: user.flag,
			country: user.location,
			username: user.name,
			avatar: user.avatar,
			color: user.color,
			content: String(data.content).slice(0, 2000),
			createdAt: new Date().toISOString(),
		};

		messages.push(msg);
		if (messages.length > 200) messages.shift();

		io.emit('msg-receive', msg);
    log('msg-send', { sessionId, length: msg.content.length, messages: messages.length });
	});

	socket.on('typing-send', (data) => {
		io.emit('typing-receive', {
			socketId: socket.id,
			username: data?.username || user.name || 'Anonymous',
		});
    log('typing', { socketId: socket.id });
	});

	socket.on('confetti-send', (data) => {
		if (!data?.id || !data?.emoji) return;
		io.emit('confetti-receive', data);
    log('confetti', { socketId: socket.id, id: data.id });
	});

	socket.on('disconnect', () => {
		const sessionId = sockets.get(socket.id);
		sockets.delete(socket.id);
		if (!sessionId) return;

		const user = users.get(sessionId);
		if (user) {
			users.delete(sessionId);
		}
		emitUsers();
    log('disconnect', { sessionId, users: users.size });
    if (users.size === 0 && messages.length) {
      const before = messages.length;
      messages.length = 0;
      io.emit('msgs-cleared');
      io.emit('msgs-receive-init', messages);
      log('cleared-on-empty', { before, after: messages.length });
    }
	});
});

app.get('/health', (req, res) => {
  const payload = { status: 'ok', users: users.size, messages: messages.length, uptime: process.uptime() };
  log('http-health', payload);
  res.json(payload);
});

app.post('/chats/clear', (req, res) => {
  const before = messages.length;
  const olderThanMinutes = Number(req.body && req.body.olderThanMinutes) || 0;
  if (olderThanMinutes > 0) {
    const cutoff = Date.now() - olderThanMinutes * 60 * 1000;
    let i = 0;
    while (i < messages.length) {
      const created = Date.parse(messages[i].createdAt);
      if (!Number.isNaN(created) && created < cutoff) {
        messages.splice(i, 1);
      } else {
        i++;
      }
    }
  } else {
    messages.length = 0;
  }
  io.emit('msgs-cleared');
  io.emit('msgs-receive-init', messages);
  const result = { ok: true, before, after: messages.length, olderThanMinutes };
  log('http-chats-clear', result);
  res.json(result);
});

httpServer.listen(PORT, () => {
  log('server-start', { port: PORT, origin: ORIGIN });
});
