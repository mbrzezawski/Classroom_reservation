package com.to.backend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "software")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Software {
    @Id
    private String id;

    private String name;
}
