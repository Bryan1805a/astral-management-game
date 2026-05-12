import {prisma} from '../lib/prisma';
import {process_production} from './ProductionSystem';

export class TickProcessor {
    async advance(gameId: string, hours: number) {
        // Fetch the game and lock it to prevent race conditions
        const game = await prisma.game.findUnique({where: {id: gameId}});

        if (!game) throw new Error("Game not found");
        if (game.tick_locked) throw new Error("Game is currently processing a tick. Please wait.");

        // Lock the game in the database
        await prisma.game.update({
            where: {id: gameId},
            data: {tick_locked: true}
        });

        try {
            let current_tick = game.current_tick;

            // The core loop
            for (let i = 0; i < hours; i++) {
                current_tick += 1;

                // Run the system in order
                await process_production(gameId, current_tick);

                // Add process_population
                // Add pricess_market
            }

            // Save the new game time and unlock the game
            await prisma.game.update({
                where: {id: gameId},
                data: {
                    current_tick: current_tick,
                    tick_locked: false
                }
            });

            return {success: true, newTick: current_tick};
        } catch (error) {
            // Failsafe
            await prisma.game.update({
                where: {id: gameId},
                data: {tick_locked: false}
            });

            throw error;
        }
    }
}