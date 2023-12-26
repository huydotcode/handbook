import { Server } from 'socket.io';
import User from '@/models/User';
import Message from '@/models/Message';

export default async function SocketHandler(req, res) {
    if (res.socket.server.io) {
        res.end();
        return;
    }
    const io = new Server(res.socket.server);
    io.use((socket, next) => {
        if (socket.user) next();

        const user = socket.handshake.auth.user;
        if (!user) {
            return next(new Error('invalid user'));
        }
        socket.user = user;
        next();
    });

    io.on('connection', async (sk) => {
        await User.findByIdAndUpdate(sk.user.id, { isOnline: true });

        const users = [];

        for (let [id, socket] of io.of('/').sockets) {
            users.push({
                socketId: id,
                userId: socket.user.id,
                name: socket.user.name,
                image: socket.user.image,
            });

            users.filter((user) => user.userId !== sk.user.id);
        }

        sk.broadcast.emit('users', users);

        sk.on('join-room', async ({ roomId }) => {
            console.log('JOIN ROOM');
            await Message.updateMany(
                { roomId, userId: { $ne: sk.user.id } },
                { isRead: true }
            );

            sk.join(roomId);
        });

        sk.on('read-message', ({ roomId }) => {
            console.log('READ MESSAGE');
            sk.to(roomId).emit('read-message', { roomId, userId: sk.user.id });
        });

        sk.on('get-last-messages', async ({ roomId }) => {
            console.log('GET LAST MESSAGE');
            const lastMsg = await Message.find({ roomId })
                .sort({ createdAt: -1 })
                .limit(1);
            sk.emit('get-last-messages', {
                roomId,
                data: lastMsg[0],
            });
        });

        sk.on('leave-room', ({ roomId }) => {
            sk.leave(roomId);
        });

        sk.on('send-message', (message) => {
            io.to(message.roomId).emit('receive-message', message);
        });

        sk.on('delete-message', (message) => {
            io.to(message.roomId).emit('delete-message', message);
        });

        sk.on('users', (param) => {
            const users = [];

            for (let [id, socket] of io.of('/').sockets) {
                users.push({
                    socketId: id,
                    userId: socket.user.id,
                    name: socket.user.name,
                    image: socket.user.image,
                });

                users.filter((user) => user.userId !== sk.user.id);
            }

            sk.emit('users', users);
        });

        sk.on('disconnect', async () => {
            await User.findByIdAndUpdate(sk.user.id, { isOnline: false });

            const users = [];

            for (let [id, socket] of io.of('/').sockets) {
                users.push({
                    socketId: id,
                    userId: socket.user.id,
                    name: socket.user.name,
                    image: socket.user.image,
                });

                users.filter((user) => user.userId !== sk.user.id);
            }

            users.filter((user) => user.userId !== sk.user.id);

            sk.broadcast.emit('users', users);
        });
    });

    res.socket.server.io = io;
    res.end();
}
