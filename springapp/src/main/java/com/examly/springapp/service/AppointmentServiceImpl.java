package com.examly.springapp.service;
 
import com.examly.springapp.model.Appointment;
import com.examly.springapp.repository.AppointmentRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
 
import java.util.List;
import java.util.Optional;
 
@Service
public class AppointmentServiceImpl implements AppointmentService {
 
    @Autowired
    private AppointmentRepo appointmentRepo;
 
    @Override
    public Appointment addAppointment(Appointment appointment) {
        return appointmentRepo.save(appointment);
    }
 
    @Override
    public void deleteAppointment(Long appointmentId) {
        appointmentRepo.deleteById(appointmentId);
    }
 
    @Override
    public Optional<Appointment> getAppointmentById(Long appointmentId) {
        return appointmentRepo.findById(appointmentId);
    }
 
    @Override
    public List<Appointment> getAllAppointments() {
        return appointmentRepo.findAll();
    }
 
    @Override
    public List<Appointment> getAppointmentsByUserId(Long userId) {
        return appointmentRepo.findByUserUserId(userId);
    }
 
    @Override
    public Appointment updateAppointment(Long appointmentId, Appointment appointment) {
        Optional<Appointment> optionalAppointment = appointmentRepo.findById(appointmentId);
 
        if (optionalAppointment.isPresent()) {
            Appointment existingAppointment = optionalAppointment.get();
 
            if (appointment.getService() != null) {
                existingAppointment.setService(appointment.getService());
            }
            if (appointment.getAppointmentDate() != null) {
                existingAppointment.setAppointmentDate(appointment.getAppointmentDate());
            }
            if (appointment.getLocation() != null) {
                existingAppointment.setLocation(appointment.getLocation());
            }
            if (appointment.getStatus() != null) {
                existingAppointment.setStatus(appointment.getStatus());
            }
            if (appointment.getUser() != null) {
                existingAppointment.setUser(appointment.getUser());
            }
 
            return appointmentRepo.save(existingAppointment);
        } else {
            return null;
        }
    }
 
    @Override
    public Appointment updateAppointmentStatus(Long appointmentId, String status) {
        Optional<Appointment> optionalAppointment = appointmentRepo.findById(appointmentId);
 
        if (optionalAppointment.isPresent()) {
            Appointment appointment = optionalAppointment.get();
            appointment.setStatus(status);
            return appointmentRepo.save(appointment);
        } else {
            return null;
        }
    }
}
 