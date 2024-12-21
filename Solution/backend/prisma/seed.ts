import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('123456', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@example.com',
      phoneNumber: '000000',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Create initial venue
  const venue = await prisma.venue.create({
    data: {
      name: 'Main Conference Hall',
      address: '123 Tech Street',
      capacity: 5,
    },
  });

  // Create initial activity
  const activity = await prisma.activity.create({
    data: {
      name: 'Keynote Speech',
      description: 'Opening keynote about future tech trends',
    },
  });

  console.log({ admin });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
