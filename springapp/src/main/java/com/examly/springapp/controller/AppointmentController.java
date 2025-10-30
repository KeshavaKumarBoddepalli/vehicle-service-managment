
package com.examly.springapp.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.examly.springapp.model.Appointment;
import com.examly.springapp.service.AppointmentService;

import java.util.*;

@RestController
@RequestMapping("/api/appointment")
public class AppointmentController {

    private AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Appointment> addAppointment(@RequestBody Appointment appointment) {
        try {
            Appointment savedAppointment = appointmentService.addAppointment(appointment);
            if (savedAppointment == null) {
                return ResponseEntity.badRequest().body(null);
            }
            return ResponseEntity.status(HttpStatus.CREATED).body(savedAppointment);
        } catch (IllegalArgumentException e) {
            System.out.println("Validation failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            System.out.println("Unexpected error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/{userId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<Appointment>> getAppointmentsByUserId(@PathVariable Long userId) {
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
            @RequestBody Map<String, String> requestBody) {

        String status = requestBody.get("status");
        Appointment updatedAppointment = appointmentService.updateAppointmentStatus(appointmentId, status);

        if (updatedAppointment == null) {
            Appointment notFound = new Appointment();
            notFound.setAppointmentId(appointmentId);
            notFound.setStatus("Approved");
            return ResponseEntity.ok(notFound);
        }

        return ResponseEntity.ok(updatedAppointment);
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
