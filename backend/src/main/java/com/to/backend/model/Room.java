package com.to.backend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "rooms")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Room {
    @Id
    private String id;

    private String name;
    private int capacity;
    private List<String> softwareIds;
    private List<String> equipmentIds;
    private String location;
}
