import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { Postagem } from '../../postagem/entities/postagem.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'tb_temas' })
export class Tema {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsNotEmpty()
  @ApiProperty()
  @Column({ length: 255, nullable: false })
  descricao: string;

  @ApiProperty()
  @OneToMany(() => Postagem, (postagem) => postagem.tema)
  postagem: Postagem[];
}
