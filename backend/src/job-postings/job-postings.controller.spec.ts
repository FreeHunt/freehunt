import { Test } from '@nestjs/testing';
import { JobPostingsController } from './job-postings.controller';
import { JobPostingsService } from './job-postings.service';
import { JobPosting, JobPostingLocation } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';
import { PrismaServiceMock } from '../../test/mocks/prisma.mock';
import { CreateJobPostingDto } from './dto/create-job-posting.dto';
import { SearchJobPostingDto } from './dto/search-job-posting.dto';
import { JobPostingSearchResult } from './dto/job-posting-search-result.dto';

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
    averageDailyRate: 500,
    seniority: 5,
    companyId: '3246540a-3ecd-4912-a909-953c881816fc',
  };

  const jobPosting: JobPosting = {
    ...createJobPostingDto,
    id: '3246540a-3ecd-4912-a909-953c881816fc',
    createdAt: new Date(),
    updatedAt: new Date(),
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

  describe('search', () => {
    const jobPostings: JobPosting[] = [
      {
        id: '3246540a-3ecd-4912-a909-953c881816fc',
        title: 'Frontend Developer',
        description:
          'We are looking for a Frontend Developer to join our team.',
        location: 'REMOTE',
        isPromoted: true,
        averageDailyRate: 600,
        seniority: 3,
        companyId: '3246540a-3ecd-4912-a909-953c881816fc',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '4246540a-3ecd-4912-a909-953c881816fd',
        title: 'Backend Developer',
        description: 'We are looking for a Backend Developer to join our team.',
        location: 'ONSITE',
        isPromoted: false,
        averageDailyRate: 650,
        seniority: 4,
        companyId: '3246540a-3ecd-4912-a909-953c881816fc',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    it('should search job postings by title', async () => {
      const searchDto: SearchJobPostingDto = {
        title: 'Frontend',
      };

      const searchResult: JobPostingSearchResult = {
        data: [jobPostings[0]],
        total: 1,
      };

      const searchSpy = jest.spyOn(jobPostingsService, 'search');
      searchSpy.mockResolvedValue(searchResult);

      const result = await jobPostingsController.search(searchDto);

      expect(searchSpy).toHaveBeenCalledWith(searchDto);
      expect(result).toEqual(searchResult);
    });

    it('should search job postings by location', async () => {
      const searchDto: SearchJobPostingDto = {
        location: JobPostingLocation.REMOTE,
      };

      const searchResult: JobPostingSearchResult = {
        data: [jobPostings[0]],
        total: 1,
      };

      const searchSpy = jest.spyOn(jobPostingsService, 'search');
      searchSpy.mockResolvedValue(searchResult);

      const result = await jobPostingsController.search(searchDto);

      expect(searchSpy).toHaveBeenCalledWith(searchDto);
      expect(result).toEqual(searchResult);
    });

    it('should search job postings by skill names', async () => {
      const searchDto: SearchJobPostingDto = {
        skillNames: ['React', 'TypeScript'],
      };

      const searchResult: JobPostingSearchResult = {
        data: [jobPostings[0]],
        total: 1,
      };

      const searchSpy = jest.spyOn(jobPostingsService, 'search');
      searchSpy.mockResolvedValue(searchResult);

      const result = await jobPostingsController.search(searchDto);

      expect(searchSpy).toHaveBeenCalledWith(searchDto);
      expect(result).toEqual(searchResult);
    });

    it('should search job postings with pagination parameters', async () => {
      const searchDto: SearchJobPostingDto = {
        skip: 5,
        take: 10,
      };

      const searchResult: JobPostingSearchResult = {
        data: jobPostings,
        total: jobPostings.length,
      };

      const searchSpy = jest.spyOn(jobPostingsService, 'search');
      searchSpy.mockResolvedValue(searchResult);

      const result = await jobPostingsController.search(searchDto);

      expect(searchSpy).toHaveBeenCalledWith(searchDto);
      expect(result).toEqual(searchResult);
    });

    it('should search job postings with multiple search parameters', async () => {
      const searchDto: SearchJobPostingDto = {
        title: 'Developer',
        skillNames: ['JavaScript'],
        location: JobPostingLocation.REMOTE,
        minDailyRate: 500,
        maxDailyRate: 700,
        minSeniority: 2,
        maxSeniority: 5,
        skip: 0,
        take: 5,
      };

      const searchResult: JobPostingSearchResult = {
        data: [jobPostings[0]],
        total: 1,
      };

      const searchSpy = jest.spyOn(jobPostingsService, 'search');
      searchSpy.mockResolvedValue(searchResult);

      const result = await jobPostingsController.search(searchDto);

      expect(searchSpy).toHaveBeenCalledWith(searchDto);
      expect(result).toEqual(searchResult);
    });

    it('should return all job postings when no search parameters are provided', async () => {
      const searchDto: SearchJobPostingDto = {};

      const searchResult: JobPostingSearchResult = {
        data: jobPostings,
        total: jobPostings.length,
      };

      const searchSpy = jest.spyOn(jobPostingsService, 'search');
      searchSpy.mockResolvedValue(searchResult);

      const result = await jobPostingsController.search(searchDto);

      expect(searchSpy).toHaveBeenCalledWith(searchDto);
      expect(result).toEqual(searchResult);
    });

    it('should search job postings by daily rate range', async () => {
      const searchDto: SearchJobPostingDto = {
        minDailyRate: 550,
        maxDailyRate: 650,
      };

      const searchResult: JobPostingSearchResult = {
        data: [jobPostings[1]],
        total: 1,
      };

      const searchSpy = jest.spyOn(jobPostingsService, 'search');
      searchSpy.mockResolvedValue(searchResult);

      const result = await jobPostingsController.search(searchDto);

      expect(searchSpy).toHaveBeenCalledWith(searchDto);
      expect(result).toEqual(searchResult);
    });

    it('should search job postings by seniority range', async () => {
      const searchDto: SearchJobPostingDto = {
        minSeniority: 3,
        maxSeniority: 4,
      };

      const searchResult: JobPostingSearchResult = {
        data: [jobPostings[0], jobPostings[1]],
        total: 2,
      };

      const searchSpy = jest.spyOn(jobPostingsService, 'search');
      searchSpy.mockResolvedValue(searchResult);

      const result = await jobPostingsController.search(searchDto);

      expect(searchSpy).toHaveBeenCalledWith(searchDto);
      expect(result).toEqual(searchResult);
    });
  });
});
