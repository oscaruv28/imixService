import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, EntityManager } from '@mikro-orm/mongodb';
import { CreditRequest } from './credit-request.entity';

@Injectable()
export class CreditsService {
    constructor(
        @InjectRepository(CreditRequest)
        private readonly repository: EntityRepository<CreditRequest>,
        private readonly em: EntityManager,
    ) { }

    async create(amount: number, applicantId: string) {
        const request = this.repository.create({
            amount,
            applicantId,
            status: 'processing',
        } as any);

        await this.em.persistAndFlush(request);
        this.runInclusionScoreAI(request.id);
        return request;
    }

    private async runInclusionScoreAI(requestId: string) {
        console.log(`🧠 IA: Analizando solicitud ${requestId}...`);

        await new Promise((resolve) => setTimeout(resolve, 4000)); // Simulación procesamiento AI

        const request = await this.repository.findOne(requestId);
        if (request) {
            const score = Math.floor(Math.random() * (1000 - 200 + 1)) + 200;

            request.aiScore = score;
            request.status = score > 550 ? 'approved' : 'rejected';
            request.aiAnalysis = `InclusiónScore AI completado. Score: ${score}. Basado en comportamiento transaccional rural.`;

            await this.em.flush();
            console.log(`✅ IA: Solicitud ${requestId} procesada con resultado: ${request.status}`);
        }
    }

    async findAll() {
        return this.repository.findAll();
    }
}