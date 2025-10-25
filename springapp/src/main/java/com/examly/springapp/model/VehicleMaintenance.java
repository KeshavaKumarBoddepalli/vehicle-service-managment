package com.examly.springapp.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class VehicleMaintenance {
    @Id
    @GeneratedValue
    long serviceId;
    String serviceName;
    int servicePrice;
    String typeOfVehicle;
}
