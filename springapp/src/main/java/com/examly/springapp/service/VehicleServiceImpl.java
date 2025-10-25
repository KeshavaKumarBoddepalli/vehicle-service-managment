package com.examly.springapp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.examly.springapp.model.VehicleMaintenance;
import com.examly.springapp.repository.VehicleServiceRepo;

public class VehicleServiceImpl implements VehicleService{

    @Autowired
    private VehicleServiceRepo vrepo;

    @Override
    public VehicleMaintenance addService(VehicleMaintenance service) {
       return vrepo.save(service);
    }

    @Override
    public void deleteService(Long serviceId) {
        VehicleMaintenance found= vrepo.findById(serviceId).orElse(null);
    }

    @Override
    public List<VehicleMaintenance> getAllServices() {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public VehicleMaintenance getServiceById(Long serviceId) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public VehicleMaintenance updateService(Long serviceId) {
        // TODO Auto-generated method stub
        return null;
    }
    

}
