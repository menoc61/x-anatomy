import { PrismaClient, User } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import { muscleData } from '../../lib/muscle-data';

const prisma = new PrismaClient();
const saltRounds = 10; 

async function main() {
  console.log('Start seeding ...');

  // --- Create Specific Test Users ---
  console.log('Creating specific test users...');

  const adminPassword = await bcrypt.hash('admin', saltRounds);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@admin.com',
      password: adminPassword,
      role: 'admin',
      status: 'active',
      emailVerified: new Date(),
    },
  });
  console.log(`Created/found admin user: ${adminUser.email}`);

  const subscribedPassword = await bcrypt.hash('user', saltRounds);
  const subscribedUser = await prisma.user.upsert({
    where: { email: 'user@user.com' },
    update: {},
    create: {
      name: 'Subscribed User',
      email: 'user@user.com',
      password: subscribedPassword,
      role: 'user',
      status: 'active',
      emailVerified: new Date(),
    },
  });
  console.log(`Created/found subscribed user: ${subscribedUser.email}`);

  // Create subscription for the subscribed user
  await prisma.subscription.upsert({
    where: { userId: subscribedUser.id },
    update: {},
    create: {
      userId: subscribedUser.id,
      stripeCustomerId: `cus_${faker.string.alphanumeric(14)}`,
      stripeSubscriptionId: `sub_${faker.string.alphanumeric(14)}`,
      planId: 'basic_monthly', // Example plan
      status: 'active',
      currentPeriodEnd: faker.date.future({ years: 1 }),
    },
  });
  console.log(`Created/found subscription for user: ${subscribedUser.email}`);

  const unsubscribedPassword = await bcrypt.hash('testuser', saltRounds);
  const unsubscribedUser = await prisma.user.upsert({
    where: { email: 'test@user.com' },
    update: {},
    create: {
      name: 'Unsubscribed User',
      email: 'test@user.com',
      password: unsubscribedPassword,
      role: 'user',
      status: 'active',
      emailVerified: new Date(),
    },
  });
  console.log(`Created/found unsubscribed user: ${unsubscribedUser.email}`);

  const specificUsers = [adminUser, subscribedUser, unsubscribedUser];

  // --- Create Additional Dummy Users ---
  console.log('Creating additional random dummy users...');
  const randomUsers: User[] = [];
  for (let i = 0; i < 7; i++) { // Create 7 more random users (total 10 with specific ones)
    const randomPassword = await bcrypt.hash(faker.internet.password(), saltRounds);
    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        emailVerified: faker.datatype.boolean(0.7) ? faker.date.past() : null, // 70% chance verified
        password: randomPassword,
        image: faker.image.avatar(),
        role: 'user', // Default random users to 'user' role
        status: faker.helpers.arrayElement(['active', 'inactive']),
      },
    });
    randomUsers.push(user);
    console.log(`Created random user with id: ${user.id}`);
  }

  const allUsers = [...specificUsers, ...randomUsers];

  // --- Create Muscles and Conditions ---
  console.log('Creating muscles and their conditions...');
  const createdMuscles = [];
  for (const key in muscleData) {
    const muscle = muscleData[key];
    const { conditions, videos, ...muscleDetails } = muscle;

    const newMuscle = await prisma.muscle.upsert({
      where: { name: muscle.name },
      update: {},
      create: {
        ...muscleDetails,
        description: muscle.description,
      },
    });
    createdMuscles.push(newMuscle);
    console.log(`Created/found muscle: ${newMuscle.name}`);

    for (const condition of conditions) {
      const existingCondition = await prisma.muscleCondition.upsert({
        where: { name: condition.name },
        update: {},
        create: {
          name: condition.name,
          description: condition.description,
        },
      });

      await prisma.muscleConditionOnMuscle.upsert({
        where: {
          muscleId_muscleConditionId: {
            muscleId: newMuscle.id,
            muscleConditionId: existingCondition.id,
          },
        },
        update: {},
        create: {
          muscleId: newMuscle.id,
          muscleConditionId: existingCondition.id,
        },
      });
      console.log(`Associated condition "${existingCondition.name}" with muscle "${newMuscle.name}"`);
    }
  }

  // --- Create Dummy Videos and Associate with Muscles ---
  console.log('Creating dummy videos and associating with muscles...');
  for (const muscle of createdMuscles) {
    for (let i = 0; i < 2; i++) {
      await prisma.video.create({
        data: {
          title: faker.lorem.sentence(),
          description: faker.lorem.paragraph(),
          url: `https://www.youtube.com/watch?v=${faker.string.alphanumeric(11)}`,
          muscleId: muscle.id,
        },
      });
    }
  }

  // --- Create Dummy Comments and Associate with Muscles ---
  console.log('Creating dummy comments and associating with muscles...');
  for (let i = 0; i < 20; i++) {
    const randomUser = faker.helpers.arrayElement(allUsers);
    const randomMuscle = faker.helpers.arrayElement(createdMuscles);
    const comment = await prisma.comment.create({
      data: {
        content: faker.lorem.sentences(faker.number.int({ min: 1, max: 3 })),
        authorId: randomUser.id,
        approved: faker.datatype.boolean(0.8),
        muscleId: randomMuscle.id,
      },
    });
    console.log(`Created comment id ${comment.id} for muscle "${randomMuscle.name}" by user ${randomUser.id}`);
  }

  // --- Create Dummy Subscriptions for some Random Users ---
  console.log('Creating dummy subscriptions for some random users...');
  for (const user of randomUsers) {
    // ~20% chance a random user has a subscription
    if (faker.datatype.boolean(0.2)) {
      await prisma.subscription.create({
        data: {
          userId: user.id,
          stripeCustomerId: `cus_${faker.string.alphanumeric(14)}`,
          stripeSubscriptionId: `sub_${faker.string.alphanumeric(14)}`,
          planId: faker.helpers.arrayElement(['free_tier', 'basic_monthly', 'pro_yearly']),
          status: faker.helpers.arrayElement(['active', 'trialing', 'canceled']),
          trialEndsAt: faker.datatype.boolean(0.5) ? faker.date.future({ years: 0.1 }) : null, // Approx 1 month
          currentPeriodEnd: faker.date.future({ years: 1 }),
        },
      });
      console.log(`Created random subscription for user ${user.id}`);
    }
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
