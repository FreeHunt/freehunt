import { Test } from '@nestjs/testing';
import { JobPostingsController } from './job-postings.controller';
import { JobPostingsService } from './job-postings.service';
import { JobPosting, JobPostingLocation, Role, User } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';
import { PrismaServiceMock } from '../../test/mocks/prisma.mock';
import { CreateJobPostingDto } from './dto/create-job-posting.dto';
import { SearchJobPostingDto } from './dto/search-job-posting.dto';
import { JobPostingSearchResult } from './dto/job-posting-search-result.dto';
import { SkillsService } from '../skills/skills.service';
import { FreelancesService } from '../freelances/freelances.service';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';
import { EnvironmentService } from '../common/environment/environment.service';
import { AuthentikService } from '../common/authentik/authentik.service';
import { StripeService } from '../common/stripe/stripe.service';
import { HttpModule } from '@nestjs/axios';

// Interface pour les job postings avec recommandation
interface JobPostingWithRecommendation extends JobPosting {
  recommended: boolean;
}

describe('JobPostingsController', () => {
  let jobPostingsController: JobPostingsController;
  let jobPostingsService: JobPostingsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [JobPostingsController],
      providers: [
        JobPostingsService,
        {
          provide: PrismaService,
          useValue: PrismaServiceMock,
        },
        SkillsService,
        FreelancesService,
        UsersService,
        AuthService,
        EnvironmentService,
        AuthentikService,
        {
          provide: StripeService,
          useValue: {
            createCheckoutSession: jest.fn().mockResolvedValue({
              id: 'cs_test_123',
              url: 'https://checkout.stripe.com/test',
            }),
          },
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
    location: JobPostingLocation.ONSITE,
    isPromoted: false,
    averageDailyRate: 500,
    seniority: 5,
    companyId: '3246540a-3ecd-4912-a909-953c881816fc',
    totalAmount: 5000, // Ajout du champ totalAmount
  };

  const jobPosting: JobPosting = {
    ...createJobPostingDto,
    id: '3246540a-3ecd-4912-a909-953c881816fc',
    totalAmount: 5000,
    status: 'PENDING_PAYMENT', // Ajout du champ status
    stripeSessionId: null,
    stripeRefundId: null,
    canceledAt: null,
    cancelReason: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Mock user freelance pour les tests de recommandation
  const mockFreelanceUser: User = {
    id: 'freelance-user-id',
    email: 'freelance@test.com',
    username: 'testfreelance',
    role: Role.FREELANCE,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCompanyUser: User = {
    id: 'company-user-id',
    email: 'company@test.com',
    username: 'testcompany',
    role: Role.COMPANY,
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
      jest.spyOn(jobPostingsService, 'findAllByRole').mockResolvedValue([jobPosting]);
      expect(await jobPostingsController.findAll(mockCompanyUser)).toEqual([jobPosting]);
      expect(jobPostingsService.findAllByRole).toHaveBeenCalledWith(mockCompanyUser);
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
        await jobPostingsController.update(jobPosting.id, {
          ...updatedJobPosting,
          totalAmount: updatedJobPosting.totalAmount || undefined,
        }, mockCompanyUser),
      ).toEqual(updatedJobPosting);
    });
  });

  describe('remove', () => {
    it('should remove a job posting', async () => {
      jest.spyOn(jobPostingsService, 'remove').mockResolvedValue(jobPosting);
      expect(await jobPostingsController.remove(jobPosting.id, mockCompanyUser)).toEqual(
        jobPosting,
      );
    });
  });

  describe('search', () => {
    const jobPostings: JobPostingWithRecommendation[] = [
      {
        id: '3246540a-3ecd-4912-a909-953c881816fc',
        title: 'Frontend Developer',
        description:
          'We are looking for a Frontend Developer to join our team.',
        location: JobPostingLocation.REMOTE,
        isPromoted: true,
        averageDailyRate: 600,
        seniority: 3,
        companyId: '3246540a-3ecd-4912-a909-953c881816fc',
        totalAmount: 12000,
        status: 'PUBLISHED',
        stripeSessionId: null,
        stripeRefundId: null,
        canceledAt: null,
        cancelReason: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        recommended: false,
      },
      {
        id: '4246540a-3ecd-4912-a909-953c881816fd',
        title: 'Backend Developer',
        description: 'We are looking for a Backend Developer to join our team.',
        location: JobPostingLocation.ONSITE,
        isPromoted: false,
        averageDailyRate: 650,
        seniority: 4,
        companyId: '3246540a-3ecd-4912-a909-953c881816fc',
        totalAmount: 13000,
        status: 'PUBLISHED',
        stripeSessionId: null,
        stripeRefundId: null,
        canceledAt: null,
        cancelReason: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        recommended: false,
      },
    ];

    const recommendedJobPosting: JobPostingWithRecommendation = {
      id: '5246540a-3ecd-4912-a909-953c881816fe',
      title: 'Full Stack Developer',
      description:
        'We are looking for a Full Stack Developer to join our team.',
      location: JobPostingLocation.HYBRID,
      isPromoted: false,
      averageDailyRate: 700,
      seniority: 5,
      companyId: '3246540a-3ecd-4912-a909-953c881816fc',
      totalAmount: 14000,
      status: 'PUBLISHED',
      stripeSessionId: null,
      stripeRefundId: null,
      canceledAt: null,
      cancelReason: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      recommended: true,
    };

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

      expect(searchSpy).toHaveBeenCalledWith(searchDto, undefined);
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

      expect(searchSpy).toHaveBeenCalledWith(searchDto, undefined);
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

      expect(searchSpy).toHaveBeenCalledWith(searchDto, undefined);
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

      expect(searchSpy).toHaveBeenCalledWith(searchDto, undefined);
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

      expect(searchSpy).toHaveBeenCalledWith(searchDto, undefined);
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

      expect(searchSpy).toHaveBeenCalledWith(searchDto, undefined);
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

      expect(searchSpy).toHaveBeenCalledWith(searchDto, undefined);
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

      expect(searchSpy).toHaveBeenCalledWith(searchDto, undefined);
      expect(result).toEqual(searchResult);
    });

    // Nouveaux tests pour les recommandations
    it('should prioritize recommended job postings for freelance users', async () => {
      const searchDto: SearchJobPostingDto = {};

      const searchResult: JobPostingSearchResult = {
        data: [recommendedJobPosting, ...jobPostings], // Recommended en premier
        total: 3,
      };

      const searchSpy = jest.spyOn(jobPostingsService, 'search');
      searchSpy.mockResolvedValue(searchResult);

      const result = await jobPostingsController.search(
        searchDto,
        mockFreelanceUser,
      );

      expect(searchSpy).toHaveBeenCalledWith(searchDto, mockFreelanceUser);
      expect(result).toEqual(searchResult);
      expect(result.data[0].recommended).toBe(true);
    });

    it('should not apply recommendations for company users', async () => {
      const searchDto: SearchJobPostingDto = {};

      const searchResult: JobPostingSearchResult = {
        data: jobPostings,
        total: jobPostings.length,
      };

      const searchSpy = jest.spyOn(jobPostingsService, 'search');
      searchSpy.mockResolvedValue(searchResult);

      const result = await jobPostingsController.search(
        searchDto,
        mockCompanyUser,
      );

      expect(searchSpy).toHaveBeenCalledWith(searchDto, mockCompanyUser);
      expect(result).toEqual(searchResult);
      expect(result.data.every((job) => job.recommended === false)).toBe(true);
    });

    it('should search without user context', async () => {
      const searchDto: SearchJobPostingDto = {
        title: 'Developer',
      };

      const searchResult: JobPostingSearchResult = {
        data: jobPostings,
        total: jobPostings.length,
      };

      const searchSpy = jest.spyOn(jobPostingsService, 'search');
      searchSpy.mockResolvedValue(searchResult);

      const result = await jobPostingsController.search(searchDto);

      expect(searchSpy).toHaveBeenCalledWith(searchDto, undefined);
      expect(result).toEqual(searchResult);
    });

    it('should handle search with freelance user having matching skills', async () => {
      const searchDto: SearchJobPostingDto = {
        skillNames: ['React', 'Node.js', 'TypeScript'],
      };

      const matchingJobPosting: JobPostingWithRecommendation = {
        ...jobPostings[0],
        recommended: true,
      };

      const searchResult: JobPostingSearchResult = {
        data: [matchingJobPosting],
        total: 1,
      };

      const searchSpy = jest.spyOn(jobPostingsService, 'search');
      searchSpy.mockResolvedValue(searchResult);

      const result = await jobPostingsController.search(
        searchDto,
        mockFreelanceUser,
      );

      expect(searchSpy).toHaveBeenCalledWith(searchDto, mockFreelanceUser);
      expect(result).toEqual(searchResult);
      expect(result.data[0].recommended).toBe(true);
    });
  });

  describe('canBeCancelled', () => {
    it('should check if a job posting can be cancelled', async () => {
      const canBeCancelledResult = { canBeCancelled: true };
      jest.spyOn(jobPostingsService, 'canBeCancelled').mockResolvedValue(true);

      expect(await jobPostingsController.canBeCancelled(jobPosting.id)).toEqual(
        canBeCancelledResult,
      );
    });

    it('should return false if job posting cannot be cancelled', async () => {
      const canBeCancelledResult = { canBeCancelled: false };
      jest.spyOn(jobPostingsService, 'canBeCancelled').mockResolvedValue(false);

      expect(await jobPostingsController.canBeCancelled(jobPosting.id)).toEqual(
        canBeCancelledResult,
      );
    });
  });

  describe('cancelJobPosting', () => {
    it('should cancel a job posting successfully without refund', async () => {
      const mockUser: User = {
        id: 'user-1',
        email: 'company@test.com',
        username: 'Company User',
        role: Role.COMPANY,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const cancelResponse = {
        success: true,
        message: 'Job posting has been canceled (no payment to refund)',
      };

      jest
        .spyOn(jobPostingsService, 'cancelJobPosting')
        .mockResolvedValue(cancelResponse);

      expect(
        await jobPostingsController.cancelJobPosting(
          jobPosting.id,
          { reason: 'Requirements changed' },
          mockUser,
        ),
      ).toEqual(cancelResponse);
    });

    it('should cancel a job posting successfully with refund', async () => {
      const mockUser: User = {
        id: 'user-1',
        email: 'company@test.com',
        username: 'Company User',
        role: Role.COMPANY,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const cancelResponse = {
        success: true,
        message: 'Job posting has been canceled and refund has been processed',
        refundId: 're_test_123',
        refundAmount: 49.99,
        refundStatus: 'succeeded',
      };

      jest
        .spyOn(jobPostingsService, 'cancelJobPosting')
        .mockResolvedValue(cancelResponse);

      expect(
        await jobPostingsController.cancelJobPosting(
          jobPosting.id,
          { reason: 'Project canceled' },
          mockUser,
        ),
      ).toEqual(cancelResponse);
    });

    it('should throw error if job posting cannot be canceled due to existing project', async () => {
      const mockUser: User = {
        id: 'user-1',
        email: 'company@test.com',
        username: 'Company User',
        role: Role.COMPANY,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(jobPostingsService, 'cancelJobPosting')
        .mockRejectedValue(
          new Error(
            'Cannot cancel job posting: A project has already been created from this job posting',
          ),
        );

      await expect(
        jobPostingsController.cancelJobPosting(
          jobPosting.id,
          { reason: 'Change of mind' },
          mockUser,
        ),
      ).rejects.toThrow(
        'Cannot cancel job posting: A project has already been created from this job posting',
      );
    });

    it('should throw error if user is not authorized', async () => {
      const mockUser: User = {
        id: 'different-user',
        email: 'other@test.com',
        username: 'Other User',
        role: Role.COMPANY,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(jobPostingsService, 'cancelJobPosting')
        .mockRejectedValue(
          new Error('You are not authorized to cancel this job posting'),
        );

      await expect(
        jobPostingsController.cancelJobPosting(
          jobPosting.id,
          { reason: 'Unauthorized attempt' },
          mockUser,
        ),
      ).rejects.toThrow('You are not authorized to cancel this job posting');
    });
  });
});
