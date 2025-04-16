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
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { SkillResponseDto } from './dto/skill-response.dto';
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
    type: SkillResponseDto,
  })
  create(@Body() createSkillDto: CreateSkillDto): Promise<SkillResponseDto> {
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
    type: [SkillResponseDto],
  })
  findAll(): Promise<SkillResponseDto[]> {
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
    type: SkillResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid UUID format',
  })
  @ApiResponse({
    status: 404,
    description: 'Skill not found',
  })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SkillResponseDto | null> {
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
    type: SkillResponseDto,
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
  ): Promise<SkillResponseDto> {
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
    type: SkillResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid UUID format',
  })
  @ApiResponse({
    status: 404,
    description: 'Skill not found',
  })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<SkillResponseDto> {
    return this.skillsService.remove(id);
  }
}
