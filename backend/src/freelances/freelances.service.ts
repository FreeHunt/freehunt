import { Injectable } from '@nestjs/common';
import { CreateFreelanceDto } from './dto/create-freelance.dto';
import { UpdateFreelanceDto } from './dto/update-freelance.dto';

@Injectable()
export class FreelancesService {
  create(createFreelanceDto: CreateFreelanceDto) {
    return 'This action adds a new freelance';
  }

  findAll() {
    return `This action returns all freelances`;
  }

  findOne(id: number) {
    return `This action returns a #${id} freelance`;
  }

  update(id: number, updateFreelanceDto: UpdateFreelanceDto) {
    return `This action updates a #${id} freelance`;
  }

  remove(id: number) {
    return `This action removes a #${id} freelance`;
  }
}
