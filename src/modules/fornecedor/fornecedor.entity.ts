import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('fornecedores')
export class Fornecedor extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 120 })
    nome!: string;

    @Column({ type: 'boolean', default: true })
    ativo!: boolean;

    @CreateDateColumn({ name: 'criado_em' })
    criadoEm!: Date;

    @UpdateDateColumn({ name: 'atualizado_em', nullable: true })
    atualizadoEm!: Date;
}
