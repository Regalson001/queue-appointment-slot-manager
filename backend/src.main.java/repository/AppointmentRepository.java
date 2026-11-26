
package com.queue.manager.repository;

import com.queue.manager.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface AppointmentRepository
        extends JpaRepository<Appointment, Long> {

    boolean existsByAppointmentDateAndAppointmentTime(
        LocalDate date, LocalTime time
    );

    List<Appointment> findByAppointmentDateOrderByPriorityDescCreatedAtAsc(
        LocalDate date
    );

    List<Appointment> findByStatus(String status);
}
