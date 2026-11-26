
package com.queue.manager.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(
    name = "appointments",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_appointment_slot",
            columnNames = {"appointment_date", "appointment_time"}
        )
    }
)
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String patientName;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String service;

    @Column(name = "appointment_date", nullable = false)
    private LocalDate appointmentDate;

    @Column(name = "appointment_time", nullable = false)
    private LocalTime appointmentTime;

    @Column(nullable = false)
    private String token;

    @Column(nullable = false)
    private String status = "WAITING";

    @Column(nullable = false)
    private boolean priority = false;

    @Column(nullable = false)
    private int estimatedMinutes = 15;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() { return id; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String value) { patientName = value; }

    public String getPhone() { return phone; }
    public void setPhone(String value) { phone = value; }

    public String getService() { return service; }
    public void setService(String value) { service = value; }

    public LocalDate getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(LocalDate value) {
        appointmentDate = value;
    }

    public LocalTime getAppointmentTime() { return appointmentTime; }
    public void setAppointmentTime(LocalTime value) {
        appointmentTime = value;
    }

    public String getToken() { return token; }
    public void setToken(String value) { token = value; }

    public String getStatus() { return status; }
    public void setStatus(String value) { status = value; }

    public boolean isPriority() { return priority; }
    public void setPriority(boolean value) { priority = value; }

    public int getEstimatedMinutes() { return estimatedMinutes; }
    public void setEstimatedMinutes(int value) {
        estimatedMinutes = value;
    }

    public LocalDateTime getCreatedAt() { return createdAt; }
}
