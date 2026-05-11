import {FastifyInstance} from 'fastify';
import {prisma} from '../lib/prisma';
import {verify_token} from '../lib/auth';
import { request } from 'node:http';

export async function colony_routes(server: FastifyInstance) {
    // Fetches colony details (inventory, all active buildings)
    server.get("/colonies/:id", {preHandler: verify_token}, async (request, reply) => {
        try {
            const {id} = request.params as {id: string};
            const playerId = (request as any).playerId;

            const colony = await prisma.colony.findUnique({
                where: {id},
                include: {
                    buildings: true, // Join the building table
                    planet: true // Join the planet table
                }
            });

            if (!colony) {
                return reply.status(404).send({error: "Colony not found"});
            }

            // Security check
            // Only the owner can view their colony data
            if (colony.playerId !== playerId) {
                return reply.status(403).send({error: "Forbidden: You do not own this colony"});
            }

            return reply.send(colony);
        } catch (error) {
            server.log.error(error);
            return reply.status(500).send({error: "Internal Server Error"});
        }
    });

    // Construct a building
    server.post("/colonies/:id/build", {preHandler: verify_token}, async (request, reply) => {
        try {
            const {id} = request.params as {id: string};
            const {type} = request.body as {type: string};
            const playerId = (request as any).playerId;

            // Verify the colony exists and belongs to the player
            const colony = await prisma.colony.findUnique({where: {id}});
            if (!colony || colony.playerId !== playerId) {
                return reply.status(403).send({error: "Forbidden: Invalid colony access"});
            }

            // Note: subtracting materials for a constructing will be add later
            // For now just build it instantly

            // Create the building in the database
            const new_building = await prisma.building.create({
                data: {
                    colonyId: id,
                    type: type.toUpperCase(),
                    status: "constructing",

                    // Finish time will be add later
                }
            });

            return reply.status(201).send({
                message: `${type} construction started`,
                building: new_building
            });
        } catch (error) {
            server.log.error(error);
            return reply.status(500).send({error: "Internal Server Error"});
        }
    });
}