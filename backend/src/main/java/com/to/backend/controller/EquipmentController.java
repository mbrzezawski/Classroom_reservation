package com.to.backend.controller;

import com.to.backend.model.Equipment;
import com.to.backend.service.EquipmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/equipment")
@PreAuthorize("isAuthenticated()")
public class EquipmentController {
    private final EquipmentService service;

    public EquipmentController(EquipmentService service) {
        this.service = service;
    }

    // POST /equipment – creates new equipment, returns 201 + Location
    // FOR: ADMIN and DEANS_OFFICE
    @PostMapping
    @PreAuthorize(
            "hasAnyRole(" +
                    "T(com.to.backend.model.utils.RoleType).ADMIN.name(), " +
                    "T(com.to.backend.model.utils.RoleType).DEANS_OFFICE.name()" +
                    ")"
    )
    public ResponseEntity<Equipment> create(@RequestBody Equipment e) {
        Equipment saved = service.create(e);
        URI location = URI.create("/equipment/" + saved.getId());
        return ResponseEntity.created(location).body(saved);
    }

    // GET /equipment – retrieves all equipment
    @GetMapping
    public ResponseEntity<List<Equipment>> list() {
        return ResponseEntity.ok(service.findAll());
    }

    // GET /equipment/{id} – retrieves equipment by id or 404
    @GetMapping("/{id}")
    public ResponseEntity<Equipment> get(@PathVariable String id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // DELETE /equipment/{id} – deletes equipment by id, returns 204 or 404
    // FOR: ADMIN and DEANS_OFFICE
    @DeleteMapping("/{id}")
    @PreAuthorize(
            "hasAnyRole(" +
                    "T(com.to.backend.model.utils.RoleType).ADMIN.name(), " +
                    "T(com.to.backend.model.utils.RoleType).DEANS_OFFICE.name()" +
                    ")"
    )
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (service.findById(id).isPresent()) {
            service.delete(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
