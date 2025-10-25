package com.examly.springapp.service;

import java.util.List;
import java.util.Optional;

import com.examly.springapp.model.Appointment;

public interface AppointmentService {

    Appointment addAppointment(Appointment appointment);

    void deleteAppointment(Long appointmentId);

    Optional<Appointment>getAppointmentById(Long appointmentId);

    List<Appointment> getAllAppointments();

    List<Appointment> getAppointmentsByUserId(int userId);

    Appointment updateAppointment(Long appointmentId,Appointment appointment );
    
}
