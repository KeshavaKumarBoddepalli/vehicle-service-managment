package com.examly.springapp.service;

import com.examly.springapp.model.Appointment;

import java.util.List;
import java.util.Optional;

public interface AppointmentService {

    Appointment addAppointment(Appointment appointment);

    void deleteAppointment(Long appointmentId);

    Optional<Appointment> getAppointmentById(Long appointmentId);

    List<Appointment> getAllAppointments();

    List<Appointment> getAppointmentsByUserId(Long userId);

    Appointment updateAppointment(Long appointmentId, Appointment appointment);

    Appointment updateAppointmentStatus(Long appointmentId, String status);
}
