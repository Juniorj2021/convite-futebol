import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Remove as confirmações 5 horas após o horário marcado para cada futebol.
crons.interval("cleanup-expired-attendance", { hours: 1 }, internal.confirmacoes.removeExpired, {});

export default crons;
