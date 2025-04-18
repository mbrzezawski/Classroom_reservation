package com.to.backend.service;

import com.to.backend.exception.NotFoundException;
import com.to.backend.model.Room;
import com.to.backend.repository.RoomRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomService {
    private final RoomRepository repo;
    public RoomService(RoomRepository repo) { this.repo = repo; }
    public Room createRoom(Room room) {
        return repo.save(room);
    }

    public List<Room> getAllRooms() {
        return repo.findAll();
    }

    public Room getRoomById(String id) {
        return repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Room", id));
    }

    public void deleteRoom(String id) {
        if (!repo.existsById(id)) {
            throw new NotFoundException("Room", id);
        }
        repo.deleteById(id);
    }

    public Room updateRoom(String id, Room newRoom) {
        Room existing = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Room", id));

        existing.setName(newRoom.getName());
        existing.setCapacity(newRoom.getCapacity());
        existing.setSoftwareIds(newRoom.getSoftwareIds());
        existing.setEquipmentIds(newRoom.getEquipmentIds());
        existing.setLocation(newRoom.getLocation());

        return repo.save(existing);
    }}