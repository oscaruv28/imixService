import { Injectable } from '@nestjs/common';
import { EntityRepository, EntityManager } from '@mikro-orm/core'; // Añadido EntityManager
import { InjectRepository } from '@mikro-orm/nestjs';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: EntityRepository<UserEntity>,
        private readonly em: EntityManager, // <-- Inyectamos el EM para poder usar persistAndFlush
    ) { }

    async findByUsername(username: string): Promise<UserEntity | null> {
        return this.userRepository.findOne({ username });
    }

    async count() {
        return await this.userRepository.count();
    }

    async create(data: any) {
        const user = this.userRepository.create(data);
        await this.em.persistAndFlush(user); // Ahora 'em' sí existe
        return user;
    }
}