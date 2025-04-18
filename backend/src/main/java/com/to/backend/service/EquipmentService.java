package com.to.backend.service;

import com.to.backend.model.Equipment;
import com.to.backend.repository.EquipmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EquipmentService {
    private final EquipmentRepository repo;
    public EquipmentService(EquipmentRepository repo) { this.repo = repo; }

    public Equipment create(Equipment e) { return repo.save(e); }

    public List<Equipment> findAll() { return repo.findAll(); }

    public Optional<Equipment> findById(String id) { return repo.findById(id); }

    public void delete(String id) { repo.deleteById(id); }
}
