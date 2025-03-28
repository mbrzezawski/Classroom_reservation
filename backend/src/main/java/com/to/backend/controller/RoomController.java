package com.to.backend.controller;

import com.to.backend.model.Room;
import com.to.backend.repository.RoomRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rooms")
public class RoomController {

    private final RoomRepository repo;

    public RoomController(RoomRepository repo) {
        this.repo = repo;
    }

    @PostMapping("/create")
    public ResponseEntity<Room> createRoom(@RequestBody Room room) {
        return ResponseEntity.ok(repo.save(room));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Room>> getAllRooms() {
        return ResponseEntity.ok(repo.findAll());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteRoom(@PathVariable String id) {
        repo.deleteById(id);
        return ResponseEntity.ok("Sala usunięta");
    }
}
