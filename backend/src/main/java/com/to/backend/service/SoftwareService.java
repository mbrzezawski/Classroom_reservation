package com.to.backend.service;

import com.to.backend.model.Software;
import com.to.backend.repository.SoftwareRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SoftwareService {
    private final SoftwareRepository repo;
    public SoftwareService(SoftwareRepository repo) { this.repo = repo; }

    public Software create(Software s) { return repo.save(s); }

    public List<Software> findAll() { return repo.findAll(); }

    public Optional<Software> findById(String id) { return repo.findById(id); }

    public void delete(String id) { repo.deleteById(id); }
}
