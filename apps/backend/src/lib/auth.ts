import {FastifyRequest, FastifyReply} from 'fastify';
import jwt from 'jsonwebtoken';

interface JwtPayLoad {
    id: string;
    username: string;
}

export async function verify_token(request: FastifyRequest, reply: FastifyReply) {
    try {
        // Looking for the token in the header
        const auth_header = request.headers.authorization;
        if (!auth_header || !auth_header.startsWith("Bearer ")) {
            return reply.status(401).send({error: "Unauthorized: Missing or invalid token format"});
        }

        const token = auth_header.split(" ")[1];
        const secret = process.env.JWT_SECRET || "fallback_secret";

        // Verify and decode the token
        const decoded = jwt.verify(token, secret) as JwtPayLoad;

        // Attach the player ID to the request so routes know exactly what is calling them
        (request as any).playerId = decoded.id;
    } catch (error) {
        return reply.status(401).send({error: "Unauthorized: Token expired or invalid"});
    }
}