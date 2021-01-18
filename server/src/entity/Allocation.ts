import {
  AfterLoad,
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Activity } from "./Activity";
import { Staff } from "./Staff";

@Entity()
export class Allocation extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Activity, (activity) => activity.allocations, {
    primary: true,
  })
  activity!: Activity;

  @Column()
  activityId!: string;

  @ManyToOne(() => Staff, (staff) => staff.allocations, { primary: true })
  staff!: Staff;

  @Column()
  staffId!: string;

  //expiry date default: 7 days from current date
  @Column({ type: "timestamp", default: new Date().getDate() + 7 })
  offerExpiryDate!: Date;

  @Column({ nullable: true, default: null })
  isLecturerApproved?: boolean;

  @Column({ nullable: true, default: false })
  isTaAccepted?: boolean;

  @Column({ nullable: true, default: null })
  isWorkforceApproved?: boolean;

  isExpired!: boolean; //status

  //check every time you retrieve the data from the allocation table.
  //if current date == offer expiry date, then isExpired= true
  @AfterLoad()
  checkExpiry() {
    const todayDate = new Date();
    //check if isExpired
    if (todayDate >= this.offerExpiryDate) {
      this.isExpired = true; //isExprid = true
    }
  }
}

//Things to consider:
//find a way to allow lectruers to decide the offer expiry date, else the default value is 7 days
