package com.examly.springapp.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.examly.springapp.model.VehicleMaintenance;
import com.examly.springapp.repository.AppointmentRepo;
import com.examly.springapp.repository.VehicleServiceRepo;


@Service
public class VehicleServiceImpl implements VehicleService{

    @Autowired
    private VehicleServiceRepo vrepo;

    @Autowired
    private AppointmentRepo appointmentRepo;

    @Override
    public VehicleMaintenance addService(VehicleMaintenance service) {
       return vrepo.save(service);
    }
    
    @Transactional
    @Override
    public void deleteService(Long serviceId) {
        // Step 1: Delete all appointments linked to this service
        appointmentRepo.deleteByServiceId(serviceId);
    
        // Step 2: Delete the service itself
        VehicleMaintenance found = vrepo.findById(serviceId).orElse(null);
        if (found != null) {
            vrepo.delete(found);
        }
    }


    @Override
    public List<VehicleMaintenance> getAllServices() {
        return vrepo.findAll();
    }

    @Override
    public Optional<VehicleMaintenance> getServiceById(Long serviceId) {
        return vrepo.findById(serviceId);
    }
 
    @Override
    public VehicleMaintenance updateService(Long serviceId , VehicleMaintenance service) {
        VehicleMaintenance found=vrepo.findById(serviceId).orElse(null);
        if(found!=null)
        {           
            found.setServiceName(service.getServiceName());
            found.setServicePrice(service.getServicePrice());
            found.setTypeOfVehicle(service.getTypeOfVehicle());
            return vrepo.save(found);
        }
        return null;
    }

    
    @Override
    public List<VehicleMaintenance> findByServiceName(String serviceName) {
        return vrepo.findByServiceName(serviceName);
    }

}
