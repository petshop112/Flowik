package fooTalent.flowik.exceptions.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@NoArgsConstructor
@Getter @Setter
public class ApiResponse {

    private LocalDate date;
    private String message;
    private String path;

    public ApiResponse(String message, String path){
        date = LocalDate.now();
        this.message = message;
        this.path = path.replace("uri=", "");
    }
}