package com.to.backend.controller;

import com.to.backend.model.Software;
import com.to.backend.service.SoftwareService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/software")
//@PreAuthorize("isAuthenticated()")
public class SoftwareController {
    private final SoftwareService service;

    public SoftwareController(SoftwareService service) {
        this.service = service;
    }

    // POST /software – creates new software, returns 201 + Location
    // FOR: ADMIN and DEANS_OFFICE
    @PostMapping
//    @PreAuthorize(
//            "hasAnyRole(" +
//                    "T(com.to.backend.model.utils.RoleType).ADMIN.name(), " +
//                    "T(com.to.backend.model.utils.RoleType).DEANS_OFFICE.name()" +
//                    ")"
//    )
    public ResponseEntity<Software> create(@RequestBody Software s) {
        Software saved = service.create(s);
        URI location = URI.create("/software/" + saved.getId());
        return ResponseEntity.created(location).body(saved);
    }

    // GET /software – retrieves all software entries
    @GetMapping
    public ResponseEntity<List<Software>> list() {
        return ResponseEntity.ok(service.findAll());
    }

    // GET /software/{id} – retrieves software by id or 404
    @GetMapping("/{id}")
    public ResponseEntity<Software> get(@PathVariable String id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // DELETE /software/{id} – deletes software by id, returns 204 or 404
    // FOR: ADMIN and DEANS_OFFICE
    @DeleteMapping("/{id}")
//    @PreAuthorize(
//            "hasAnyRole(" +
//                    "T(com.to.backend.model.utils.RoleType).ADMIN.name(), " +
//                    "T(com.to.backend.model.utils.RoleType).DEANS_OFFICE.name()" +
//                    ")"
//    )
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (service.findById(id).isPresent()) {
            service.delete(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
