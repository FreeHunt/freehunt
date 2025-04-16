import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { Company } from '@prisma/client';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
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
  })
  create(@Body() createCompanyDto: CreateCompanyDto): Promise<Company> {
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
  })
  findAll(): Promise<Company[]> {
    return this.companiesService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Find a company by ID',
    description: 'Retrieve a company by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the company',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the company with the specified ID',
  })
  @ApiResponse({
    status: 404,
    description: 'Company not found',
  })
  findOne(@Param('id') id: string): Promise<Company | null> {
    return this.companiesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a company',
    description: 'Update a company by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the company',
  })
  @ApiResponse({
    status: 200,
    description: 'The company has been successfully updated',
  })
  @ApiResponse({
    status: 404,
    description: 'Company not found',
  })
  update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company> {
    return this.companiesService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remove a company',
    description: 'Delete a company by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the company',
  })
  @ApiResponse({
    status: 200,
    description: 'The company has been successfully deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Company not found',
  })
  remove(@Param('id') id: string): Promise<Company> {
    return this.companiesService.remove(id);
  }
}
