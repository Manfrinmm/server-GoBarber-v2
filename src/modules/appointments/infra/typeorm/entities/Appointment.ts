import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("appointments")
class Appointment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("uuid")
  user_id: string;

  @Column("uuid")
  provider_id: string;

  @Column("timestamp with time zone")
  date: Date;
}

export default Appointment;
