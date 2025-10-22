import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding: clearing existing Pet and MedicalRecord data...')
  await prisma.medicalRecord.deleteMany().catch(() => {})
  await prisma.pet.deleteMany().catch(() => {})

  const pets = [
    {
      name: 'Bella',
      species: 'Dog',
      breed: 'Labrador Retriever',
      age: 4,
      sex: 'Female',
      neutered: true,
      microchip: '985001234567891',
      color: 'Yellow',
      weightKg: 28.5,
      bio: 'Loves fetch and swimming. Great with kids.'
    },
    {
      name: 'Mittens',
      species: 'Cat',
      breed: 'Domestic Short Hair',
      age: 2,
      sex: 'Male',
      neutered: true,
      microchip: '985009876543210',
      color: 'Tabby',
      weightKg: 4.3,
      bio: 'Curious and playful. Prefers warm laps.'
    },
    {
      name: 'Pebble',
      species: 'Rabbit',
      breed: 'Dutch',
      age: 1,
      sex: 'Female',
      neutered: false,
      microchip: null,
      color: 'Black & White',
      weightKg: 2.1,
      bio: 'Gentle and shy. Likes leafy greens.'
    }
  ]

  const createdPets = []
  for (const p of pets) {
    const pet = await prisma.pet.create({ data: p })
    createdPets.push(pet)
  }

  console.log(`Created ${createdPets.length} pets.`)

  const medicals = [
    {
      petId: createdPets[0].id,
      date: new Date('2024-02-10'),
      description: 'Annual vaccination and wellness check',
      diagnosis: 'Healthy',
      treatment: 'Rabies vaccine administered',
      vetName: 'Happy Paws Clinic',
      notes: 'Recommended continuing joint supplements.'
    },
    {
      petId: createdPets[1].id,
      date: new Date('2024-06-01'),
      description: 'Ear infection treatment',
      diagnosis: 'Otitis externa',
      treatment: 'Topical antibiotic drops for 10 days',
      vetName: 'Cat Care Center',
      notes: 'Follow-up in 2 weeks.'
    },
    {
      petId: createdPets[2].id,
      date: new Date('2024-08-15'),
      description: 'Check-up; dietary advice',
      diagnosis: 'Healthy',
      treatment: 'Switch to high-fiber pellets',
      vetName: 'Bunny Wellness',
      notes: 'Monitor weight for 1 month.'
    }
  ]

  for (const m of medicals) {
    await prisma.medicalRecord.create({ data: m })
  }

  console.log(`Created ${medicals.length} medical records.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
