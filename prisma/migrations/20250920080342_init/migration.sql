-- CreateTable
CREATE TABLE "Verb" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "kanji" TEXT NOT NULL,
    "stem" TEXT NOT NULL,
    "masu" TEXT NOT NULL,
    "dict" TEXT NOT NULL,
    "te" TEXT NOT NULL,
    "nai" TEXT NOT NULL,
    "ta" TEXT NOT NULL,
    "group" TEXT NOT NULL,
    "meaning" TEXT NOT NULL,
    "masuRead" TEXT NOT NULL,
    "dictRead" TEXT NOT NULL,
    "teRead" TEXT NOT NULL,
    "naiRead" TEXT NOT NULL,
    "taRead" TEXT NOT NULL
);
