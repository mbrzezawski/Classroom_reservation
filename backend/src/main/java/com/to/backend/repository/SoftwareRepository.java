package com.to.backend.repository;

import com.to.backend.model.Software;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SoftwareRepository extends MongoRepository<Software, String> {
}
