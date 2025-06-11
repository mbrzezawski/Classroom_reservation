package com.to.backend.model;

import com.to.backend.model.utils.RoleType;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    private String id;

    private String name;
    private String surname;
    private String email;
    private String password;
    private RoleType role;
    private Boolean enabled;

    public boolean isEnabled() {
        return Boolean.TRUE.equals(enabled);
    }
}
