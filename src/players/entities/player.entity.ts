import { Result } from "src/results/entities/result.entity";
import { Tournament } from "src/tournaments/entities/tournament.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, OneToOne, ManyToOne, DeleteDateColumn, JoinColumn} from "typeorm";

@Entity()
export class Player{
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    nombre: string;

    @OneToOne(() => Result, result => result.score)
    @JoinColumn()
    result: Result;

    @ManyToOne(() => Tournament, Tournament => Tournament.players)
    @JoinColumn({name: 'tournamentId'})
    tournament: Tournament;

    @DeleteDateColumn()
    deletedAt: Date;

}
