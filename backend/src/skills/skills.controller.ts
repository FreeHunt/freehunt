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
import { SkillsService } from './skills.service';
import { Skill } from '@prisma/client';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('skills')
@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a skill',
    description: 'Create a new skill with name, aliases, and type',
  })
  @ApiResponse({
    status: 201,
    description: 'The skill has been successfully created',
  })
  create(@Body() createSkillDto: CreateSkillDto): Promise<Skill> {
    return this.skillsService.create(createSkillDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Find all skills',
    description: 'Retrieve all skills',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns all skills',
  })
  findAll(): Promise<Skill[]> {
    return this.skillsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Find a skill by ID',
    description: 'Retrieve a skill by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the skill (must be a valid UUID)',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the skill with the specified ID',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid UUID format',
  })
  @ApiResponse({
    status: 404,
    description: 'Skill not found',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Skill | null> {
    return this.skillsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a skill',
    description: 'Update a skill by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the skill (must be a valid UUID)',
  })
  @ApiResponse({
    status: 200,
    description: 'The skill has been successfully updated',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid UUID format',
  })
  @ApiResponse({
    status: 404,
    description: 'Skill not found',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSkillDto: UpdateSkillDto,
  ): Promise<Skill> {
    return this.skillsService.update(id, updateSkillDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remove a skill',
    description: 'Delete a skill by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the skill (must be a valid UUID)',
  })
  @ApiResponse({
    status: 200,
    description: 'The skill has been successfully deleted',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid UUID format',
  })
  @ApiResponse({
    status: 404,
    description: 'Skill not found',
  })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<Skill> {
    return this.skillsService.remove(id);
  }
}
