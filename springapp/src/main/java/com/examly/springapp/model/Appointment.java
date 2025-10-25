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
private LocalDate appointmentDate;
private String location;
private String status;

@ManyToOne
@JoinColumn(name="serviceId")
private VehicleMaintenance service;

@ManyToOne
@JoinColumn(name="userId")
private User user;

public Appointment() {
}

public Appointment(Long appointmentId, LocalDate appointmentDate, String location, String status,
        VehicleMaintenance service, User user) {
    this.appointmentId = appointmentId;
    this.appointmentDate = appointmentDate;
    this.location = location;
    this.status = status;
    this.service = service;
    this.user = user;
}

public Long getAppointmentId() {
    return appointmentId;
}

public void setAppointmentId(Long appointmentId) {
    this.appointmentId = appointmentId;
}

public LocalDate getAppointmentDate() {
    return appointmentDate;
}

public void setAppointmentDate(LocalDate appointmentDate) {
    this.appointmentDate = appointmentDate;
}

public String getLocation() {
    return location;
}

public void setLocation(String location) {
    this.location = location;
}

public String getStatus() {
    return status;
}

public void setStatus(String status) {
    this.status = status;
}

public VehicleMaintenance getService() {
    return service;
}

public void setService(VehicleMaintenance service) {
    this.service = service;
}

public User getUser() {
    return user;
}

public void setUser(User user) {
    this.user = user;
}



    
}
