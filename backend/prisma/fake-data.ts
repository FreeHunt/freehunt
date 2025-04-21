import { Role, SkillType, JobPostingLocation, DocumentType } from '@prisma/client';
import { faker } from '@faker-js/faker';
import Decimal from 'decimal.js';



export function fakeUser() {
  return {
    email: faker.internet.email(),
    username: faker.internet.userName(),
    role: faker.helpers.arrayElement([Role.FREELANCE, Role.COMPANY] as const),
  };
}
export function fakeUserComplete() {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    username: faker.internet.userName(),
    role: faker.helpers.arrayElement([Role.FREELANCE, Role.COMPANY] as const),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
export function fakeSkill() {
  return {
    name: faker.person.fullName(),
    normalizedName: faker.lorem.words(5),
    aliases: faker.lorem.words(5).split(' '),
    type: faker.helpers.arrayElement([SkillType.TECHNICAL, SkillType.SOFT] as const),
  };
}
export function fakeSkillComplete() {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    normalizedName: faker.lorem.words(5),
    aliases: faker.lorem.words(5).split(' '),
    type: faker.helpers.arrayElement([SkillType.TECHNICAL, SkillType.SOFT] as const),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
export function fakeFreelance() {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    jobTitle: faker.person.jobTitle(),
    averageDailyRate: faker.number.float({ min: 50, max: 1000, multipleOf: 50 }),
    seniority: faker.number.int({ min: 0, max: 10 }),
    location: faker.location.city(),
  };
}
export function fakeFreelanceComplete() {
  return {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    jobTitle: faker.person.jobTitle(),
    averageDailyRate: faker.number.float({ min: 50, max: 1000, multipleOf: 50 }),
    seniority: faker.number.int({ min: 0, max: 10 }),
    location: faker.location.city(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
export function fakeCompany() {
  return {
    name: faker.company.name(),
    description: faker.lorem.words(5),
    address: faker.location.streetAddress({ useFullAddress: true }),
    siren: faker.string.numeric(9),
  };
}
export function fakeCompanyComplete() {
  return {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    name: faker.company.name(),
    description: faker.lorem.words(5),
    address: faker.location.streetAddress({ useFullAddress: true }),
    siren: faker.string.numeric(9),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
export function fakeJobPosting() {
  return {
    title: faker.lorem.words(5),
    description: faker.lorem.words(5),
    location: faker.helpers.arrayElement([JobPostingLocation.HYBRID, JobPostingLocation.ONSITE, JobPostingLocation.REMOTE] as const),
    isPromoted: faker.datatype.boolean(),
  };
}
export function fakeJobPostingComplete() {
  return {
    id: faker.string.uuid(),
    companyId: faker.string.uuid(),
    title: faker.lorem.words(5),
    description: faker.lorem.words(5),
    location: faker.helpers.arrayElement([JobPostingLocation.HYBRID, JobPostingLocation.ONSITE, JobPostingLocation.REMOTE] as const),
    isPromoted: faker.datatype.boolean(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
export function fakeProject() {
  return {
    name: faker.person.fullName(),
    description: faker.lorem.words(5),
    startDate: faker.date.anytime(),
    endDate: undefined,
  };
}
export function fakeProjectComplete() {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    description: faker.lorem.words(5),
    startDate: faker.date.anytime(),
    endDate: undefined,
    jobPostingId: faker.string.uuid(),
    freelanceId: undefined,
    companyId: undefined,
    conversationId: undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
export function fakeCheckpoint() {
  return {
    name: faker.person.fullName(),
    description: faker.lorem.words(5),
    date: faker.date.anytime(),
  };
}
export function fakeCheckpointComplete() {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    description: faker.lorem.words(5),
    date: faker.date.anytime(),
    jobPostingId: faker.string.uuid(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
export function fakeQuote() {
  return {
    amount: undefined,
  };
}
export function fakeQuoteComplete() {
  return {
    id: faker.string.uuid(),
    checkpointId: faker.string.uuid(),
    amount: undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
export function fakeInvoice() {
  return {
    amount: undefined,
    valueAddedTax: undefined,
    documentId: faker.lorem.words(5),
  };
}
export function fakeInvoiceComplete() {
  return {
    id: faker.string.uuid(),
    quoteId: faker.string.uuid(),
    amount: undefined,
    valueAddedTax: undefined,
    documentId: faker.lorem.words(5),
    projectId: undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
export function fakeDocument() {
  return {
    name: faker.person.fullName(),
    url: faker.lorem.words(5),
    type: faker.helpers.arrayElement([DocumentType.INVOICE, DocumentType.QUOTE] as const),
  };
}
export function fakeDocumentComplete() {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    url: faker.lorem.words(5),
    type: faker.helpers.arrayElement([DocumentType.INVOICE, DocumentType.QUOTE] as const),
    freelanceId: faker.string.uuid(),
    invoiceId: faker.string.uuid(),
    quoteId: faker.string.uuid(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
export function fakeLog() {
  return {
    tableName: faker.lorem.words(5),
    action: faker.lorem.words(5),
  };
}
export function fakeLogComplete() {
  return {
    id: faker.string.uuid(),
    timestamp: new Date(),
    tableName: faker.lorem.words(5),
    action: faker.lorem.words(5),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
export function fakeConversationComplete() {
  return {
    id: faker.string.uuid(),
    senderId: faker.string.uuid(),
    receiverId: faker.string.uuid(),
  };
}
export function fakeMessage() {
  return {
    content: faker.lorem.words(5),
  };
}
export function fakeMessageComplete() {
  return {
    id: faker.string.uuid(),
    conversationId: faker.string.uuid(),
    senderId: faker.string.uuid(),
    receiverId: faker.string.uuid(),
    documentId: undefined,
    timestamp: new Date(),
    content: faker.lorem.words(5),
  };
}
