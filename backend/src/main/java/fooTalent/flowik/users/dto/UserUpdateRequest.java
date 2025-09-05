package fooTalent.flowik.users.dto;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class UserUpdateRequest {

    private String firstName;
    private String lastName;
}