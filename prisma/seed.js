import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function randomFrom(arr) { return arr[Math.floor(Math.random() * arr.length)] }

async function main() {
  console.log('Seeding: clearing existing Pet, MedicalRecord, Post, Alert and AdoptionRequest data...')
  await prisma.medicalRecord.deleteMany().catch(() => {})
  await prisma.adoptionRequest.deleteMany().catch(() => {})
  await prisma.post.deleteMany().catch(() => {})
  await prisma.alert.deleteMany().catch(() => {})
  await prisma.pet.deleteMany().catch(() => {})

  const names = ['Bella','Charlie','Luna','Max','Molly','Simba','Oliver','Lucy','Bailey','Cooper','Daisy','Loki','Rocky','Sadie','Toby','Angel','Zoey','Chloe','Harley','Ruby']
  const species = ['Dog','Cat','Rabbit','Bird']
  const breeds = ['Mixed','Labrador','Maine Coon','Dutch','Parakeet','Beagle','Poodle','Siamese']
  const colors = ['Black','White','Brown','Gray','Golden','Tabby','Calico']

  const createdPets = []

  for (let i = 0; i < 20; i++) {
    const p = {
      name: names[i % names.length] + (i >= names.length ? ` ${i}` : ''),
      species: randomFrom(species),
      breed: randomFrom(breeds),
      age: Math.floor(Math.random() * 12) + 1,
      sex: Math.random() > 0.5 ? 'Female' : 'Male',
      neutered: Math.random() > 0.3,
      microchip: Math.random() > 0.5 ? `MC${Math.floor(100000000 + Math.random() * 900000000)}` : null,
      color: randomFrom(colors),
      weightKg: Number((Math.random() * 30 + 1).toFixed(1)),
      bio: 'Friendly companion looking for a loving home.'
    }
    const pet = await prisma.pet.create({ data: p })
    createdPets.push(pet)
  }

  console.log(`Created ${createdPets.length} pets.`)

  const clinics = ['Happy Paws Clinic','Cat Care Center','Bunny Wellness','Downtown Vet']

  const medicals = []
  for (let i = 0; i < Math.min(10, createdPets.length); i++) {
    medicals.push({
      petId: createdPets[i].id,
      date: new Date(Date.now() - i * 86400000 * 30),
      description: 'Routine check-up and vaccination',
      diagnosis: 'Healthy',
      treatment: 'Vaccination and deworming',
      vetName: randomFrom(clinics),
      notes: 'All good. Recommended balanced diet.'
    })
  }

  for (const m of medicals) {
    await prisma.medicalRecord.create({ data: m })
  }

  console.log(`Created ${medicals.length} medical records.`)

  // Seed a few forum posts
  const posts = [
    { title: 'Tips for new puppy owners', content: 'Share your best tips for training and socialization.' },
    { title: 'Lost tabby near Elm Street', content: 'Have you seen a brown tabby with a blue collar?' },
    { title: 'Best low-cost vets', content: 'Recommend clinics that are affordable and kind.' }
  ]

  for (const p of posts) {
    await prisma.post.create({ data: { title: p.title, content: p.content } })
  }

  console.log(`Created ${posts.length} forum posts.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
