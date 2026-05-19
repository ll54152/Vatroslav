package com.inventar.backend.mapper;

import com.inventar.backend.DTO.UserShowDTO;
import com.inventar.backend.domain.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserShowDTO mapUserToShowDTO(User user) {
        if (user == null) {
            return null;
        } else {
            UserShowDTO userShowDTO = new UserShowDTO();
            userShowDTO.setId(user.getId());
            userShowDTO.setEmail(user.getEmail());
            userShowDTO.setFirstName(user.getFirstName());
            userShowDTO.setLastName(user.getLastName());
            return userShowDTO;
        }
    }
}
