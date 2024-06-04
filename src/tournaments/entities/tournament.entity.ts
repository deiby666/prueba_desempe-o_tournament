import { Player } from "src/players/entities/player.entity";
import { Column, Entity, OneToMany,ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Tournament{
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    nombre: string;

    @ManyToOne(() => Player, player => player.tournaments)
    player: Player;

}
