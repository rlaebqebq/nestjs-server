import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsUUID } from 'class-validator';
import { BaseEntity, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class CommonEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'id',
    required: false,
  })
  @IsUUID()
  id: string;

  @CreateDateColumn({
    type: 'datetime',
    comment: '생성일',
  })
  @ApiProperty({
    description: '생성일',
    required: false,
  })
  createDt: Date;

  @UpdateDateColumn({ type: 'datetime', comment: '수정일' })
  @ApiProperty({
    description: '수정일',
    required: false,
  })
  updateDt: Date;

  @DeleteDateColumn({ type: 'datetime', comment: '삭제일' })
  @ApiProperty({
    description: '삭제일',
    required: false,
  })
  @Exclude()
  deleteDt?: Date | null;
}
