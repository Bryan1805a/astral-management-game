import { prisma } from '../lib/prisma';

export async function process_production(gameId: string, currentTick: number) {
    // Get all colonies in the game, includeing their buidlings
    const colonies = await prisma.colony.findMany({
        where: {gameId: gameId},
        include: {buildings: true}
    });

    // Loop through every colony
    for (const colony of colonies) {
        let resources = colony.resources as Record<string, number>;
        let has_changes = false;

        // Loop through every building in the colony
        for (const building of colony.buildings) {
            if (building.type === "FARM") {
                // Produce 100 rations per tick
                const current_rations = resources["Rations"] || 0;
                resources["Rations"] = current_rations + 100;
                has_changes = true;
            }

            // Add more buidling here
        }

        // Save the updated JSON back to the database
        if (has_changes) {
            await prisma.colony.update({
                where: {id: colony.id},
                data: {resources: resources}
            });
        }
    }
}