import {
  PrismaClient,
  UserRole,
  Gender,
  MembershipType,
  CoachLevel,
  ApprovalStatus,
  SkillLevel,
  ProductType,
  ResortStatus,
  SlopeDifficulty,
  LiftType,
} from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Seeding database...');

    // Create admin user
    const hashedPassword = await hash('password123', 10);
    const admin = await prisma.user.upsert({
      where: { email: 'admin@ski.com' },
      update: {},
      create: {
        email: 'admin@ski.com',
        password: hashedPassword,
        name: 'Admin',
        nickname: 'Admin',
        roles: [UserRole.CUSTOMER],
        gender: Gender.OTHER,
        isVerified: true,
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      },
    });

    console.log(`Created admin user: ${admin.email}`);

    // Create a ski resort
    const resort = await prisma.skiResort.upsert({
      where: { id: 1 },
      update: {},
      create: {
        name: 'Alpine Heights',
        description:
          'A beautiful ski resort with scenic mountain views and a variety of slopes for all skill levels.',
        location: 'Chongli, Hebei Province, China',
        latitude: 40.9584,
        longitude: 115.4688,
        elevation: 2100,
        totalSlopes: 20,
        totalLifts: 8,
        openingHours: JSON.stringify({
          weekdays: '9:00-17:00',
          weekends: '8:00-18:00',
          holidays: '8:00-18:00',
        }),
        contactInfo: JSON.stringify({
          phone: '+86 10 12345678',
          email: 'info@alpineheights.com',
          website: 'www.alpineheights.com',
        }),
        amenities: JSON.stringify([
          'Restaurants',
          'Ski Shop',
          'Equipment Rental',
          'Ski School',
          'Childcare',
          'Lodging',
        ]),
        status: ResortStatus.OPEN,
        images: JSON.stringify([
          'https://example.com/resort1.jpg',
          'https://example.com/resort2.jpg',
        ]),
      },
    });

    console.log(`Created ski resort: ${resort.name}`);

    // Create a few regular users
    const users = [];
    for (let i = 1; i <= 5; i++) {
      const user = await prisma.user.upsert({
        where: { email: `user${i}@example.com` },
        update: {},
        create: {
          email: `user${i}@example.com`,
          password: await hash(`password${i}`, 10),
          name: `User ${i}`,
          nickname: `Skier ${i}`,
          roles: [UserRole.CUSTOMER],
          gender: i % 2 === 0 ? Gender.FEMALE : Gender.MALE,
          isVerified: true,
          avatar: `https://randomuser.me/api/portraits/${
            i % 2 === 0 ? 'women' : 'men'
          }/${i}.jpg`,
          member: {
            create: {
              membershipNumber: `MEM-${1000 + i}`,
              membershipType:
                i <= 2
                  ? MembershipType.BASIC
                  : i <= 4
                  ? MembershipType.SILVER
                  : MembershipType.GOLD,
              startDate: new Date(),
              expiryDate: new Date(
                new Date().setFullYear(new Date().getFullYear() + 1),
              ),
              discountRate: i <= 2 ? 1.0 : i <= 4 ? 0.9 : 0.8,
            },
          },
          addresses: {
            create: {
              name: `User ${i}`,
              phone: `1380000000${i}`,
              province: 'Beijing',
              city: 'Beijing',
              district: 'Chaoyang',
              detailAddress: `Sample address ${i}`,
              postalCode: '100000',
              isDefault: true,
            },
          },
        },
      });
      users.push(user);
      console.log(`Created user: ${user.email}`);
    }

    // Create coaches
    const coaches = [];
    for (let i = 1; i <= 3; i++) {
      // First create the user
      const coachUser = await prisma.user.upsert({
        where: { email: `coach${i}@example.com` },
        update: {},
        create: {
          email: `coach${i}@example.com`,
          password: await hash(`coach${i}`, 10),
          name: `Coach ${i}`,
          nickname: `Pro Coach ${i}`,
          roles: [UserRole.COACH],
          gender: i % 2 === 0 ? Gender.FEMALE : Gender.MALE,
          isVerified: true,
          avatar: `https://randomuser.me/api/portraits/${
            i % 2 === 0 ? 'women' : 'men'
          }/${i + 10}.jpg`,
        },
      });

      // Then create the coach profile
      const coach = await prisma.coach.upsert({
        where: { userId: coachUser.id },
        update: {},
        create: {
          userId: coachUser.id,
          bio: `Professional ski instructor with ${5 + i} years of experience.`,
          specialties: JSON.stringify([
            'Alpine Skiing',
            'Snowboarding',
            i === 1 ? 'Children Training' : 'Advanced Techniques',
          ]),
          experienceYears: 5 + i,
          certifications: JSON.stringify([
            'Level 3 Certification',
            'First Aid',
          ]),
          hourlyRate: 200 + i * 50,
          coachLevel:
            i === 1
              ? CoachLevel.INTERMEDIATE
              : i === 2
              ? CoachLevel.ADVANCED
              : CoachLevel.EXPERT,
          languagesSpoken: JSON.stringify([
            'Chinese',
            'English',
            i === 3 ? 'French' : 'Japanese',
          ]),
          rating: 4.5 + (i * 0.1 > 0.5 ? 0.5 : i * 0.1),
          approvalStatus: ApprovalStatus.APPROVED,
          approvedAt: new Date(),
          resortId: resort.id,
        },
      });

      coaches.push(coach);
      console.log(`Created coach: ${coachUser.email}`);

      // Create lessons for each coach
      const skills = [
        SkillLevel.BEGINNER,
        SkillLevel.INTERMEDIATE,
        SkillLevel.ADVANCED,
      ];
      for (let j = 1; j <= 2; j++) {
        const lesson = await prisma.lesson.create({
          data: {
            coachId: coach.id,
            name: `${j === 1 ? 'Basic' : 'Advanced'} ${
              j === 1 ? 'Skiing' : 'Snowboarding'
            } with Coach ${i}`,
            description: `Learn ${j === 1 ? 'basic' : 'advanced'} ${
              j === 1 ? 'skiing' : 'snowboarding'
            } techniques with our experienced coach.`,
            skillLevel: skills[(i + j) % 3],
            maxParticipants: 5,
            duration: 60 + j * 30,
            price: 300 + i * 50 + j * 100,
            isPrivate: j === 2,
            location: `Slope ${j} at ${resort.name}`,
          },
        });
        console.log(`Created lesson: ${lesson.name}`);
      }
    }

    // Create product categories
    const categories = [];
    const categoryNames = [
      'Ski Equipment',
      'Snowboard Equipment',
      'Clothing',
      'Accessories',
    ];

    for (let i = 0; i < categoryNames.length; i++) {
      const category = await prisma.category.upsert({
        where: { id: i + 1 },
        update: {},
        create: {
          name: categoryNames[i],
          description: `All ${categoryNames[i].toLowerCase()} items`,
          sortOrder: i,
          image: `https://example.com/category${i + 1}.jpg`,
        },
      });
      categories.push(category);
      console.log(`Created category: ${category.name}`);
    }

    // Create products
    const productTypes = [
      ProductType.SKI_EQUIPMENT,
      ProductType.SNOWBOARD_EQUIPMENT,
      ProductType.CLOTHING,
      ProductType.ACCESSORY,
    ];
    const productNames = [
      'Advanced Skis',
      'Pro Snowboard',
      'Winter Jacket',
      'Ski Goggles',
    ];

    for (let i = 0; i < productNames.length; i++) {
      const product = await prisma.product.create({
        data: {
          name: productNames[i],
          description: `High-quality ${productNames[
            i
          ].toLowerCase()} for all ski enthusiasts.`,
          categoryId: categories[i].id,
          price: 1000 + i * 500,
          salePrice: i % 2 === 0 ? 900 + i * 500 : null,
          inventory: 50,
          sku: `SKU-${1000 + i}`,
          images: JSON.stringify([
            `https://example.com/product${i + 1}_1.jpg`,
            `https://example.com/product${i + 1}_2.jpg`,
          ]),
          isFeatured: i < 2,
          productType: productTypes[i],
          specifications: JSON.stringify({
            brand: i % 2 === 0 ? 'Alpine Pro' : 'SnowMaster',
            material: i < 2 ? 'Carbon Fiber' : 'Gore-Tex',
            weight: `${i + 1}.5 kg`,
            size: i < 2 ? '170cm' : 'L',
          }),
          // Create SKUs for each product
          skus: {
            createMany: {
              data: [
                {
                  skuCode: `${productNames[i]
                    .replace(/\s+/g, '-')
                    .toLowerCase()}-size1`,
                  attributes: JSON.stringify({
                    size: i < 2 ? '160cm' : 'M',
                    color: 'Red',
                  }),
                  price: 1000 + i * 500,
                  inventory: 20,
                  isDefault: true,
                },
                {
                  skuCode: `${productNames[i]
                    .replace(/\s+/g, '-')
                    .toLowerCase()}-size2`,
                  attributes: JSON.stringify({
                    size: i < 2 ? '170cm' : 'L',
                    color: 'Blue',
                  }),
                  price: 1100 + i * 500,
                  inventory: 15,
                },
                {
                  skuCode: `${productNames[i]
                    .replace(/\s+/g, '-')
                    .toLowerCase()}-size3`,
                  attributes: JSON.stringify({
                    size: i < 2 ? '180cm' : 'XL',
                    color: 'Black',
                  }),
                  price: 1200 + i * 500,
                  inventory: 15,
                },
              ],
            },
          },
        },
      });
      console.log(`Created product: ${product.name}`);
    }

    // Create a few slopes for the resort
    const slopeDifficulties = [
      SlopeDifficulty.BEGINNER,
      SlopeDifficulty.INTERMEDIATE,
      SlopeDifficulty.ADVANCED,
      SlopeDifficulty.EXPERT,
    ];
    for (let i = 1; i <= 4; i++) {
      const slope = await prisma.skiSlope.create({
        data: {
          resortId: resort.id,
          name: `Slope ${i}`,
          description: `A ${slopeDifficulties[i - 1]
            .toString()
            .toLowerCase()} level slope with beautiful views.`,
          length: 1000 + i * 500,
          difficulty: slopeDifficulties[i - 1],
          verticalDrop: 100 + i * 50,
          avgGrade: 5 + i * 3,
          maxGrade: 10 + i * 5,
          isGroomed: i < 3,
          isLighted: i < 2,
        },
      });
      console.log(`Created slope: ${slope.name}`);
    }

    // Create lifts for the resort
    const liftTypes = [
      LiftType.CHAIR_LIFT,
      LiftType.GONDOLA,
      LiftType.MAGIC_CARPET,
      LiftType.T_BAR,
    ];
    for (let i = 1; i <= 4; i++) {
      const lift = await prisma.skiLift.create({
        data: {
          resortId: resort.id,
          name: `Lift ${i}`,
          description: `${liftTypes[i - 1]
            .toString()
            .replace('_', ' ')
            .toLowerCase()} serving multiple slopes.`,
          liftType: liftTypes[i - 1],
          capacity: 1000 + i * 200,
          length: 800 + i * 300,
          verticalRise: 200 + i * 100,
          duration: 5 + i,
          waitTime: i * 2,
        },
      });
      console.log(`Created lift: ${lift.name}`);
    }

    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
