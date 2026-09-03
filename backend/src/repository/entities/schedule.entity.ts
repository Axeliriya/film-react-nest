import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Film } from './film.entity';

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  daytime: string;

  @Column()
  hall: number;

  @Column()
  rows: number;

  @Column()
  seats: number;

  @Column('double precision')
  price: number;

  @Column('text')
  taken: string;

  @ManyToOne(() => Film, (film) => film.schedule, {
    nullable: true,
  })
  film: Film | null;
}
