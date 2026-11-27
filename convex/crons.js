import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Remove as confirmações 24 horas após o horário marcado para cada futebol.
crons.interval("limpar confirmações expiradas", { hours: 1 }, internal.confirmacoes.removeExpired, {});

export default crons;
