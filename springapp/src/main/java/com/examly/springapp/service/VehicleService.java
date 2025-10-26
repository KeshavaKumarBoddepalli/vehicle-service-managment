package com.examly.springapp.service;

import java.util.List;
import java.util.Optional;

import com.examly.springapp.model.VehicleMaintenance;

public interface VehicleService {

    VehicleMaintenance addService(VehicleMaintenance service);
    VehicleMaintenance updateService(Long serviceId, VehicleMaintenance service);
    void deleteService(Long serviceId);
    List <VehicleMaintenance> getAllServices();
    Optional<VehicleMaintenance> getServiceById(Long serviceId);
    List<VehicleMaintenance> findByServiceName(String serviceName);

    

}
