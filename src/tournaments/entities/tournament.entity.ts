import { Player } from "src/players/entities/player.entity";
import { Column, Entity, OneToMany,ManyToOne, PrimaryGeneratedColumn, DeleteDateColumn} from "typeorm";

@Entity()
export class Tournament{
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    nombre: string;

    @OneToMany(() => Player, player => player.tournament)
    players: Player[];

    @DeleteDateColumn()
    deletedAt: Date;
}
