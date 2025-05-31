// src/integrations/prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: 'Ação',           description: 'Filmes cheios de emoção e aventura' },
    { name: 'Comédia',        description: 'Filmes para dar risada' },
    { name: 'Drama',          description: 'Histórias mais sérias e tocantes' },
    { name: 'Ficção Científica', description: 'Viagens no tempo, espaço e futuro' },
    { name: 'Documentário',   description: 'Conteúdos baseados em fatos reais' },
    { name: 'Terror',         description: 'Filmes que arrepiam e assustam' },
    { name: 'Suspense',       description: 'Conflitos que mantêm você na ponta da cadeira' },
    { name: 'Romance',        description: 'Histórias de amor e relacionamentos' },
    { name: 'Mistério',       description: 'Enredos cheios de enigmas e reviravoltas' },
    { name: 'Aventura',       description: 'Jornadas épicas e exploração' },
    { name: 'Fantasia',       description: 'Mundos mágicos e criaturas fantásticas' },
    { name: 'Animação',       description: 'Desenhos e animações para todas as idades' },
    { name: 'Musical',        description: 'Narrativas embaladas por canções e números musicais' },
    { name: 'Biografia',      description: 'Histórias de vida de pessoas reais' },
    { name: 'Histórico',      description: 'Reconstituições de épocas passadas' },
    { name: 'Guerra',         description: 'Conflitos militares e histórias de combate' },
    { name: 'Far West',       description: 'Velho Oeste americano, pistoleiros e saloons' },
    { name: 'Família',        description: 'Filmes para todas as idades, cheios de valores' },
    { name: 'Infantil',       description: 'Conteúdos voltados para crianças' },
    { name: 'Esporte',        description: 'Competições, atletas e grandes feitos esportivos' },
  ];

  for (const cat of categories) {
    const existing = await prisma.category.findFirst({ where: { name: cat.name } });
    if (!existing) {
      await prisma.category.create({ data: cat });
      console.log(`Seeded category: ${cat.name}`);
    } else {
      console.log(`Category "${cat.name}" already exists, skipping.`);
    }
  }

  const adminEmail = 'admin@example.com';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  let adminUser;
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    adminUser = await prisma.user.create({
      data: {
        username: 'Administrador',
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });
    console.log('Admin user created.');
  } else {
    adminUser = existingAdmin;
    console.log('Admin user already exists, skipping.');
  }

  const allCategories = await prisma.category.findMany();

  for (let i = 0; i < 15; i++) {
    const randomCategories = faker.helpers.arrayElements(allCategories, faker.number.int({ min: 1, max: 3 }));

    await prisma.movie.create({
      data: {
        title: faker.lorem.words(3),
        originalTitle: faker.lorem.words(2),
        description: faker.lorem.paragraph(),
        releaseDate: faker.date.past({ years: 20 }),
        recommendedAge: faker.number.int({ min: 0, max: 18 }),
        budget: faker.number.int({ min: 1_000_000, max: 200_000_000 }),
        boxOffice: faker.number.int({ min: 1_000_000, max: 1_000_000_000 }),
        studio: faker.company.name(),
        duration: faker.number.int({ min: 80, max: 180 }),
        rating: faker.number.float({ min: 0, max: 10, fractionDigits: 1 }),
        imageUrl: faker.image.url(),
        userId: adminUser.id,
        categories: {
          connect: randomCategories.map((cat) => ({ id: cat.id })),
        },
      },
    });

    console.log(`Movie ${i + 1} created.`);
  }
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
