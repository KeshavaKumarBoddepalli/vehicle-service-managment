package com.examly.springapp.service;

import com.examly.springapp.model.Appointment;
import com.examly.springapp.model.User;
import com.examly.springapp.model.VehicleMaintenance;
import com.examly.springapp.repository.AppointmentRepo;
import com.examly.springapp.repository.UserRepo;
import com.examly.springapp.repository.VehicleServiceRepo;


import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    
    private AppointmentRepo appointmentRepo;
    private UserRepo userRepo;
    private VehicleServiceRepo vehicleServiceRepo;
    

    public AppointmentServiceImpl(AppointmentRepo appointmentRepo, UserRepo userRepo,
            VehicleServiceRepo vehicleServiceRepo) {
        this.appointmentRepo = appointmentRepo;
        this.userRepo = userRepo;
        this.vehicleServiceRepo = vehicleServiceRepo;
    }


    @Override
    public Appointment addAppointment(Appointment appointment) {
        if (appointment.getUser() == null || appointment.getService() == null) {
            throw new IllegalArgumentException("User or Service object is missing in request");
        }

        Integer userId = appointment.getUser().getUserId(); // use Integer
        Long serviceId = appointment.getService().getServiceId();

        // Load managed entities from DB
        User user = userRepo.findById(userId).orElseThrow(() ->
            new IllegalArgumentException("User not found in DB"));

        VehicleMaintenance service = vehicleServiceRepo.findById(serviceId).orElseThrow(() ->
            new IllegalArgumentException("Service not found in DB"));

        // Set managed entities
        appointment.setUser(user);
        appointment.setService(service);

        return appointmentRepo.save(appointment);
    }


    // @Override
    // public Appointment addAppointment(Appointment appointment) {
    //     return appointmentRepo.save(appointment);
    // }

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
