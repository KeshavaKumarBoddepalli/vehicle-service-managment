
// package com.examly.springapp.config;

// import com.examly.springapp.model.Appointment;
// import com.examly.springapp.model.User;
// import com.examly.springapp.repository.AppointmentRepo;
// import com.examly.springapp.repository.UserRepo;
// import jakarta.annotation.PostConstruct;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Component;

// import java.time.LocalDate;

// @Component
// public class TestDataInitializer {

//     @Autowired
//     private AppointmentRepo appointmentRepo;

//     @Autowired
//     private UserRepo userRepo;

//     @PostConstruct
//     public void init() {
//         // Create user with ID 2
//         User user = new User();
//         user.setUserId(2);
//         user.setUsername("Test User");
//         user.setEmail("testuser@example.com");
//         user.setPassword("password");
//         user.setUserRole("USER");
//         userRepo.save(user);

//         // Create appointment with expected values
//         Appointment appointment = new Appointment();
//         appointment.setStatus("Pending");
//         appointment.setLocation("Los Angeles");
//         appointment.setAppointmentDate(LocalDate.now().plusDays(1));
//         appointment.setService(null);
//         appointment.setUser(user);

//         appointmentRepo.save(appointment);
//     }
// }
