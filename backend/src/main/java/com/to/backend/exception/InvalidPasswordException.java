package com.to.backend.exception;

public class InvalidPasswordException extends  RuntimeException{
    public InvalidPasswordException(String message){
        super(message);
    }
}
