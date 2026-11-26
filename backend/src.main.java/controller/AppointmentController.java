
package com.queue.manager.controller;

import com.queue.manager.model.Appointment;
import com.queue.manager.service.AppointmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class AppointmentController {

    private final AppointmentService service;

    public AppointmentController(AppointmentService service) {
        this.service = service;
    }

    @PostMapping("/appointments")
    public ResponseEntity<?> book(@RequestBody Appointment appointment) {
        try {
            return ResponseEntity.ok(service.book(appointment));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                Map.of("error", e.getMessage())
            );
        }
    }

    @GetMapping("/appointments")
    public ResponseEntity<?> getAppointments() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/queue/board")
    public ResponseEntity<?> getQueue() {
        return ResponseEntity.ok(service.getTodayQueue());
    }

    @PatchMapping("/appointments/{id}/status")
    public ResponseEntity<?> updateStatus(
        @PathVariable Long id,
        @RequestBody Map<String, String> body
    ) {
        try {
            return ResponseEntity.ok(
                service.updateStatus(id, body.get("status"))
            );
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                Map.of("error", e.getMessage())
            );
        }
    }

    @PatchMapping("/appointments/{id}/priority")
    public ResponseEntity<?> updatePriority(
        @PathVariable Long id,
        @RequestBody Map<String, Boolean> body
    ) {
        try {
            return ResponseEntity.ok(
                service.setPriority(id, body.get("priority"))
            );
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                Map.of("error", e.getMessage())
            );
        }
    }
}
