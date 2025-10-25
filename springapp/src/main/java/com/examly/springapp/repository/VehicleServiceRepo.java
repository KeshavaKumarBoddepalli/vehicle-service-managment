package com.examly.springapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.examly.springapp.model.VehicleMaintenance;

public interface VehicleServiceRepo extends JpaRepository<VehicleMaintenance , Long>{

    
} 
