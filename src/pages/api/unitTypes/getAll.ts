import type { UnitType } from "@prisma/client";
import type { NextApiHandler, NextApiResponse } from "next";
import { prisma } from "~/server/db";

export type ReturnTypeUnitTypes = (UnitType)[];

const handler: NextApiHandler = async (_, res: NextApiResponse<ReturnTypeUnitTypes>) => {
  const unitTypes = await prisma.unitType.findMany({});

  res.status(200).json(unitTypes);
};

export default handler;
