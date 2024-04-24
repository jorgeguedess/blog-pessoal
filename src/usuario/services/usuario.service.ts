import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { Bcrypt } from '../../auth/bcrypt/bcrypt';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    private bcrypt: Bcrypt,
  ) {}

  async findByUsuario(usuarioObjeto: string): Promise<Usuario | undefined> {
    return await this.usuarioRepository.findOne({
      where: {
        usuario: usuarioObjeto,
      },
    });
  }

  async findAll(): Promise<Usuario[]> {
    return await this.usuarioRepository.find({
      relations: {
        postagem: true,
      },
    });
  }

  async findById(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: {
        id,
      },
      relations: {
        postagem: true,
      },
    });

    if (!usuario)
      throw new HttpException('Usuário não encontrado!', HttpStatus.NOT_FOUND);

    return usuario;
  }

  async create(usuarioObjeto: Usuario): Promise<Usuario> {
    const buscaUsuario = await this.findByUsuario(usuarioObjeto.usuario);

    if (!buscaUsuario) {
      usuarioObjeto.senha = await this.bcrypt.criptografarSenha(
        usuarioObjeto.senha,
      );
      return await this.usuarioRepository.save(usuarioObjeto);
    }

    throw new HttpException(
      'O Usuário (e-mail) já existe!',
      HttpStatus.BAD_REQUEST,
    );
  }

  async update(usuarioObjeto: Usuario): Promise<Usuario> {
    const updateUsuario: Usuario = await this.findById(usuarioObjeto.id);
    const buscaUsuario = await this.findByUsuario(usuarioObjeto.usuario);

    if (!updateUsuario)
      throw new HttpException('Usuário não encontrado!', HttpStatus.NOT_FOUND);

    if (buscaUsuario && buscaUsuario.id !== usuarioObjeto.id)
      throw new HttpException(
        'O Usuário (e-mail) já existe!',
        HttpStatus.BAD_REQUEST,
      );

    usuarioObjeto.senha = await this.bcrypt.criptografarSenha(
      usuarioObjeto.senha,
    );
    return await this.usuarioRepository.save(usuarioObjeto);
  }
}
