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

    // 遍历每个问题
    for (const item of data.data) {
      // 创建 Quiz
      const quiz = await prisma.quiz.create({
        data: {
          parentId: item.parentId,
          quizIndex: item.quizIndex,
          quiz: item.quiz,
          type: item.type === 'radio' ? 'RADIO' : 'MULTIPLE',
          category: item.category,
          // 同时创建选项
          options: {
            create: item.options.map((option) => ({
              content: option,
            })),
          },
          // options: {
          //   create: item.options,
          // },
          optionAnswers: {
            create: item.optionAnswers.map((optionAnswer) => ({
              content: optionAnswer,
            })),
          },
        },
      });

      console.log(`Created quiz: ${quiz.id}`);
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
