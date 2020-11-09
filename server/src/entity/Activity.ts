import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  Unique,
} from "typeorm";
import { DayOfWeek } from "../enums/DayOfWeek";
import { Allocation } from "./Allocation";
import { Unit } from "./Unit";

@Entity()
@Unique(["activityCode", "unit"])
export class Activity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  activityCode!: string;

  @Column()
  activityGroup!: string;

  // TODO: Do we need campus if campus is also in unit ?
  @Column({
    type: "varchar",
    length: 2,
  })
  campus!: string;

  @Column()
  location!: string;

  @Column()
  duration!: number;

  // TODO: varchar for sqlite compatibility in test?
  @Column({
    type: "varchar",
  })
  dayOfWeek!: DayOfWeek;

  @Column({ type: "time" })
  startTime!: string; // TODO: Date object or string to store time only?

  @OneToMany(() => Allocation, (allocation) => allocation.activity)
  allocations!: Allocation[];

  // @RelationId((activity: Activity) => activity.allocations)
  // allocationIds!: string[];

  @ManyToOne(() => Unit, (unit) => unit.activities)
  unit!: Unit;

  @RelationId((activity: Activity) => activity.unit)
  unitId!: string;
}