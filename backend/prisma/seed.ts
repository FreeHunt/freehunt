import { PrismaClient } from '@prisma/client';
import { User, Freelance, Company, Skill, JobPosting } from '@prisma/client';
import {
  fakeUser,
  fakeFreelance,
  fakeCompany,
  fakeSkill,
  fakeJobPosting,
} from './fake-data';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.jobPosting.deleteMany({});
  await prisma.skill.deleteMany({});
  await prisma.freelance.deleteMany({});
  await prisma.company.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Seeding database...');

  // Create skills
  const createdSkills: Skill[] = [];

  // Define the technical and soft skills for type assignment
  const technicalSkills = [
    'JavaScript',
    'Python',
    'React',
    'SQL',
    'AWS',
    'Machine Learning',
    'Docker',
    'Node.js',
    'TypeScript',
    'Git',
  ];

  const softSkills = [
    'Communication',
    'Leadership',
    'Problem Solving',
    'Teamwork',
    'Time Management',
    'Adaptability',
    'Critical Thinking',
    'Emotional Intelligence',
    'Conflict Resolution',
    'Creativity',
  ];

  const randomSkills = [...technicalSkills, ...softSkills];

  for (let i = 0; i < randomSkills.length; i++) {
    const randomSkill = randomSkills[i];

    // Determine skill type based on which array it belongs to
    const skillType = technicalSkills.includes(randomSkill)
      ? 'TECHNICAL'
      : 'SOFT';

    const skill = await prisma.skill.create({
      data: {
        ...fakeSkill(),
        name: randomSkill,
        normalizedName: randomSkill.toLowerCase().replace(/\s+/g, '-'),
        aliases: [
          randomSkill,
          randomSkill.toLowerCase(),
          randomSkill.toUpperCase(),
        ],
        type: skillType, // Add the skill type here
      },
    });
    createdSkills.push(skill);
  }

  console.log(`Created ${randomSkills.length} skills`);

  // Create users and their related entities
  const userCount = 10;
  const freelanceUsers: User[] = [];
  const companyUsers: User[] = [];

  // Create users
  for (let i = 0; i < userCount; i++) {
    const userData = fakeUser();
    const user = await prisma.user.create({
      data: userData,
    });

    if (user.role === 'FREELANCE') {
      freelanceUsers.push(user);
    } else {
      companyUsers.push(user);
    }
  }

  console.log(`Created ${userCount} users`);

  // Create freelance profiles
  const freelances: Freelance[] = [];
  for (const user of freelanceUsers) {
    const freelanceData = fakeFreelance();

    // Add random skills to the freelance
    const skillsToConnect = createdSkills
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 5) + 1);

    const freelance = await prisma.freelance.create({
      data: {
        ...freelanceData,
        user: {
          connect: { id: user.id },
        },
        skills: {
          connect: skillsToConnect.map((skill) => ({ id: skill.id })),
        },
      },
      include: {
        skills: true,
      },
    });

    freelances.push(freelance);
  }

  console.log(`Created ${freelances.length} freelance profiles`);

  // Create company profiles
  const companies: Company[] = [];
  for (const user of companyUsers) {
    const companyData = fakeCompany();

    const company = await prisma.company.create({
      data: {
        ...companyData,
        user: {
          connect: { id: user.id },
        },
      },
    });

    companies.push(company);
  }

  console.log(`Created ${companies.length} company profiles`);

  // Create job postings
  const jobPostings: JobPosting[] = [];
  for (const company of companies) {
    // Create 1-3 job postings per company
    const postingCount = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < postingCount; i++) {
      const jobPostingData = fakeJobPosting();

      // Add random skills to the job posting
      const skillsToConnect = createdSkills
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 7) + 3);

      const jobPosting = await prisma.jobPosting.create({
        data: {
          ...jobPostingData,
          company: {
            connect: { id: company.id },
          },
          skills: {
            connect: skillsToConnect.map((skill) => ({ id: skill.id })),
          },
        },
        include: {
          skills: true,
        },
      });

      jobPostings.push(jobPosting);
    }
  }

  console.log(`Created ${jobPostings.length} job postings`);

  console.log('Database seeding completed!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
