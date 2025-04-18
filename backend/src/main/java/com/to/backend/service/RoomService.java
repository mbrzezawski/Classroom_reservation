package com.to.backend.service;

import com.to.backend.model.Room;
import com.to.backend.repository.RoomRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoomService {
    private final RoomRepository repo;
    public RoomService(RoomRepository repo) { this.repo = repo; }

    public Room create(Room room) { return repo.save(room); }

    public List<Room> findAll() { return repo.findAll(); }

    public Optional<Room> findById(String id) { return repo.findById(id); }

    public void delete(String id) { repo.deleteById(id); }
}
