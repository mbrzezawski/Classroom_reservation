package com.to.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.TimeZone;

// do testowania lokalnego wyłączam logowanie do serwera
@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
@RestController
@EnableMethodSecurity
public class ClassroomApplication {

    public static void main(String[] args) {
        TimeZone.setDefault(TimeZone.getTimeZone("GMT+02:00"));
        SpringApplication.run(ClassroomApplication.class, args);
    }

    @GetMapping("/hello")
    public String sayHello() {
        return String.format("Hello World!");
    }

}
