-- CreateTable
CREATE TABLE "planets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "planets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "colonies" (
    "id" TEXT NOT NULL,
    "population" INTEGER NOT NULL DEFAULT 0,
    "morale" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "resources" JSONB NOT NULL DEFAULT '{}',
    "gameId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "planetId" TEXT NOT NULL,

    CONSTRAINT "colonies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buildings" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'constructing',
    "current_recipe" TEXT,
    "finish_tick" INTEGER,
    "efficiency" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "colonyId" TEXT NOT NULL,

    CONSTRAINT "buildings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tick_events" (
    "id" TEXT NOT NULL,
    "tick" INTEGER NOT NULL,
    "event_type" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "gameId" TEXT NOT NULL,
    "playerId" TEXT,

    CONSTRAINT "tick_events_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "colonies" ADD CONSTRAINT "colonies_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "colonies" ADD CONSTRAINT "colonies_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "colonies" ADD CONSTRAINT "colonies_planetId_fkey" FOREIGN KEY ("planetId") REFERENCES "planets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buildings" ADD CONSTRAINT "buildings_colonyId_fkey" FOREIGN KEY ("colonyId") REFERENCES "colonies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tick_events" ADD CONSTRAINT "tick_events_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tick_events" ADD CONSTRAINT "tick_events_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE SET NULL ON UPDATE CASCADE;
