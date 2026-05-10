import {FastifyInstance} from 'fastify';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {prisma} from '../lib/prisma';
import { request } from 'node:http';

// Create a Fastify plugin contains routes
export async function auth_routes(server: FastifyInstance) {
    // Register endpoint
    server.post("/auth/register", async (request, reply) => {
        try {
            // Extract data from request body
            const {username, email, password} = request.body as any;

            // Check if user already exists
            const existing_player = await prisma.player.findFirst({
                where: {OR: [{email}, {username}]}
            });

            if (existing_player) {
                return reply.status(400).send({error: "Username or email already in use."});
            }

            // Hash the password
            const password_hash = await bcrypt.hash(password, 10);

            // Save the new player to the database
            const new_player = await prisma.player.create({
                data: {
                    username,
                    email,
                    password_hash,
                }
            });

            return reply.status(201).send({message: "Player created successfully", playerId: new_player.id})
        } catch (error) {
            server.log.error(error);
            return reply.status(500).send({error: "Internal Server Error"});
        }
    });
};