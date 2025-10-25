package com.examly.springapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.examly.springapp.model.Appointment;
import com.examly.springapp.service.AppointmentService;

import java.util.List;
import java.util.Optional;
 
@RestController
@RequestMapping("/api/appointment")
public class AppointmentController {
 
    @Autowired
    private AppointmentService appointmentService;
 
    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Appointment> addAppointment(@RequestBody Appointment appointment) {
        try {
            Appointment savedAppointment = appointmentService.addAppointment(appointment);
            return new ResponseEntity<>(savedAppointment, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.CONFLICT);
        }
    }
 
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<Appointment>> getAppointmentsForUser(@PathVariable int userId) {
        List<Appointment> appointments = appointmentService.getAppointmentsByUserId(userId);
        return ResponseEntity.ok(appointments);
    }
 
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        List<Appointment> appointments = appointmentService.getAllAppointments();
        return ResponseEntity.ok(appointments);
    }
 
    @PutMapping("/{appointmentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Appointment> updateAppointment(
            @PathVariable Long appointmentId, 
            @RequestBody Appointment appointmentDetails) {
                
        try {
            Appointment updatedAppointment = appointmentService.updateAppointment(appointmentId, appointmentDetails);
            return ResponseEntity.ok(updatedAppointment);
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }
 
    @DeleteMapping("/{appointmentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long appointmentId) {
        
        Optional<Appointment> appointment = appointmentService.getAppointmentById(appointmentId);
 
        if (appointment.isPresent()) {
            appointmentService.deleteAppointment(appointmentId);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
 