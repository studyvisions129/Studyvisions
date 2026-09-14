import { config } from "dotenv";
config({ path: ".env.local" });

import { PrismaClient } from "@prisma/client";
import { MOCK_PRODUCTS } from "../src/lib/mock-data";

const prisma = new PrismaClient();

const categories = [
  { name: "Physics", iconUrl: "Atom", description: "Mechanics, Optics, Thermodynamics aur sab kuch", levelType: "SUBJECT", color: "from-blue-500 to-cyan-500" },
  { name: "Chemistry", iconUrl: "Beaker", description: "Organic, Inorganic & Physical Chemistry notes", levelType: "SUBJECT", color: "from-emerald-500 to-teal-500" },
  { name: "Mathematics", iconUrl: "Calculator", description: "Calculus, Algebra, Trigonometry aur more", levelType: "SUBJECT", color: "from-purple-500 to-violet-500" },
  { name: "Computer Science", iconUrl: "Code", description: "Python, Java, Data Structures & Algorithms", levelType: "SUBJECT", color: "from-amber-500 to-orange-500" },
];

async function main() {
  console.log("Seeding database...");

  // Seed Categories (Academic Levels)
  for (const cat of categories) {
    const existing = await prisma.academicLevel.findUnique({ where: { slug: cat.name.toLowerCase().replace(/ /g, "-") } });
    if (!existing) {
      await prisma.academicLevel.create({
        data: {
          name: cat.name,
          slug: cat.name.toLowerCase().replace(/ /g, "-"),
          description: cat.description,
          iconUrl: cat.iconUrl,
          color: cat.color,
          levelType: "SUBJECT" as any,
        }
      });
      console.log(`Created category: ${cat.name}`);
    }
  }

  // Seed Products
  for (const prod of MOCK_PRODUCTS) {
    const existing = await prisma.product.findUnique({ where: { slug: prod.slug } });
    if (!existing) {
      // Find category
      const cat = await prisma.academicLevel.findFirst({ where: { name: prod.subject } });

      await prisma.product.create({
        data: {
          title: prod.title,
          slug: prod.slug,
          description: prod.description,
          shortDescription: prod.shortDescription,
          type: prod.type as any,
          price: prod.price,
          compareAtPrice: prod.compareAtPrice,
          language: prod.language,
          fileSize: prod.fileSize,
          totalPages: prod.totalPages,
          tags: prod.tags,
          academicLevelId: cat?.id,
          status: "PUBLISHED",
          isFeatured: true,
          chapters: {
            create: prod.chapters.map((ch, i) => ({
              title: ch.title,
              isFree: ch.isFree,
              sortOrder: i
            }))
          }
        }
      });
      console.log(`Created product: ${prod.title}`);
    }
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
