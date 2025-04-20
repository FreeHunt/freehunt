import {
  Role,
  SkillType,
  JobPostingLocation,
  DocumentType,
} from '@prisma/client';
import { faker } from '@faker-js/faker';

export function fakeUser() {
  return {
    email: faker.internet.email(),
    role: faker.helpers.arrayElement([Role.FREELANCE, Role.COMPANY] as const),
  };
}
export function fakeUserComplete() {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    role: faker.helpers.arrayElement([Role.FREELANCE, Role.COMPANY] as const),
  };
}
export function fakeSkill() {
  return {
    name: faker.person.fullName(),
    normalizedName: faker.lorem.words(5),
    aliases: faker.lorem.words(5).split(' '),
    type: faker.helpers.arrayElement([
      SkillType.TECHNICAL,
      SkillType.SOFT,
    ] as const),
  };
}
export function fakeSkillComplete() {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    normalizedName: faker.lorem.words(5),
    aliases: faker.lorem.words(5).split(' '),
    type: faker.helpers.arrayElement([
      SkillType.TECHNICAL,
      SkillType.SOFT,
    ] as const),
  };
}
export function fakeFreelance() {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    jobTitle: faker.person.jobTitle(),
    averageDailyRate: faker.number.float(),
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
    averageDailyRate: faker.number.float(),
    seniority: faker.number.int({ min: 0, max: 10 }),
    location: faker.location.city(),
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
  };
}
export function fakeJobPosting() {
  return {
    title: faker.lorem.words(5),
    description: faker.lorem.words(5),
    location: faker.helpers.arrayElement([
      JobPostingLocation.HYBRID,
      JobPostingLocation.ONSITE,
      JobPostingLocation.REMOTE,
    ] as const),
    isPromoted: faker.datatype.boolean(),
  };
}
export function fakeJobPostingComplete() {
  return {
    id: faker.string.uuid(),
    companyId: faker.string.uuid(),
    title: faker.lorem.words(5),
    description: faker.lorem.words(5),
    location: faker.helpers.arrayElement([
      JobPostingLocation.HYBRID,
      JobPostingLocation.ONSITE,
      JobPostingLocation.REMOTE,
    ] as const),
    isPromoted: faker.datatype.boolean(),
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
  };
}
export function fakeDocument() {
  return {
    name: faker.person.fullName(),
    url: faker.lorem.words(5),
    type: faker.helpers.arrayElement([
      DocumentType.INVOICE,
      DocumentType.QUOTE,
    ] as const),
  };
}
export function fakeDocumentComplete() {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    url: faker.lorem.words(5),
    type: faker.helpers.arrayElement([
      DocumentType.INVOICE,
      DocumentType.QUOTE,
    ] as const),
    freelanceId: faker.string.uuid(),
    invoiceId: faker.string.uuid(),
    quoteId: faker.string.uuid(),
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
  };
}
