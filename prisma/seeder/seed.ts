import { PrismaClient, User } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import { muscleData } from '../../lib/muscle-data';

const prisma = new PrismaClient();
const saltRounds = 10;

async function resetDatabase() {
  console.log('Resetting existing data...');
  await prisma.muscleConditionOnMuscle.deleteMany();
  await prisma.video.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.muscleCondition.deleteMany();
  await prisma.muscle.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();
}

async function main() {
  console.log('Start seeding ...');
  faker.seed(2026);

  await resetDatabase();

  // --- Create Specific Test Users ---
  console.log('Creating specific test users...');

  const adminPassword = await bcrypt.hash('admin', saltRounds);
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@admin.com',
      password: adminPassword,
      role: 'admin',
      status: 'active',
      emailVerified: new Date(),
    },
  });
  console.log(`Created admin user: ${adminUser.email}`);

  const subscribedPassword = await bcrypt.hash('user', saltRounds);
  const subscribedUser = await prisma.user.create({
    data: {
      name: 'Subscribed User',
      email: 'user@user.com',
      password: subscribedPassword,
      role: 'user',
      status: 'active',
      emailVerified: new Date(),
    },
  });
  console.log(`Created subscribed user: ${subscribedUser.email}`);

  await prisma.subscription.create({
    data: {
      userId: subscribedUser.id,
      stripeCustomerId: `cus_${faker.string.alphanumeric(14)}`,
      stripeSubscriptionId: `sub_${faker.string.alphanumeric(14)}`,
      planId: 'basic_monthly',
      status: 'active',
      currentPeriodEnd: faker.date.future({ years: 1 }),
    },
  });

  const unsubscribedPassword = await bcrypt.hash('testuser', saltRounds);
  const unsubscribedUser = await prisma.user.create({
    data: {
      name: 'Unsubscribed User',
      email: 'test@user.com',
      password: unsubscribedPassword,
      role: 'user',
      status: 'active',
      emailVerified: new Date(),
    },
  });
  console.log(`Created unsubscribed user: ${unsubscribedUser.email}`);

  const specificUsers = [adminUser, subscribedUser, unsubscribedUser];

  // --- Create Additional Dummy Users ---
  console.log('Creating additional random dummy users...');
  const randomUsers: User[] = [];
  for (let i = 0; i < 7; i++) {
    const randomPassword = await bcrypt.hash(`user-${i + 1}`, saltRounds);
    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: `demo${i + 1}@local.dev`,
        emailVerified: faker.datatype.boolean(0.7) ? faker.date.past() : null,
        password: randomPassword,
        image: faker.image.avatar(),
        role: 'user',
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

    const newMuscle = await prisma.muscle.create({
      data: {
        ...muscleDetails,
        description: muscle.description,
      },
    });
    createdMuscles.push(newMuscle);
    console.log(`Created muscle: ${newMuscle.name}`);

    for (const condition of conditions) {
      const createdCondition = await prisma.muscleCondition.upsert({
        where: { name: condition.name },
        update: { description: condition.description },
        create: {
          name: condition.name,
          description: condition.description,
        },
      });

      await prisma.muscleConditionOnMuscle.create({
        data: {
          muscleId: newMuscle.id,
          muscleConditionId: createdCondition.id,
        },
      });
    }

    if (videos.length > 0) {
      for (const video of videos) {
        await prisma.video.create({
          data: {
            title: video.title,
            description: video.description,
            url: video.url,
            muscleId: newMuscle.id,
          },
        });
      }
    } else {
      for (let i = 0; i < 2; i++) {
        await prisma.video.create({
          data: {
            title: `${newMuscle.name} - Demo Video ${i + 1}`,
            description: faker.lorem.paragraph(),
            url: `https://www.youtube.com/watch?v=${faker.string.alphanumeric(11)}`,
            muscleId: newMuscle.id,
          },
        });
      }
    }
  }

  // --- Create Comments and Associate with Muscles ---
  console.log('Creating dummy comments and associating with muscles...');
  for (let i = 0; i < 20; i++) {
    const randomUser = faker.helpers.arrayElement(allUsers);
    const randomMuscle = faker.helpers.arrayElement(createdMuscles);

    await prisma.comment.create({
      data: {
        content: faker.lorem.sentences(faker.number.int({ min: 1, max: 3 })),
        authorId: randomUser.id,
        approved: faker.datatype.boolean(0.8),
        muscleId: randomMuscle.id,
      },
    });
  }

  // --- Create Dummy Subscriptions for some Random Users ---
  console.log('Creating dummy subscriptions for some random users...');
  for (const user of randomUsers) {
    if (faker.datatype.boolean(0.2)) {
      await prisma.subscription.create({
        data: {
          userId: user.id,
          stripeCustomerId: `cus_${faker.string.alphanumeric(14)}`,
          stripeSubscriptionId: `sub_${faker.string.alphanumeric(14)}`,
          planId: faker.helpers.arrayElement(['free_tier', 'basic_monthly', 'pro_yearly']),
          status: faker.helpers.arrayElement(['active', 'trialing', 'canceled']),
          trialEndsAt: faker.datatype.boolean(0.5) ? faker.date.future({ years: 0.1 }) : null,
          currentPeriodEnd: faker.date.future({ years: 1 }),
        },
      });
    }
  }

  console.log('Seeding finished.');
  console.log('Demo credentials: admin@admin.com / admin, user@user.com / user, test@user.com / testuser');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
