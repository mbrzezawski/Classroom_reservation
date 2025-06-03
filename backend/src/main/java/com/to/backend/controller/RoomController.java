package com.to.backend.controller;

import com.to.backend.model.Room;
import com.to.backend.service.RoomService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/rooms")
@CrossOrigin(origins = "http://localhost:5137")
@PreAuthorize("isAuthenticated()")
public class RoomController {

    private final RoomService service;

    public RoomController(RoomService service) {
        this.service = service;
    }

    // POST / – creates new room, returns 201 + Location
    // FOR: ADMIN AND DEANS_OFFICE
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','DEANS_OFFICE')")
    public ResponseEntity<Room> createRoom(@RequestBody Room room) {
        Room saved = service.createRoom(room);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(saved.getId())
                .toUri();
        return ResponseEntity.created(location).body(saved);
    }

    // GET /rooms – retrieves all rooms
    // FOR: EVERYONE LOGGED IN
    @GetMapping
//    @PreAuthorize(
//            "hasAnyRole(" +
//                    "T(com.to.backend.model.utils.RoleType).ADMIN.name(), " +
//                    "T(com.to.backend.model.utils.RoleType).TEACHER.name(), " +
//                    "T(com.to.backend.model.utils.RoleType).STUDENT.name(), " +
//                    "T(com.to.backend.model.utils.RoleType).DEANS_OFFICE.name()" +
//                    ")"
//    )
    public ResponseEntity<List<Room>> getAllRooms() {
        return ResponseEntity.ok(service.getAllRooms());
    }

    // GET /rooms/{id} – retrieves room by id or returns 404
    // FOR: EVERYONE LOGGED IN
    @GetMapping("/{id}")
//    @PreAuthorize(
//            "hasAnyRole(" +
//                    "T(com.to.backend.model.utils.RoleType).ADMIN.name(), " +
//                    "T(com.to.backend.model.utils.RoleType).TEACHER.name(), " +
//                    "T(com.to.backend.model.utils.RoleType).STUDENT.name(), " +
//                    "T(com.to.backend.model.utils.RoleType).DEANS_OFFICE.name()" +
//                    ")"
//    )
    public ResponseEntity<Room> getRoomById(@PathVariable String id) {
        Room room = service.getRoomById(id);
        return ResponseEntity.ok(room);
    }

    // DELETE /rooms/{id} – deletes room by id, returns 204 or 404
    // FOR: ADMIN AND DEANS_OFFICE
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAnyRole('ADMIN','DEANS_OFFICE')")
    public void deleteRoom(@PathVariable String id) {
        service.deleteRoom(id);
    }

    // PUT /rooms/{id} - update a room,
    // FOR: admin and deans_office
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','DEANS_OFFICE')")
    public ResponseEntity<Room> updateRoom(
            @PathVariable String id,
            @RequestBody Room room
    ) {
        Room updated = service.updateRoom(id, room);
        return ResponseEntity.ok(updated);
    }

}
