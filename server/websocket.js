const http = require('http');
const { Server } = require('socket.io');
const crypto = require('crypto');

const PORT = process.env.PORT || 4001;
const ORIGIN = process.env.CORS_ORIGIN || '*';

const httpServer = http.createServer();
const io = new Server(httpServer, {
	cors: {
		origin: ORIGIN,
		methods: ['GET', 'POST'],
	},
});

const users = new Map(); // sessionId -> user
const sockets = new Map(); // socketId -> sessionId
const messages = []; // message history

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
	});

	socket.on('typing-send', (data) => {
		io.emit('typing-receive', {
			socketId: socket.id,
			username: data?.username || user.name || 'Anonymous',
		});
	});

	socket.on('confetti-send', (data) => {
		if (!data?.id || !data?.emoji) return;
		io.emit('confetti-receive', data);
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
	});
});

httpServer.listen(PORT, () => {
	console.log(`WebSocket server listening on ${PORT}`);
});
