import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import {prisma} from './lib/prisma';
import {auth_routes} from './routes/auth';

const server = Fastify({logger: true});
server.register(cors, {origin: true});

// Register the modular route files
server.register(auth_routes);

server.get('/ping', async (request, reply) => {
    try {
        const player_count = await prisma.player.count();
        return {message: "Astral API is now online", total_players: player_count};
    } catch (error) {
        server.log.error(error);
        return reply.status(500).send({error: "Database connection failed"});
    }
});

const start = async () => {
    try {
        await server.listen({port: 10000, host: "0.0.0.0"});
        console.log("Server is running at http://localhost:10000");
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();