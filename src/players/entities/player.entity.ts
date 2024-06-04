import { Result } from "src/results/entities/result.entity";
import { Tournament } from "src/tournaments/entities/tournament.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, OneToOne, ManyToOne, DeleteDateColumn} from "typeorm";

@Entity()
export class Player{
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    nombre: string;

    @OneToOne(() => Result, result => result.score)
    result: Result;

    @ManyToOne(() => Tournament, Tournament => Tournament.players)
    tournament: Tournament;

    @DeleteDateColumn()
    deletedAt: Date;

}
