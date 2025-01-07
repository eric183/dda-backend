import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  try {
    // 读取 JSON 文件
    const rawData = fs.readFileSync(
      path.join(__dirname, '../data', 'quiz/0001.json'),
      'utf8',
    );
    const data = JSON.parse(rawData);

    const { name, category, questions } = data;

    const quiz = await prisma.quiz.create({
      data: {
        name,
        category: {
          connectOrCreate: {
            where: {
              name: category,
            },
            create: {
              name: category,
            },
          },
        },
        questions: {
          create: questions.map((item) => ({
            content: item.question,
            questionIndex: item.questionIndex,
            image: item.image,
            typeClass: item.typeClass,
            options: {
              create: item.options.map((option) => ({
                content: option.content,
                optionIndex: option.optionIndex,
              })),
            },
            optionAnswers: {
              create: item.optionAnswers.map((optionAnswer) => ({
                content: optionAnswer.content,
                optionAnswerIndex: optionAnswer.optionAnswerIndex,
              })),
            },
          })),
        },
      },
    });

    console.log(`Created quiz: ${quiz.id}`);

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
