package com.to.backend.integration;

import com.to.backend.model.User;
import com.to.backend.model.utils.RoleType;
import com.to.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(
        properties = {
                "app.base-url=http://localhost",
                "spring.mail.host=dummy"
        }
)
@AutoConfigureMockMvc
class AuthSessionIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @MockitoBean
    private JavaMailSender mailSender;

    @BeforeEach
    void setUp() {
        userRepo.deleteAll();

        User user = new User();
        user.setEmail("test@student.agh.edu.pl");
        user.setPassword(passwordEncoder.encode("Password123"));
        user.setRole(RoleType.STUDENT);
        user.setEnabled(true);
        userRepo.save(user);
    }

    // poprawny login
    @Test
    void login_withValidCredentials_returns200() throws Exception {
        mockMvc.perform(
                        post("/auth/login")
                                .contentType("application/json")
                                .content("""
                    {
                        "email": "test@student.agh.edu.pl",
                        "password": "Password123"
                    }
                """)
                )
                .andExpect(status().isOk());
    }



    // złe hasło
    @Test
    void login_withInvalidPassword_returns401() throws Exception {
        mockMvc.perform(
                        post("/auth/login")
                                .contentType("application/json")
                                .content("""
                    {
                        "email": "test@student.agh.edu.pl",
                        "password": "WrongPassword"
                    }
                """)
                )
                .andExpect(status().isUnauthorized());
    }


    @Test
    void login_whenUserDisabled_returns401() throws Exception {
        User u = userRepo.findByEmail("test@student.agh.edu.pl").get();
        u.setEnabled(false);
        userRepo.save(u);

        mockMvc.perform(
                        post("/auth/login")
                                .contentType("application/json")
                                .content("""
                    {
                        "email": "test@student.agh.edu.pl",
                        "password": "Password123"
                    }
                """)
                )
                .andExpect(status().isUnauthorized());
    }

}