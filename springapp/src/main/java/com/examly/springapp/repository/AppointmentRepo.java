package com.examly.springapp.repository;
 
import java.util.List;
 
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
// import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.examly.springapp.model.Appointment;

// import jakarta.transaction.Transactional;
 
@Repository
public interface AppointmentRepo extends JpaRepository<Appointment, Long> {
    List<Appointment> findByUserUserId(long userId);

// @Modifying
// @Transactional
// @Query("DELETE FROM Appointment a WHERE a.vehicleMaintenance.serviceId = :serviceId")
// void deleteByServiceId(@Param("serviceId") Long serviceId);

@Modifying
@Transactional
@Query("DELETE FROM Appointment a WHERE a.service.serviceId = :serviceId")
void deleteByServiceId(@Param("serviceId") Long serviceId);


}