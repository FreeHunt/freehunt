import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { CheckpointsService } from './checkpoints.service';
import { CreateCheckpointDto } from './dto/create-checkpoint.dto';
import { UpdateCheckpointDto } from './dto/update-checkpoint.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('checkpoints')
@ApiTags('Checkpoints')
export class CheckpointsController {
  constructor(private readonly checkpointsService: CheckpointsService) {}

  @Post()
  create(@Body() createCheckpointDto: CreateCheckpointDto) {
    return this.checkpointsService.create(createCheckpointDto);
  }

  @Get('job-posting/:jobPostingId')
  findByJobPostingId(@Param('jobPostingId') jobPostingId: string) {
    return this.checkpointsService.findByJobPostingId(jobPostingId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.checkpointsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCheckpointDto: UpdateCheckpointDto,
  ) {
    return this.checkpointsService.update(id, updateCheckpointDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.checkpointsService.delete(id);
  }
}
