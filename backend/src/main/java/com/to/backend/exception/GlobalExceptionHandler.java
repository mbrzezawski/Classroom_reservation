package com.to.backend.exception;

import com.to.backend.dto.ReservationResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 404 Not Found
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<Map<String,String>> handleNotFound(NotFoundException ex) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", ex.getMessage()));
    }

    // 409 Conflict
    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<Map<String,String>> handleConflict(ConflictException ex) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(Map.of("error", ex.getMessage()));
    }

    // 400 Bad Request
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<Map<String,Object>> handleValidation(ValidationException ex) {
        return ResponseEntity
                .badRequest()
                .body(Map.of(
                        "error", ex.getMessage(),
                        "details", ex.getErrors()
                ));
    }

    // 409 Conflict - reservation
    @ExceptionHandler(NoRoomAvailableException.class)
    public ResponseEntity<Void> handleNoRoom(NoRoomAvailableException ex) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .build();
    }


    // 500 Internal Server Error
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String,String>> handleOther(RuntimeException ex) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", ex.getMessage()));
    }

    // 403 Forbidden
    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<Map<String,String>> handleForbidden(ForbiddenException ex) {
        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", ex.getMessage()));
    }

    // 400 Bad Request (e.g. token expired or already confirmed)
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, String>> handleBadRequest(IllegalStateException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", ex.getMessage()));
    }

    // 401 Bad Credentials
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, String>> handleBadCredentials(BadCredentialsException ex) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Invalid email or password"));
    }

    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<Map<String, String>> handleDisabledUser(DisabledException ex) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "User is disabled"));
    }




}
