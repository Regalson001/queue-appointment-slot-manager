
package com.queue.manager.service;

import com.queue.manager.model.Appointment;
import com.queue.manager.repository.AppointmentRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
public class AppointmentService {

    private final AppointmentRepository repository;

    public AppointmentService(AppointmentRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public Appointment book(Appointment appointment) {

        if (appointment.getPatientName() == null ||
            appointment.getPatientName().isBlank()) {
            throw new IllegalArgumentException("Patient name is required.");
        }

        if (appointment.getPhone() == null ||
            appointment.getPhone().isBlank()) {
            throw new IllegalArgumentException("Phone number is required.");
        }

        if (appointment.getService() == null ||
            appointment.getService().isBlank()) {
            throw new IllegalArgumentException("Service is required.");
        }

        LocalDate date = appointment.getAppointmentDate();
        LocalTime time = appointment.getAppointmentTime();

        if (date == null || time == null) {
            throw new IllegalArgumentException("Date and time are required.");
        }

        if (date.isBefore(LocalDate.now()) ||
            (date.equals(LocalDate.now()) && time.isBefore(LocalTime.now()))) {
            throw new IllegalArgumentException(
                "Appointments must be scheduled in the future."
            );
        }

        if (time.getMinute() % 15 != 0 || time.getSecond() != 0) {
            throw new IllegalArgumentException(
                "Appointments must start on 15-minute intervals."
            );
        }

        if (time.isBefore(LocalTime.of(8, 0)) ||
            !time.isBefore(LocalTime.of(17, 0))) {
            throw new IllegalArgumentException(
                "Appointments must be between 08:00 and 17:00."
            );
        }

        if (repository.existsByAppointmentDateAndAppointmentTime(date, time)) {
            throw new IllegalArgumentException(
                "This appointment slot is already booked."
            );
        }

        appointment.setToken(
            "Q-" + UUID.randomUUID().toString()
                .substring(0, 6).toUpperCase()
        );

        appointment.setStatus("WAITING");
        appointment.setEstimatedMinutes(15);

        try {
            return repository.saveAndFlush(appointment);
        } catch (DataIntegrityViolationException exception) {
            throw new IllegalArgumentException(
                "This slot has just been booked by another customer."
            );
        }
    }

    public List<Appointment> getTodayQueue() {

        return repository
            .findByAppointmentDateOrderByPriorityDescCreatedAtAsc(
                LocalDate.now()
            )
            .stream()
            .filter(a -> !a.getStatus().equals("CANCELLED"))
            .sorted(
                Comparator
                    .comparing(Appointment::isPriority).reversed()
                    .thenComparing(Appointment::getCreatedAt)
            )
            .toList();
    }

    public List<Appointment> getAll() {
        return repository.findAll();
    }

    @Transactional
    public Appointment updateStatus(Long id, String status) {

        Appointment appointment = repository.findById(id)
            .orElseThrow(() ->
                new IllegalArgumentException("Appointment not found.")
            );

        List<String> allowed = List.of(
            "WAITING", "SERVING", "COMPLETED",
            "CANCELLED", "MISSED"
        );

        if (!allowed.contains(status)) {
            throw new IllegalArgumentException("Invalid appointment status.");
        }

        if (appointment.getStatus().equals("COMPLETED") ||
            appointment.getStatus().equals("CANCELLED") ||
            appointment.getStatus().equals("MISSED")) {
            throw new IllegalArgumentException(
                "This appointment is already in a final state."
            );
        }

        if (status.equals("SERVING") &&
            repository.findByStatus("SERVING").stream()
                .anyMatch(a -> !a.getId().equals(id))) {
            throw new IllegalArgumentException(
                "Another appointment is already being served."
            );
        }

        appointment.setStatus(status);
        return repository.save(appointment);
    }

    @Transactional
    public Appointment setPriority(Long id, boolean priority) {

        Appointment appointment = repository.findById(id)
            .orElseThrow(() ->
                new IllegalArgumentException("Appointment not found.")
            );

        if (!appointment.getStatus().equals("WAITING")) {
            throw new IllegalArgumentException(
                "Only waiting appointments can change priority."
            );
        }

        appointment.setPriority(priority);
        return repository.save(appointment);
    }
}
