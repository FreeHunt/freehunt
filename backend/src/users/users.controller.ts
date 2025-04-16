import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a user',
    description: 'Create a new user with email and role',
  })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created',
  })
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Find all users',
    description: 'Retrieve all users',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns all users',
  })
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Find a user by ID',
    description: 'Retrieve a user by their ID',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the user',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the user with the specified ID',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  findOne(@Param('id') id: string): Promise<User | null> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a user',
    description: 'Update a user by their ID',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the user',
  })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remove a user',
    description: 'Delete a user by their ID',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the user',
  })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  remove(@Param('id') id: string): Promise<User> {
    return this.usersService.remove(id);
  }
}
