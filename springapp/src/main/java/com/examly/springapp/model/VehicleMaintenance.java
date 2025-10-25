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

    
    public VehicleMaintenance() {
    }


    public VehicleMaintenance(long serviceId, String serviceName, int servicePrice, String typeOfVehicle) {
        this.serviceId = serviceId;
        this.serviceName = serviceName;
        this.servicePrice = servicePrice;
        this.typeOfVehicle = typeOfVehicle;
    }


    public long getServiceId() {
        return serviceId;
    }


    public void setServiceId(long serviceId) {
        this.serviceId = serviceId;
    }


    public String getServiceName() {
        return serviceName;
    }


    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }


    public int getServicePrice() {
        return servicePrice;
    }


    public void setServicePrice(int servicePrice) {
        this.servicePrice = servicePrice;
    }


    public String getTypeOfVehicle() {
        return typeOfVehicle;
    }


    public void setTypeOfVehicle(String typeOfVehicle) {
        this.typeOfVehicle = typeOfVehicle;
    }

}
