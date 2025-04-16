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
import { FreelancesService } from './freelances.service';
import { CreateFreelanceDto } from './dto/create-freelance.dto';
import { UpdateFreelanceDto } from './dto/update-freelance.dto';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { FreelanceResponseDto } from './dto/freelance-response.dto';

@Controller('freelances')
export class FreelancesController {
  constructor(private readonly freelancesService: FreelancesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a freelance',
    description: 'Create a new freelance profile',
  })
  @ApiResponse({
    status: 201,
    description: 'The freelance has been successfully created',
    type: FreelanceResponseDto,
  })
  async create(
    @Body() createFreelanceDto: CreateFreelanceDto,
  ): Promise<FreelanceResponseDto> {
    return this.freelancesService.create(createFreelanceDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Find all freelances',
    description: 'Retrieve all freelances',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns all freelances',
    type: [FreelanceResponseDto],
  })
  async findAll(): Promise<FreelanceResponseDto[]> {
    return this.freelancesService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Find a freelance by ID',
    description: 'Retrieve a freelance by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the freelance (must be a valid UUID)',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the freelance with the specified ID',
    type: FreelanceResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid ID format',
  })
  @ApiResponse({
    status: 404,
    description: 'Freelance not found',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<FreelanceResponseDto | null> {
    return this.freelancesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a freelance by ID',
    description: 'Update a freelance by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the freelance (must be a valid UUID)',
  })
  @ApiResponse({
    status: 200,
    description: 'The freelance has been successfully updated',
    type: FreelanceResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid ID format',
  })
  @ApiResponse({
    status: 404,
    description: 'Freelance not found',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateFreelanceDto: UpdateFreelanceDto,
  ): Promise<FreelanceResponseDto> {
    return this.freelancesService.update(id, updateFreelanceDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a freelance by ID',
    description: 'Delete a freelance by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the freelance (must be a valid UUID)',
  })
  @ApiResponse({
    status: 200,
    description: 'The freelance has been successfully deleted',
    type: FreelanceResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid ID format',
  })
  @ApiResponse({
    status: 404,
    description: 'Freelance not found',
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<FreelanceResponseDto> {
    return this.freelancesService.remove(id);
  }
}
