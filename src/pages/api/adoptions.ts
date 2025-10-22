import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';  // adjust path to your prisma client

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { name, breed, age, location, image } = req.body;
      const pet = await prisma.pet.create({
        data: { name, breed, age: Number(age), location, image, status: 'available' },
      });
      res.status(200).json(pet);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to add pet' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
