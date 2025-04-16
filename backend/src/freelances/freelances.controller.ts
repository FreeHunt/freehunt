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

@Controller('freelances')
export class FreelancesController {
  constructor(private readonly freelancesService: FreelancesService) {}

  @Post()
  async create(@Body() createFreelanceDto: CreateFreelanceDto) {
    return this.freelancesService.create(createFreelanceDto);
  }

  @Get()
  async findAll() {
    return this.freelancesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.freelancesService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateFreelanceDto: UpdateFreelanceDto,
  ) {
    return this.freelancesService.update(id, updateFreelanceDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.freelancesService.remove(id);
  }
}
