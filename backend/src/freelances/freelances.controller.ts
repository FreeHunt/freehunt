import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FreelancesService } from './freelances.service';
import { CreateFreelanceDto } from './dto/create-freelance.dto';
import { UpdateFreelanceDto } from './dto/update-freelance.dto';

@Controller('freelances')
export class FreelancesController {
  constructor(private readonly freelancesService: FreelancesService) {}

  @Post()
  create(@Body() createFreelanceDto: CreateFreelanceDto) {
    return this.freelancesService.create(createFreelanceDto);
  }

  @Get()
  findAll() {
    return this.freelancesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.freelancesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFreelanceDto: UpdateFreelanceDto,
  ) {
    return this.freelancesService.update(+id, updateFreelanceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.freelancesService.remove(+id);
  }
}
