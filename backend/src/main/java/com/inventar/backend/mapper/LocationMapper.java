package com.inventar.backend.mapper;

import com.inventar.backend.DTO.LocationDTO;
import com.inventar.backend.domain.Location;
import org.springframework.stereotype.Component;

@Component
public class LocationMapper {

    public LocationDTO mapLocationToDTO(Location location) {
        if (location == null) {
            return null;
        } else {
            LocationDTO locationDTO = new LocationDTO();

            if (location.getId() != null) {
                locationDTO.setId(location.getId());
            }

            if (location.getAddress() != null) {
                locationDTO.setAddress(location.getAddress());
            }

            if (location.getRoom() != null) {
                locationDTO.setRoom(location.getRoom());
            }

            return locationDTO;
        }
    }
}
