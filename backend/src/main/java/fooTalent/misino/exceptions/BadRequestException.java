package fooTalent.misino.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.BAD_REQUEST) // 400
public class BadRequestException extends RuntimeException{

    public BadRequestException(String message) {
        super(message);
    }
}