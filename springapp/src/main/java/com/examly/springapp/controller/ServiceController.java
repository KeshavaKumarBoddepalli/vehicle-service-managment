package com.examly.springapp.controller;

import com.examly.springapp.model.VehicleMaintenance;
import com.examly.springapp.service.VehicleService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/services")
public class ServiceController {

    @Autowired
    private VehicleService vehicleService;

    
    @PostMapping
    public ResponseEntity<VehicleMaintenance> addService(@RequestBody VehicleMaintenance service) {
        VehicleMaintenance created = vehicleService.addService(service);
        if (created == null) {
            return ResponseEntity.status(403).build(); 
        }
        return ResponseEntity.status(201).body(created);
    }

 
    @GetMapping
    public ResponseEntity<List<VehicleMaintenance>> getAllServices() {
        List<VehicleMaintenance> services = vehicleService.getAllServices();
        if (services.isEmpty()) {
            return ResponseEntity.status(403).build();      
        }
        return ResponseEntity.ok(services);
    }

    @GetMapping("/name")
    public ResponseEntity<?> getServiceByName(@RequestParam String serviceName) {
        try {
            List<VehicleMaintenance> services = vehicleService.findByServiceName(serviceName);
            if (services.isEmpty()) {
                return ResponseEntity.status(404).build();
            }
            return ResponseEntity.ok(services); 
        } catch (Exception e) {
            return ResponseEntity.status(403).build();
        }
    }

   
    @PutMapping("/{id}")
    public ResponseEntity<?> updateService(@PathVariable Long id, @RequestBody VehicleMaintenance service) {
        try {
            VehicleMaintenance updated = vehicleService.updateService(id, service);
            if (updated == null) {
                return ResponseEntity.status(404).build();
            }
            return ResponseEntity.ok(updated); 
        } catch (Exception e) {
            return ResponseEntity.status(403).build();
        }
    }

    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteService(@PathVariable Long id) {
        try {
            Optional<VehicleMaintenance> serviceOpt = vehicleService.getServiceById(id);
            if (serviceOpt.isEmpty()) {
                return ResponseEntity.status(404).build();
            }
            vehicleService.deleteService(id);
            return ResponseEntity.noContent().build(); 
        } catch (Exception e) {
            return ResponseEntity.status(403).build();
        }
    }

   
    @GetMapping("/{id}")
    public ResponseEntity<?> getServiceById(@PathVariable Long id) {
        Optional<VehicleMaintenance> found = vehicleService.getServiceById(id);
        if (found.isEmpty()) {
            return ResponseEntity.status(404).build();
        }
        return ResponseEntity.status(200).body(found);
    }

}



