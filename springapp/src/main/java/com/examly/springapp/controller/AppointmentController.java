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
 
    // --- *** THIS IS THE FIX (PART 1) *** ---
    // This endpoint is for the USER "Edit" (date/location)
    // It now correctly calls the 'updateAppointment' service method.
    @PutMapping("/{appointmentId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')") // <-- 1. Allow USERs
    public ResponseEntity<Appointment> updateAppointment(
            @PathVariable Long appointmentId,
            @RequestBody Appointment appointment) { // <-- 2. This is a partial body
 
        // --- 3. This is the FIX. Call the correct service method. ---
        Appointment updatedAppointment = appointmentService.updateAppointment(appointmentId, appointment);
 
        if (updatedAppointment == null) {
           return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedAppointment);
    }
    // --- *** THIS IS THE FIX (PART 2) *** ---
    // This new endpoint is for ADMIN "Update Status" and USER "Cancel"
    @PutMapping("/{appointmentId}/status") // <-- 4. Use PUT for status
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Appointment> updateAppointmentStatus(
            @PathVariable Long appointmentId,
            @RequestBody Map<String, String> statusUpdate) {
 
        String status = statusUpdate.get("status");
        if (status == null || status.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
 
        // --- 5. Call the dedicated status service method ---
        Appointment updatedAppointment = appointmentService.updateAppointmentStatus(appointmentId, status);
 
        if (updatedAppointment == null) {
            return ResponseEntity.notFound().build();
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
 