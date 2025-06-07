import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompanyResponseDto } from './dto/company-response.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('companies')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a company',
    description: 'Create a new company profile',
  })
  @ApiResponse({
    status: 201,
    description: 'The company has been successfully created',
    type: CompanyResponseDto,
  })
  create(
    @Body() createCompanyDto: CreateCompanyDto,
  ): Promise<CompanyResponseDto> {
    return this.companiesService.create(createCompanyDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Find all companies',
    description: 'Retrieve all companies',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns all companies',
    type: [CompanyResponseDto],
  })
  findAll(): Promise<CompanyResponseDto[]> {
    return this.companiesService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Find a company by ID',
    description: 'Retrieve a company by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the company (must be a valid UUID)',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the company with the specified ID',
    type: CompanyResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid UUID format',
  })
  @ApiResponse({
    status: 404,
    description: 'Company not found',
  })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CompanyResponseDto | null> {
    return this.companiesService.findOne(id);
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: 'Find a company by user ID',
    description: 'Retrieve a company associated with a specific user ID',
  })
  @ApiParam({
    name: 'userId',
    description: 'The ID of the user (must be a valid UUID)',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the company associated with the specified user ID',
    type: CompanyResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid UUID format',
  })
  @ApiResponse({
    status: 404,
    description: 'Company not found for the specified user ID',
  })
  findByUserId(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<CompanyResponseDto | null> {
    return this.companiesService.findByUserId(userId);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a company',
    description: 'Update a company by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the company (must be a valid UUID)',
  })
  @ApiResponse({
    status: 200,
    description: 'The company has been successfully updated',
    type: CompanyResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid UUID format',
  })
  @ApiResponse({
    status: 404,
    description: 'Company not found',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ): Promise<CompanyResponseDto> {
    return this.companiesService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remove a company',
    description: 'Delete a company by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the company (must be a valid UUID)',
  })
  @ApiResponse({
    status: 200,
    description: 'The company has been successfully deleted',
    type: CompanyResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid UUID format',
  })
  @ApiResponse({
    status: 404,
    description: 'Company not found',
  })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<CompanyResponseDto> {
    return this.companiesService.remove(id);
  }
}
