import { Player } from "src/players/entities/player.entity";
import { Column, Entity, PrimaryGeneratedColumn, OneToOne, DeleteDateColumn } from "typeorm";


@Entity()
export class Result{
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    score: string;

    @OneToOne(() => Player, player => player.result)
    player : Player;

    @DeleteDateColumn()
    deletedAt: Date;
}