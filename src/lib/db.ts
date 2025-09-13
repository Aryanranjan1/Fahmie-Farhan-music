import { PrismaClient } from '@prisma/client';

// Declare a global variable to hold the Prisma Client instance.
declare global {
  var prisma: PrismaClient | undefined;
}

// Initialize Prisma Client.
// In development, use the global variable to avoid creating new instances on hot reloads.
// In production, create a new instance.
const client = globalThis.prisma || new PrismaClient();

// If in a development environment, assign the client to the global variable.
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = client;
}

export const db = client;