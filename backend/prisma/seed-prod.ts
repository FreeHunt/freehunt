import { PrismaClient } from '@prisma/client';
import {
  Role,
  SkillType,
  JobPostingLocation,
  CheckpointStatus,
  ProjectStatus,
  type Skill,
  type User,
  type Freelance,
  type Company,
  type JobPosting,
  type Checkpoint,
  type Project,
} from '@prisma/client';
import fetch from 'node-fetch';

const prisma = new PrismaClient();

const AUTHENTIK_URL = process.env.AUTHENTIK_URL!;
const AUTHENTIK_TOKEN = process.env.AUTHENTIK_TOKEN!;

// Données réalistes en français
const REALISTIC_DATA = {
  // Compétences techniques réelles
  TECHNICAL_SKILLS: [
    { name: 'JavaScript', aliases: ['JS', 'ECMAScript', 'Node.js'] },
    { name: 'TypeScript', aliases: ['TS'] },
    { name: 'React', aliases: ['React.js', 'ReactJS'] },
    { name: 'Vue.js', aliases: ['Vue', 'VueJS'] },
    { name: 'Angular', aliases: ['AngularJS'] },
    { name: 'Python', aliases: ['Python3'] },
    { name: 'Java', aliases: ['JDK', 'JVM'] },
    { name: 'PHP', aliases: ['PHP8'] },
    { name: 'C#', aliases: ['C Sharp', 'ASP.NET'] },
    { name: 'SQL', aliases: ['MySQL', 'PostgreSQL', 'SQLite'] },
    { name: 'NoSQL', aliases: ['MongoDB', 'Redis', 'Elasticsearch'] },
    { name: 'Docker', aliases: ['Containerisation'] },
    { name: 'Kubernetes', aliases: ['K8s'] },
    { name: 'AWS', aliases: ['Amazon Web Services', 'Cloud AWS'] },
    { name: 'Azure', aliases: ['Microsoft Azure'] },
    { name: 'Git', aliases: ['GitHub', 'GitLab', 'Versioning'] },
    { name: 'DevOps', aliases: ['CI/CD', 'Jenkins'] },
    { name: 'Figma', aliases: ['Design', 'UI/UX'] },
    { name: 'Photoshop', aliases: ['Adobe Photoshop', 'PS'] },
    { name: 'Illustrator', aliases: ['Adobe Illustrator', 'AI'] },
  ],

  // Compétences humaines
  SOFT_SKILLS: [
    { name: 'Communication', aliases: ['Communication orale', 'Présentation'] },
    { name: 'Leadership', aliases: ['Management', 'Encadrement'] },
    {
      name: 'Résolution de problèmes',
      aliases: ['Problem solving', 'Analyse'],
    },
    { name: 'Travail en équipe', aliases: ['Collaboration', 'Team work'] },
    { name: 'Gestion du temps', aliases: ['Organisation', 'Planification'] },
    { name: 'Adaptabilité', aliases: ['Flexibilité', 'Agilité'] },
    { name: 'Esprit critique', aliases: ['Analyse critique', 'Réflexion'] },
    { name: 'Intelligence émotionnelle', aliases: ['Empathie', 'Relationnel'] },
    { name: 'Créativité', aliases: ['Innovation', 'Imagination'] },
    { name: 'Autonomie', aliases: ['Indépendance', 'Initiative'] },
  ],

  // Vrais noms et prénoms français
  FIRST_NAMES: {
    MALE: [
      'Alexandre',
      'Antoine',
      'Aurélien',
      'Benjamin',
      'Clément',
      'David',
      'Fabien',
      'Guillaume',
      'Hugo',
      'Julien',
      'Kevin',
      'Lucas',
      'Maxime',
      'Nicolas',
      'Olivier',
      'Pierre',
      'Quentin',
      'Romain',
      'Sébastien',
      'Thomas',
    ],
    FEMALE: [
      'Amélie',
      'Anaïs',
      'Camille',
      'Charlotte',
      'Claire',
      'Émilie',
      'Julie',
      'Laura',
      'Léa',
      'Lucie',
      'Manon',
      'Marie',
      'Mathilde',
      'Océane',
      'Pauline',
      'Sarah',
      'Sophie',
      'Valerie',
      'Virginie',
      'Zoé',
    ],
  },

  LAST_NAMES: [
    'Martin',
    'Bernard',
    'Thomas',
    'Petit',
    'Robert',
    'Richard',
    'Durand',
    'Dubois',
    'Moreau',
    'Laurent',
    'Simon',
    'Michel',
    'Lefebvre',
    'Leroy',
    'Roux',
    'David',
    'Bertrand',
    'Morel',
    'Fournier',
    'Girard',
    'Bonnet',
    'Dupont',
    'Lambert',
    'Fontaine',
    'Rousseau',
    'Vincent',
    'Müller',
    'Mercier',
    'Boyer',
    'Blanc',
  ],

  // Titres de postes réalistes
  JOB_TITLES: [
    'Développeur Full Stack',
    'Développeur Frontend',
    'Développeur Backend',
    'Développeur Mobile',
    'Ingénieur DevOps',
    'Architecte Logiciel',
    'Tech Lead',
    'Product Manager',
    'UX/UI Designer',
    'Designer Graphique',
    'Chef de Projet Digital',
    'Consultant en Transformation Digitale',
    'Data Scientist',
    'Ingénieur IA',
    'Administrateur Système',
    'Expert Cybersécurité',
    'Développeur React',
    'Spécialiste WordPress',
    'Consultant SAP',
    'Ingénieur Cloud',
  ],

  // Vraies entreprises françaises
  COMPANIES: [
    {
      name: 'Capgemini',
      description:
        'Conseil en transformation numérique et innovation technologique',
    },
    {
      name: 'Sopra Steria',
      description: 'Services numériques et conseil en transformation digitale',
    },
    {
      name: 'Atos',
      description: 'Leader mondial de la transformation digitale',
    },
    {
      name: 'Thales',
      description:
        "Technologies avancées pour l'aérospatiale, transport et sécurité",
    },
    {
      name: 'Orange Business Services',
      description: 'Services de télécommunications et transformation digitale',
    },
    {
      name: 'Worldline',
      description: 'Leader européen des services de paiement et transactions',
    },
    {
      name: 'Dassault Systèmes',
      description: 'Solutions 3D et simulation numérique',
    },
    {
      name: 'Alten',
      description: 'Conseil en ingénierie et services informatiques',
    },
    {
      name: 'Akka Technologies',
      description: 'Conseil en ingénierie et services R&D',
    },
    {
      name: 'Econocom',
      description: 'Services numériques pour les entreprises',
    },
    { name: 'Ubisoft', description: 'Création et édition de jeux vidéo' },
    {
      name: 'Criteo',
      description: 'Plateforme technologique de publicité digitale',
    },
    {
      name: 'Murex',
      description: 'Solutions logicielles pour les marchés financiers',
    },
    { name: 'Sage', description: 'Solutions de gestion pour les entreprises' },
    {
      name: 'Talend',
      description: "Solutions d'intégration et de qualité des données",
    },
  ],

  // Villes françaises
  CITIES: [
    'Paris',
    'Lyon',
    'Marseille',
    'Toulouse',
    'Nice',
    'Nantes',
    'Montpellier',
    'Strasbourg',
    'Bordeaux',
    'Lille',
    'Rennes',
    'Reims',
    'Saint-Étienne',
    'Toulon',
    'Le Havre',
    'Grenoble',
    'Dijon',
    'Angers',
    'Nîmes',
    'Villeurbanne',
  ],

  // Adresses réalistes
  STREET_NAMES: [
    'Rue de la République',
    'Avenue des Champs-Élysées',
    'Boulevard Saint-Germain',
    'Rue de Rivoli',
    'Place de la Bastille',
    'Rue du Faubourg Saint-Antoine',
    'Avenue de la Grande Armée',
    'Rue de Belleville',
    'Boulevard Haussmann',
    'Rue de la Paix',
    'Avenue Montaigne',
    'Rue Saint-Honoré',
  ],

  // Descriptions de projets crédibles
  PROJECT_DESCRIPTIONS: [
    "Développement d'une application e-commerce avec React et Node.js",
    "Migration d'une infrastructure vers le cloud AWS",
    "Création d'une plateforme de gestion documentaire",
    "Développement d'une API REST pour application mobile",
    'Refonte complète du site web corporate',
    "Mise en place d'un système de monitoring et alertes",
    "Développement d'un CRM sur mesure",
    "Création d'un dashboard analytique avec visualisation de données",
    "Développement d'une application mobile iOS/Android",
    'Automatisation des processus de déploiement CI/CD',
  ],
};

// Types personnalisés
type FreelanceWithSkills = Freelance & { skills: Skill[] };
type JobPostingWithSkills = JobPosting & { skills: Skill[] };
type UserData = { user: User; firstName: string; lastName: string };

type AuthentikUser = {
  name: string;
  pk: string;
  username: string;
  email: string;
  type: string;
};

async function createAuthentikUser({
  name,
  username,
  email,
}: {
  name: string;
  username: string;
  email: string;
}) {
  const res = await fetch(`${AUTHENTIK_URL}/api/v3/core/users/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${AUTHENTIK_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: name,
      username: username,
      email: email,
      is_active: true,
      type: 'external',
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(
      `Erreur création utilisateur Authentik : ${res.status} ${err}`,
    );
  }

  return res.json();
}

async function setPasswordAuthentikUser(userId: string, password: string) {
  const res = await fetch(
    `${AUTHENTIK_URL}/api/v3/core/users/${userId}/set_password/`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${AUTHENTIK_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password,
      }),
    },
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(
      `Erreur lors du changement de mot de passe Authentik : ${res.status} ${err}`,
    );
  }
}

async function deleteAuthentikUser(userId: string) {
  const res = await fetch(`${AUTHENTIK_URL}/api/v3/core/users/${userId}/`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${AUTHENTIK_TOKEN}`,
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(
      `Erreur suppression utilisateur Authentik : ${res.status} ${err}`,
    );
  }
}

export async function fetchAuthentikUsers(): Promise<AuthentikUser[]> {
  const users: AuthentikUser[] = [];
  let nextUrl: string | null =
    `${AUTHENTIK_URL}/api/v3/core/users/?type=external`;

  while (nextUrl) {
    const res = await fetch(nextUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${AUTHENTIK_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(
        `Erreur lors du fetch des utilisateurs : ${res.status} ${err}`,
      );
    }

    const data = (await res.json()) as {
      results: AuthentikUser[];
      next: string | null;
    };
    users.push(...data.results);

    nextUrl = data.next || null; // Pagination
  }

  return users;
}

// Fonctions utilitaires
function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomItems<T>(array: T[], min: number, max: number): T[] {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateRealisticEmail(firstName: string, lastName: string): string {
  const domains = [
    'gmail.com',
    'outlook.fr',
    'free.fr',
    'orange.fr',
    'wanadoo.fr',
    'yahoo.fr',
  ];
  const normalized = `${firstName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')}.${lastName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')}`;
  return `${normalized}@${getRandomItem(domains)}`;
}

function generateUsername(firstName: string, lastName: string): string {
  const patterns = [
    `${firstName.toLowerCase()}${lastName.toLowerCase()}`,
    `${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
    `${firstName.toLowerCase()}${lastName.slice(0, 1).toLowerCase()}`,
    `${firstName.slice(0, 1).toLowerCase()}${lastName.toLowerCase()}`,
  ];
  return getRandomItem(patterns);
}

function generateSiren(): string {
  return Math.floor(100000000 + Math.random() * 900000000).toString();
}

function generateAddress(): string {
  const number = Math.floor(Math.random() * 200) + 1;
  const street = getRandomItem(REALISTIC_DATA.STREET_NAMES);
  const city = getRandomItem(REALISTIC_DATA.CITIES);
  const postalCode = Math.floor(10000 + Math.random() * 90000);
  return `${number} ${street}, ${postalCode} ${city}`;
}

function generateDailyRate(): number {
  // Taux journaliers réalistes en France (300€ à 800€)
  const rates = [300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800];
  return getRandomItem(rates);
}

function generateSeniority(): number {
  // Distribution réaliste de l'expérience
  const weights = [0.1, 0.2, 0.3, 0.2, 0.1, 0.05, 0.03, 0.015, 0.005]; // 0-8 ans
  const random = Math.random();
  let cumulative = 0;

  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i];
    if (random <= cumulative) return i;
  }
  return 2; // Valeur par défaut
}

async function main() {
  console.log('🧹 Nettoyage de la base de données...');

  // Suppression dans l'ordre des dépendances
  await prisma.candidate.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.conversation.deleteMany({});
  await prisma.invoice.deleteMany({});
  await prisma.quote.deleteMany({});
  await prisma.checkpoint.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.document.deleteMany({});
  await prisma.jobPosting.deleteMany({});
  await prisma.log.deleteMany({});
  await prisma.skill.deleteMany({});
  await prisma.freelance.deleteMany({});
  await prisma.company.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('✅ suppression des utilisateurs Authentik...');
  const allUsers = await fetchAuthentikUsers();
  for (const user of allUsers) {
    if (user.type === 'external') {
      await deleteAuthentikUser(user.pk);
    }
  }

  console.log('🎯 Création des compétences...');

  // Création des compétences techniques
  const technicalSkills: Skill[] = [];
  for (const skill of REALISTIC_DATA.TECHNICAL_SKILLS) {
    const createdSkill = await prisma.skill.create({
      data: {
        name: skill.name,
        normalizedName: skill.name.toLowerCase().replace(/[^a-z0-9]/g, ''),
        aliases: skill.aliases,
        type: SkillType.TECHNICAL,
      },
    });
    technicalSkills.push(createdSkill);
  }

  // Création des compétences humaines
  const softSkills: Skill[] = [];
  for (const skill of REALISTIC_DATA.SOFT_SKILLS) {
    const createdSkill = await prisma.skill.create({
      data: {
        name: skill.name,
        normalizedName: skill.name.toLowerCase().replace(/[^a-z0-9]/g, ''),
        aliases: skill.aliases,
        type: SkillType.SOFT,
      },
    });
    softSkills.push(createdSkill);
  }

  const allSkills = [...technicalSkills, ...softSkills];
  console.log(`✅ ${allSkills.length} compétences créées`);

  console.log('🔐 Création des comptes par défaut...');

  // Compte freelance par défaut
  const defaultFreelanceUser = await prisma.user.create({
    data: {
      email: 'freelance@test.com',
      username: 'freelance_test',
      role: Role.FREELANCE,
    },
  });

  console.log('🔐 Création du compte freelance par défaut...');

  const defaultFreelanceAuthentikUser = (await createAuthentikUser({
    name: 'freelance_test',
    username: 'freelance_test',
    email: 'freelance@test.com',
  })) as AuthentikUser;

  await setPasswordAuthentikUser(
    defaultFreelanceAuthentikUser.pk,
    'password123',
  );

  const defaultFreelance = await prisma.freelance.create({
    data: {
      userId: defaultFreelanceUser.id,
      firstName: 'Jean',
      lastName: 'Dupont',
      jobTitle: 'Développeur Full Stack',
      averageDailyRate: 500,
      seniority: 3,
      location: 'Paris',
      skills: {
        connect: getRandomItems(allSkills, 5, 8).map((skill) => ({
          id: skill.id,
        })),
      },
    },
    include: {
      skills: true,
    },
  });

  // Compte entreprise par défaut
  const defaultCompanyUser = await prisma.user.create({
    data: {
      email: 'company@test.com',
      username: 'company_test',
      role: Role.COMPANY,
    },
  });

  console.log('🔐 Création du compte entreprise par défaut...');

  const defaultCompanyAuthentikUser = (await createAuthentikUser({
    name: 'company_test',
    username: 'company_test',
    email: 'company@test.com',
  })) as AuthentikUser;

  await setPasswordAuthentikUser(defaultCompanyAuthentikUser.pk, 'password123');

  const defaultCompany = await prisma.company.create({
    data: {
      userId: defaultCompanyUser.id,
      name: 'TechCorp Solutions',
      description: 'Entreprise de développement logiciel et consulting',
      address: '42 Avenue des Champs-Élysées, 75008 Paris',
      siren: '123456789',
    },
  });

  console.log('✅ Comptes par défaut créés:');
  console.log('  📧 Freelance: freelance@test.com (mot de passe: password123)');
  console.log('  📧 Entreprise: company@test.com (mot de passe: password123)');

  console.log('👥 Création des utilisateurs...');

  // Création de 38 utilisateurs supplémentaires (60% freelances, 40% entreprises)
  const totalUsers = 38;
  const freelanceCount = Math.floor(totalUsers * 0.6);
  const companyCount = totalUsers - freelanceCount;

  const freelanceUsers: UserData[] = [];
  const companyUsers: UserData[] = [
    { user: defaultCompanyUser, firstName: 'Admin', lastName: 'Company' },
  ];

  // Création des utilisateurs freelances
  for (let i = 0; i < freelanceCount; i++) {
    const gender = Math.random() > 0.5 ? 'MALE' : 'FEMALE';
    const firstName = getRandomItem(REALISTIC_DATA.FIRST_NAMES[gender]);
    const lastName = getRandomItem(REALISTIC_DATA.LAST_NAMES);

    const user = await prisma.user.create({
      data: {
        email: generateRealisticEmail(firstName, lastName),
        username: generateUsername(firstName, lastName),
        role: Role.FREELANCE,
      },
    });

    console.log('🔐 Création du compte freelance...');

    const defaultFreelanceAuthentikUser = (await createAuthentikUser({
      name: user.username,
      username: user.username,
      email: user.email,
    })) as AuthentikUser;

    await setPasswordAuthentikUser(
      defaultFreelanceAuthentikUser.pk,
      'password123',
    );

    freelanceUsers.push({ user, firstName, lastName });
  }

  // Création des utilisateurs entreprises
  for (let i = 0; i < companyCount; i++) {
    const firstName = getRandomItem(REALISTIC_DATA.FIRST_NAMES.MALE);
    const lastName = getRandomItem(REALISTIC_DATA.LAST_NAMES);

    const user = await prisma.user.create({
      data: {
        email: generateRealisticEmail(firstName, lastName),
        username: generateUsername(firstName, lastName),
        role: Role.COMPANY,
      },
    });

    console.log('🔐 Création du compte entreprise...');

    const authentikUser = (await createAuthentikUser({
      name: user.username,
      username: user.username,
      email: user.email,
    })) as AuthentikUser;

    await setPasswordAuthentikUser(authentikUser.pk, 'password123');

    companyUsers.push({ user, firstName, lastName });
  }

  console.log(
    `✅ ${totalUsers + 2} utilisateurs créés au total (${freelanceCount + 1} freelances, ${companyCount + 1} entreprises)`,
  );

  console.log('💼 Création des profils freelances...');

  const freelances: FreelanceWithSkills[] = [defaultFreelance];
  for (const { user, firstName, lastName } of freelanceUsers) {
    const freelanceSkills = getRandomItems(allSkills, 3, 8);

    const freelance = await prisma.freelance.create({
      data: {
        userId: user.id,
        firstName,
        lastName,
        jobTitle: getRandomItem(REALISTIC_DATA.JOB_TITLES),
        averageDailyRate: generateDailyRate(),
        seniority: generateSeniority(),
        location: getRandomItem(REALISTIC_DATA.CITIES),
        skills: {
          connect: freelanceSkills.map((skill) => ({ id: skill.id })),
        },
      },
      include: {
        skills: true,
      },
    });

    freelances.push(freelance);
  }

  console.log(`✅ ${freelances.length} profils freelances créés`);

  console.log('🏢 Création des entreprises...');

  const companies: Company[] = [defaultCompany];
  for (const { user } of companyUsers.slice(1)) {
    // Skip le premier qui est le compte par défaut
    const companyData = getRandomItem(REALISTIC_DATA.COMPANIES);

    const company = await prisma.company.create({
      data: {
        userId: user.id,
        name: companyData.name,
        description: companyData.description,
        address: generateAddress(),
        siren: generateSiren(),
      },
    });

    companies.push(company);
  }

  console.log(`✅ ${companies.length} entreprises créées`);

  console.log("📋 Création des offres d'emploi...");

  const jobPostings: JobPostingWithSkills[] = [];
  for (const company of companies) {
    const postingsCount = Math.floor(Math.random() * 3) + 1; // 1 à 3 offres par entreprise

    for (let i = 0; i < postingsCount; i++) {
      const requiredSkills = getRandomItems(allSkills, 3, 7);
      const jobTitle = getRandomItem(REALISTIC_DATA.JOB_TITLES);

      const jobPosting = await prisma.jobPosting.create({
        data: {
          companyId: company.id,
          title: `${jobTitle} - ${company.name}`,
          description: `Nous recherchons un(e) ${jobTitle} expérimenté(e) pour rejoindre notre équipe dynamique. Mission passionnante au sein d'une entreprise en pleine croissance.`,
          location: getRandomItem([
            JobPostingLocation.REMOTE,
            JobPostingLocation.HYBRID,
            JobPostingLocation.ONSITE,
          ]),
          isPromoted: Math.random() < 0.3, // 30% des offres sont promues
          averageDailyRate: generateDailyRate(),
          seniority: generateSeniority(),
          status: 'PUBLISHED', // Pour la prod, on considère que les offres sont publiées
          skills: {
            connect: requiredSkills.map((skill) => ({ id: skill.id })),
          },
        },
        include: {
          skills: true,
        },
      });

      jobPostings.push(jobPosting);
    }
  }

  console.log(`✅ ${jobPostings.length} offres d'emploi créées`);

  console.log('� Création des projets...');

  // Fonction pour déterminer le statut du projet basé sur la progression
  function getProjectStatus(hasFreelance: boolean) {
    if (!hasFreelance) return ProjectStatus.IN_PROGRESS;

    const rand = Math.random();
    if (rand < 0.1) return ProjectStatus.COMPLETED; // 10% des projets terminés
    if (rand < 0.05) return ProjectStatus.CANCELED; // 5% des projets annulés
    return ProjectStatus.IN_PROGRESS; // 85% en cours
  }

  const projects: Project[] = [];
  for (const jobPosting of jobPostings) {
    const assignedFreelance =
      Math.random() < 0.7 ? getRandomItem(freelances) : null; // 70% des projets ont un freelance assigné

    const project = await prisma.project.create({
      data: {
        name: `Projet ${jobPosting.title}`,
        description: getRandomItem(REALISTIC_DATA.PROJECT_DESCRIPTIONS),
        amount: Math.floor(Math.random() * 50000) + 10000, // Entre 10k et 60k€
        startDate: new Date(
          Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000,
        ), // Dans les 30 prochains jours
        endDate:
          Math.random() < 0.8
            ? new Date(
                Date.now() + (Math.random() * 180 + 30) * 24 * 60 * 60 * 1000,
              )
            : null, // 80% ont une date de fin
        status: getProjectStatus(!!assignedFreelance),
        jobPostingId: jobPosting.id,
        freelanceId: assignedFreelance?.id || null,
        companyId: jobPosting.companyId,
      },
    });

    projects.push(project);
  }

  console.log(`✅ ${projects.length} projets créés`);

  console.log('�📋 Création des checkpoints...');

  const checkpoints: Checkpoint[] = [];
  const CHECKPOINT_NAMES = [
    'Analyse des besoins',
    'Conception technique',
    'Développement MVP',
    'Tests unitaires',
    'Intégration continue',
    'Tests utilisateurs',
    'Déploiement staging',
    'Formation équipe',
    'Mise en production',
    'Documentation technique',
    'Optimisation performance',
    'Maintenance corrective',
  ];

  // Fonction pour générer un statut de checkpoint réaliste avec traçabilité
  function generateCheckpointStatus(
    index: number,
    total: number,
    freelanceId: string | null,
    companyId: string,
    projectStatus: ProjectStatus,
  ) {
    const progress = index / total;

    // Si pas de freelance assigné, tous les checkpoints restent TODO
    if (!freelanceId) {
      return {
        status: CheckpointStatus.TODO,
        submittedAt: null,
        validatedAt: null,
        submittedBy: null,
        validatedBy: null,
      };
    }

    // Si le projet est terminé, tous les checkpoints doivent être DONE
    if (projectStatus === ProjectStatus.COMPLETED) {
      const submittedDate = new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
      );
      const validatedDate = new Date(
        submittedDate.getTime() + Math.random() * 3 * 24 * 60 * 60 * 1000,
      );
      return {
        status: CheckpointStatus.DONE,
        submittedAt: submittedDate,
        validatedAt: validatedDate,
        submittedBy: freelanceId,
        validatedBy: companyId,
      };
    }

    // Si le projet est annulé, certains checkpoints peuvent être annulés
    if (projectStatus === ProjectStatus.CANCELED) {
      if (progress < 0.3) {
        const submittedDate = new Date(
          Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000,
        );
        const validatedDate = new Date(
          submittedDate.getTime() + Math.random() * 2 * 24 * 60 * 60 * 1000,
        );
        return {
          status: CheckpointStatus.DONE,
          submittedAt: submittedDate,
          validatedAt: validatedDate,
          submittedBy: freelanceId,
          validatedBy: companyId,
        };
      } else {
        return {
          status: CheckpointStatus.CANCELED,
          submittedAt: null,
          validatedAt: null,
          submittedBy: null,
          validatedBy: null,
        };
      }
    }

    // Pour les projets en cours
    if (progress < 0.2) {
      // 20% premiers checkpoints : en cours ou terminés
      if (Math.random() < 0.7) {
        return {
          status: CheckpointStatus.IN_PROGRESS,
          submittedAt: null,
          validatedAt: null,
          submittedBy: null,
          validatedBy: null,
        };
      } else {
        // Checkpoint terminé avec validation complète
        const submittedDate = new Date(
          Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
        );
        const validatedDate = new Date(
          submittedDate.getTime() + Math.random() * 3 * 24 * 60 * 60 * 1000,
        );
        return {
          status: CheckpointStatus.DONE,
          submittedAt: submittedDate,
          validatedAt: validatedDate,
          submittedBy: freelanceId,
          validatedBy: companyId,
        };
      }
    } else if (progress < 0.4) {
      // 20% suivants : certains en attente de validation
      const rand = Math.random();
      if (rand < 0.4) {
        // En attente de validation company
        const submittedDate = new Date(
          Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000,
        );
        return {
          status: CheckpointStatus.PENDING_COMPANY_APPROVAL,
          submittedAt: submittedDate,
          validatedAt: null,
          submittedBy: freelanceId,
          validatedBy: null,
        };
      } else if (rand < 0.7) {
        // Terminé
        const submittedDate = new Date(
          Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000,
        );
        const validatedDate = new Date(
          submittedDate.getTime() + Math.random() * 2 * 24 * 60 * 60 * 1000,
        );
        return {
          status: CheckpointStatus.DONE,
          submittedAt: submittedDate,
          validatedAt: validatedDate,
          submittedBy: freelanceId,
          validatedBy: companyId,
        };
      } else {
        return {
          status: CheckpointStatus.IN_PROGRESS,
          submittedAt: null,
          validatedAt: null,
          submittedBy: null,
          validatedBy: null,
        };
      }
    } else {
      // 60% restants : TODO ou quelques retards
      if (Math.random() < 0.1) {
        return {
          status: CheckpointStatus.DELAYED,
          submittedAt: null,
          validatedAt: null,
          submittedBy: null,
          validatedBy: null,
        };
      } else {
        return {
          status: CheckpointStatus.TODO,
          submittedAt: null,
          validatedAt: null,
          submittedBy: null,
          validatedBy: null,
        };
      }
    }
  }

  for (const jobPosting of jobPostings) {
    const checkpointCount = Math.floor(Math.random() * 4) + 2; // 2 à 5 checkpoints par job posting
    const selectedCheckpoints = getRandomItems(
      CHECKPOINT_NAMES,
      checkpointCount,
      checkpointCount,
    );

    // Trouver le projet associé pour récupérer le freelanceId et le statut
    const associatedProject = projects.find(
      (p) => p.jobPostingId === jobPosting.id,
    );
    const freelanceId = associatedProject?.freelanceId || null;
    const projectStatus =
      associatedProject?.status || ProjectStatus.IN_PROGRESS;

    for (let i = 0; i < selectedCheckpoints.length; i++) {
      const checkpointName = selectedCheckpoints[i];
      const baseDate = new Date();
      const daysOffset = (i + 1) * 30; // Checkpoints étalés sur 30 jours chacun

      const checkpointData = generateCheckpointStatus(
        i,
        selectedCheckpoints.length,
        freelanceId,
        jobPosting.companyId,
        projectStatus,
      );

      const checkpoint = await prisma.checkpoint.create({
        data: {
          name: checkpointName,
          description: `Étape ${i + 1}: ${checkpointName} - Livrable attendu selon le cahier des charges`,
          amount: Math.floor(Math.random() * 5000) + 1000, // Entre 1k et 6k€ par checkpoint
          date: new Date(baseDate.getTime() + daysOffset * 24 * 60 * 60 * 1000),
          status: checkpointData.status,
          submittedAt: checkpointData.submittedAt,
          validatedAt: checkpointData.validatedAt,
          submittedBy: checkpointData.submittedBy,
          validatedBy: checkpointData.validatedBy,
          jobPostingId: jobPosting.id,
        },
      });

      checkpoints.push(checkpoint);
    }
  }

  console.log(`✅ ${checkpoints.length} checkpoints créés`);

  console.log('📊 Statistiques finales:');
  console.log(`- Utilisateurs: ${totalUsers + 2}`);
  console.log(`- Freelances: ${freelances.length}`);
  console.log(`- Entreprises: ${companies.length}`);
  console.log(`- Compétences: ${allSkills.length}`);
  console.log(`- Offres d'emploi: ${jobPostings.length}`);
  console.log(`- Checkpoints: ${checkpoints.length}`);
  console.log(`- Projets: ${projects.length}`);

  console.log('🎉 Base de données peuplée avec succès !');
  console.log('');
  console.log('🔐 Comptes de test disponibles:');
  console.log('  👤 Freelance: freelance@test.com');
  console.log('  🏢 Entreprise: company@test.com');
  console.log('  🔑 Mot de passe pour les deux: password123');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Erreur lors du peuplement:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
