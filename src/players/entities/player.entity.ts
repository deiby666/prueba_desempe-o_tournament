import { Result } from "src/results/entities/result.entity";
import { Tournament } from "src/tournaments/entities/tournament.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, OneToOne} from "typeorm";

@Entity()
export class Player{
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    nombre: string;

    @OneToOne(() => Result, result => result.score)
    result: Result;

    @OneToMany(()=> Tournament, tournament => tournament.player)
    tournaments: Tournament[];

}
