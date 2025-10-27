import { User } from "./user.model";
import { VehicleMaintenance } from "./vehicle-maintenance.model";

export interface Appointment {
appointmentId?: number;

service: VehicleMaintenance;
appointmentDate: string; 
location: string; 
user?: User
status?: string;
} 




