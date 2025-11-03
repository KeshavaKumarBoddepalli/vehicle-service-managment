package com.examly.springapp.service;
 
import com.examly.springapp.model.Appointment;
import com.examly.springapp.model.User;
import com.examly.springapp.model.VehicleMaintenance;
import com.examly.springapp.repository.AppointmentRepo;
import com.examly.springapp.repository.UserRepo;
import com.examly.springapp.repository.VehicleServiceRepo;
 
// *** IMPORT THESE ***
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.access.AccessDeniedException; // Use standard exception
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Objects; // For safe ID comparison
import java.util.Optional;
 
@Service
public class AppointmentServiceImpl implements AppointmentService {
 
    private final AppointmentRepo appointmentRepo;
    private final UserRepo userRepo;
    private final VehicleServiceRepo vehicleServiceRepo;
 
    public AppointmentServiceImpl(AppointmentRepo appointmentRepo, UserRepo userRepo,
                                   VehicleServiceRepo vehicleServiceRepo) {
        this.appointmentRepo = appointmentRepo;
        this.userRepo = userRepo;
        this.vehicleServiceRepo = vehicleServiceRepo;
    }
 
    // --- *** NEW: HELPER TO GET LOGGED-IN USER *** ---
    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("User is not authenticated");
        }
        String currentUsername = authentication.getName();

        User user = userRepo.findByUsername(currentUsername);
if (user == null) {
    throw new jakarta.persistence.EntityNotFoundException("User not found: " + currentUsername);
}
  return user;
    }
 
    // --- *** NEW: HELPER TO FIND APPOINTMENT *** ---
    private Appointment findAppointmentById(Long appointmentId) {
         return appointmentRepo.findById(appointmentId)
            .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Appointment not found: " + appointmentId));
    }
 
    @Override
    public Appointment addAppointment(Appointment appointment) {
        // ... (Your existing add logic is fine) ...
        // Note: It's safer to get the user from getAuthenticatedUser()
        // than to trust the appointment object, but this works for now.
        
        Integer userId = appointment.getUser().getUserId();
        Long serviceId = appointment.getService().getServiceId();
 
        User user = userRepo.findById(userId).orElseThrow(() ->
            new IllegalArgumentException("User not found in DB"));
 
        VehicleMaintenance service = vehicleServiceRepo.findById(serviceId).orElseThrow(() ->
            new IllegalArgumentException("Service not found in DB"));
 
        appointment.setUser(user);
        appointment.setService(service);
 
        return appointmentRepo.save(appointment);
    }
 
    @Override
    public void deleteAppointment(Long appointmentId) {
        // This is an ADMIN-only action.
        appointmentRepo.deleteById(appointmentId);
    }
    
    // ... (getAppointmentById, getAllAppointments, getAppointmentsByUserId are fine) ...
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
 
 
    // --- *** MODIFIED: updateAppointment (FOR USER EDIT) *** ---
    @Override
    public Appointment updateAppointment(Long appointmentId, Appointment updateRequest) {
        
        User currentUser = getAuthenticatedUser();
        Appointment existingAppointment = findAppointmentById(appointmentId);
 
        // --- *** SECURITY CHECK 1: IS THIS THE USER'S APPOINTMENT? *** ---
        boolean isAdmin = "ADMIN".equals(currentUser.getUserRole());
        
        if (!isAdmin && !Objects.equals(existingAppointment.getUser().getUserId(), currentUser.getUserId())) {
            throw new AccessDeniedException("You are not authorized to update this appointment.");
        }
 
        // --- BUSINESS LOGIC: Users can only edit 'Pending' appointments ---
        if (!isAdmin && !"Pending".equalsIgnoreCase(existingAppointment.getStatus())) {
            throw new IllegalStateException("Only 'Pending' appointments can be edited.");
        }
        
        // --- LOGIC FOR PARTIAL UPDATE ---
        // User/Admin can update date/location
        if (updateRequest.getAppointmentDate() != null) {
            existingAppointment.setAppointmentDate(updateRequest.getAppointmentDate());
        }
        if (updateRequest.getLocation() != null) {
            existingAppointment.setLocation(updateRequest.getLocation());
        }
 
        // --- SECURITY: PREVENT USER FROM CHANGING OTHER FIELDS ---
        // Only Admins can change status, user, or service via this endpoint
        if (isAdmin) {
            if (updateRequest.getService() != null) {
                existingAppointment.setService(updateRequest.getService());
            }
            if (updateRequest.getStatus() != null) {
                existingAppointment.setStatus(updateRequest.getStatus());
            }
            if (updateRequest.getUser() != null) {
                existingAppointment.setUser(updateRequest.getUser());
            }
        }
 
        return appointmentRepo.save(existingAppointment);
    }
 
    // --- *** MODIFIED: updateAppointmentStatus (FOR USER CANCEL) *** ---
    @Override
    public Appointment updateAppointmentStatus(Long appointmentId, String status) {
        
        User currentUser = getAuthenticatedUser();
        Appointment appointment = findAppointmentById(appointmentId);
 
        // --- *** SECURITY CHECK: IS THIS THE USER'S APPOINTMENT? *** ---
        boolean isAdmin = "ADMIN".equals(currentUser.getUserRole());
        
        if (!isAdmin && !Objects.equals(appointment.getUser().getUserId(), currentUser.getUserId())) {
            throw new AccessDeniedException("You are not authorized to update this appointment.");
        }
 
        // --- BUSINESS LOGIC: ---
        if (isAdmin) {
            // Admin can set any status
            appointment.setStatus(status);
        } else {
            // A regular user can ONLY set the status to "Cancelled"
            if (!"Cancelled".equalsIgnoreCase(status)) {
                throw new AccessDeniedException("You are only authorized to 'Cancel' this appointment.");
            }
            
            // User can cancel 'Pending' or 'Approved' appointments
            if (!"Pending".equalsIgnoreCase(appointment.getStatus()) && !"Approved".equalsIgnoreCase(appointment.getStatus())) {
                 throw new IllegalStateException("Only 'Pending' or 'Approved' appointments can be cancelled.");
            }
            
            appointment.setStatus(status); // Set to "Cancelled"
        }
 
        return appointmentRepo.save(appointment);
    }
}