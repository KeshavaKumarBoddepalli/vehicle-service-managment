package com.examly.springapp.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.examly.springapp.model.Appointment;
import com.examly.springapp.repository.AppointmentRepo;

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
    public List<Appointment> getAppointmentsByUserId(int userId) {
      return appointmentRepo.findByUserUserId(userId);
    }

    @Override
    public Appointment updateAppointment(Long appointmentId, Appointment appointment) {
       Optional<Appointment> optionalAppointment=appointmentRepo.findById(appointmentId);

       if(optionalAppointment.isPresent()){
        Appointment existingAppointment = optionalAppointment.get();
        existingAppointment.setService(appointment.getService());

        existingAppointment.setApponitmentDate(appointment.getApponitmentDate());
        existingAppointment.setLoaction(appointment.getLoaction());
        existingAppointment.setStatus(appointment.getStatus());
        existingAppointment.setUser(appointment.getUser());

        return appointmentRepo.save(existingAppointment);
       }else{
        throw new RuntimeException("Appointment not found");
       }
    }
}
