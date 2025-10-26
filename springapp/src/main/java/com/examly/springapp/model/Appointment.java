package com.examly.springapp.model;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Appointment {

    @Id
    @GeneratedValue
    private Long appointmentId;

    @ManyToOne
    @JoinColumn(name = "serviceId")
    private VehicleMaintenance service;

    private LocalDate appointmentDate;

    private String loaction;

    private String status;

    @ManyToOne
    @JoinColumn(name = "userId")
    private User user;

    public Appointment() {
    }

    public Appointment(Long appointmentId, VehicleMaintenance service, LocalDate appointmentDate, String loaction,
             User user) {
        this.appointmentId = appointmentId;
        this.service = service;
        this.appointmentDate = appointmentDate;
        this.loaction = loaction;
        this.status = "Pending";
        this.user = user;
    }

    public Long getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(Long appointmentId) {
        this.appointmentId = appointmentId;
    }

    public VehicleMaintenance getService() {
        return service;
    }

    public void setService(VehicleMaintenance service) {
        this.service = service;
    }

    public LocalDate getApponitmentDate() {
        return appointmentDate;
    }

    public void setApponitmentDate(LocalDate apponitmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public String getLoaction() {
        return loaction;
    }

    public void setLoaction(String loaction) {
        this.loaction = loaction;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    



    
}
