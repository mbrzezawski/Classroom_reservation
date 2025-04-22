package com.to.backend.exception;

public class SelfDemoteException extends RuntimeException {
    public SelfDemoteException(String message) { super(message); }
}
