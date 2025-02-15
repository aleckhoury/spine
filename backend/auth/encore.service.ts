import { Service } from "encore.dev/service";
import prisma from "../database/prismaClient";

// Encore will consider this directory and all its subdirectories as part of the "auth" service.
// https://encore.dev/docs/ts/primitives/services
export default new Service("auth");
