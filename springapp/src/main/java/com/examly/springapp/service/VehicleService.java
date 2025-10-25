package com.examly.springapp.service;

import java.util.List;

import com.examly.springapp.model.VehicleMaintenance;

public interface VehicleService {
    VehicleMaintenance addService(VehicleMaintenance service);
    VehicleMaintenance updateService(Long serviceId);
    void deleteService(Long serviceId);
    List <VehicleMaintenance> getAllServices();
    VehicleMaintenance getServiceById(Long serviceId);

    

}
