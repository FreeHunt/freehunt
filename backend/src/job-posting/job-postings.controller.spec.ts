import { Test } from '@nestjs/testing';
import { JobPostingsController } from './job-postings.controller';
import { JobPostingsService } from './job-postings.service';
import { JobPosting } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';
import { PrismaServiceMock } from '../../test/mocks/prisma.mock';
import { CreateJobPostingDto } from './dto/create-job-posting.dto';

describe('JobPostingsController', () => {
  let jobPostingsController: JobPostingsController;
  let jobPostingsService: JobPostingsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [JobPostingsController],
      providers: [
        JobPostingsService,
        {
          provide: PrismaService,
          useValue: PrismaServiceMock,
        },
      ],
    }).compile();

    jobPostingsController = moduleRef.get<JobPostingsController>(
      JobPostingsController,
    );
    jobPostingsService = moduleRef.get<JobPostingsService>(JobPostingsService);
  });

  const createJobPostingDto: CreateJobPostingDto = {
    title: 'SEO Optimization Specialist',
    description:
      'We are looking for a SEO Optimization Specialist to join our team.',
    location: 'ONSITE',
    isPromoted: false,
    companyId: '3246540a-3ecd-4912-a909-953c881816fc',
  };

  const jobPosting: JobPosting = {
    ...createJobPostingDto,
    id: '3246540a-3ecd-4912-a909-953c881816fc',
  };

  describe('create', () => {
    it('should create a job posting', async () => {
      jest.spyOn(jobPostingsService, 'create').mockResolvedValue(jobPosting);
      expect(await jobPostingsController.create(createJobPostingDto)).toEqual(
        jobPosting,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of job postings', async () => {
      jest.spyOn(jobPostingsService, 'findAll').mockResolvedValue([jobPosting]);
      expect(await jobPostingsController.findAll()).toEqual([jobPosting]);
    });
  });

  describe('findOne', () => {
    it('should return a job posting', async () => {
      jest.spyOn(jobPostingsService, 'findOne').mockResolvedValue(jobPosting);
      expect(await jobPostingsController.findOne(jobPosting.id)).toEqual(
        jobPosting,
      );
    });
  });

  describe('update', () => {
    it('should update a job posting', async () => {
      const updatedJobPosting: JobPosting = {
        ...jobPosting,
        title: 'Updated Job Title',
      };
      jest
        .spyOn(jobPostingsService, 'update')
        .mockResolvedValue(updatedJobPosting);
      expect(
        await jobPostingsController.update(jobPosting.id, updatedJobPosting),
      ).toEqual(updatedJobPosting);
    });
  });

  describe('remove', () => {
    it('should remove a job posting', async () => {
      jest.spyOn(jobPostingsService, 'remove').mockResolvedValue(jobPosting);
      expect(await jobPostingsController.remove(jobPosting.id)).toEqual(
        jobPosting,
      );
    });
  });
});
