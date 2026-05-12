import {FastifyInstance} from 'fastify';
import {verify_token} from '../lib/auth';
import {TickProcessor} from '../engine/TickProcessor';
import { request } from 'node:http';

const tick_engine = new TickProcessor();

export async function game_routes(server: FastifyInstance) {
    server.post("/games/:id/advance", {preHandler: verify_token}, async (request, reply) => {
        try {
            const {id} = request.params as {id: string};
            const {hours} = request.body as {hours: number};

            // Ensure valid number of hours
            if (![1, 5, 24].includes(hours)) {
                return reply.status(400).send({error: "You can only advance time by 1, 5, 24"});
            }

            // Run the engine
            const result = await tick_engine.advance(id, hours);

            return reply.send({
                message: `Advance time by ${hours} hours.`,
                current_tick: result.newTick
            });
        } catch (error: any) {
            server.log.error(error);
            return reply.status(500).send({error: error.message || "Failed to process game tick"});
        }
    });
}