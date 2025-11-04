import { User } from "./user.model";
import { VehicleMaintenance } from "./vehicle-maintenance.model";
 
export interface Appointment {
  appointmentId?: number;
  service: VehicleMaintenance;
  // This should be a string in 'YYYY-MM-DD' format
  appointmentDate: string;
  // This is the new field for the time slot
  timeSlot: string;
  location: string;
  user: User;
  status?: string;
}