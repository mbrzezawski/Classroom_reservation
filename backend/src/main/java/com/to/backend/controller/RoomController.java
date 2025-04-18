package com.to.backend.controller;

import com.to.backend.model.Room;
import com.to.backend.service.RoomService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/rooms")
public class RoomController {

    private final RoomService service;

    public RoomController(RoomService service) {
        this.service = service;
    }

    // POST / – creates new room, returns 201 + Location
    @PostMapping
    public ResponseEntity<Room> createRoom(@RequestBody Room room) {
        Room saved = service.create(room);
        URI location = URI.create("/rooms/" + saved.getId());
        return ResponseEntity.created(location).body(saved);
    }

    // GET /rooms – retrieves all rooms
    @GetMapping
    public ResponseEntity<List<Room>> getAllRooms() {
        return ResponseEntity.ok(service.findAll());
    }

    // GET /rooms/{id} – retrieves room by id or returns 404
    @GetMapping("/{id}")
    public ResponseEntity<Room> getRoomById(@PathVariable String id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // DELETE /rooms/{id} – deletes room by id, returns 204 or 404
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable String id) {
        if (service.findById(id).isPresent()) {
            service.delete(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
