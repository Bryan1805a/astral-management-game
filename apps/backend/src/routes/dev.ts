import {FastifyInstance} from 'fastify';
import {prisma} from '../lib/prisma';
import {verify_token} from '../lib/auth';
import { request } from 'node:http';

export async function dev_routes(server: FastifyInstance) {
    // A temporary route to set up testing environment
    server.post("/dev/seed", {preHandler: verify_token}, async (request, reply) => {
        try {
            const playerId = (request as any).playerId;

            // Create a dummy planet
            const planet = await prisma.planet.create({
                data: {
                    name: "XK-590D",
                    type: "Rocky"
                }
            });

            // Create a dummy Game Session
            const game = await prisma.game.create({
                data: {
                    name: "Local Test Universe",
                    status: "running",
                    playerId: playerId
                }
            });

            // Create Colony and starting resources
            const colony = await prisma.colony.create({
                data: {
                    playerId: playerId,
                    gameId: game.id,
                    planetId: planet.id,
                    population: 1000,
                    resources: {"Steel": 5000, "Concrete": 5000, "Rations": 1000}
                }
            });

            return reply.status(201).send({
                message: "Dev environment seeded successfully.",
                colonyId: colony.id,
                planetName: planet.name
            });
        } catch (error) {
            server.log.error(error);
            return reply.status(500).send({error: "Failed to seed database"});
        }
    });
}