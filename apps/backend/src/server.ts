import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import {PrismaClient} from '@prisma/client';
import pg, { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { request } from 'node:http';
import { error } from 'node:console';

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({adapter});

// Init Fastify server
const server = Fastify({logger: true});

// Register plugins
server.register(cors, {origin: true,});

// Create a check route to test the db
server.get("/ping", async (request, reply) => {
    try {
        const player_count = await prisma.player.count();

        return {
            message: "Astral API is now online.",
            database: "Connected",
            total_player: player_count
        };
    } catch {error} {
        server.log.error(error);
        return reply.status(500).send({error: "Database connection failed"});
    }
});

// Boot the server
const start = async () => {
    try {
        // Listen to port 10000
        // host 0.0.0.0 to ensures it works with Docker and WSL
        await server.listen({port: 10000, host: '0.0.0.0'});
        console.log("Server is running at http://localhost:10000");
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();