import { BeforeInsert, BeforeUpdate, Column, Entity, OneToOne } from 'typeorm';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProjectEntity } from 'project/project.entity';
import { CommonEntity } from 'common/common.entity';

@Entity({
  name: 'image',
  schema: 'public',
})
export class ImageEntity extends CommonEntity {
  @OneToOne(() => ProjectEntity, (i: ProjectEntity) => i.id, {
    nullable: false,
  })
  @IsUUID()
  projectId: string;

  @OneToOne(() => ProjectEntity, (i: ProjectEntity) => i.id, {
    nullable: false,
  })
  @IsUUID()
  imageFilesId: string;

  @Column({
    type: 'simple-array',
  })
  @ApiProperty({ type: 'array', items: { type: 'string' }, required: true })
  @IsString({ each: true })
  @IsNotEmpty()
  imageFiles: string;

  @Column({
    type: 'varchar',
  })
  thumbnail?: string;

  @BeforeInsert()
  @BeforeUpdate()
  setThumbnailFromImageFiles() {
    if (this.imageFiles) {
      const imageArray = this.imageFiles.split(',');
      if (Array.isArray(imageArray) && imageArray.length > 0) {
        this.thumbnail = imageArray[0];
      }
    }
  }
}
