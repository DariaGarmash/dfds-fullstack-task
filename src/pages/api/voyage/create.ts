import type { Voyage } from "@prisma/client";
import type { NextApiHandler, NextApiResponse, NextApiRequest } from "next";
import { prisma } from "~/server/db";

export type TVoyagePayloadCreate = Omit<Voyage, "id" | "createdAt" | 'updatedAt'> & {
  unitTypes: string[]
}

const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<undefined>
) => {
    if (req.method !== "POST") {
      res.status(405).end();
    }
    const {unitTypes, ...rest} = JSON.parse(req.body) as TVoyagePayloadCreate
    const createdVoyage = await prisma.voyage.create({
      data: {
        ...rest,
        unitTypes: {
          connect: unitTypes.map((unitType) => ({ id: unitType })),
        }
      },
    })

    createdVoyage ? res.status(201) : res.status(500);
    res.end();
    return;
    
};

export default handler;