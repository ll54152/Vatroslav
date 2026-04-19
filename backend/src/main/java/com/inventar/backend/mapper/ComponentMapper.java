package com.inventar.backend.mapper;

import com.inventar.backend.DTO.ComponentShowDTO;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class ComponentMapper {

    public List<ComponentShowDTO> mapComponentsToDTOs(List<com.inventar.backend.domain.Component> componentList) {
        if (componentList == null) {
            return List.of();
        } else {
            List<ComponentShowDTO> componentShowDTOList = new ArrayList<>();

            for (com.inventar.backend.domain.Component component : componentList) {
                ComponentShowDTO componentShowDTO = new ComponentShowDTO();
                componentShowDTO.setId(component.getId());
                componentShowDTO.setName(component.getName());
                componentShowDTO.setZpf(component.getZpf());
                componentShowDTO.setFer(component.getFer());
                componentShowDTO.setFerStatus(component.getFerStatus());
                componentShowDTO.setDeprecatedInventoryMarks(component.getDeprecatedInventoryMarks());
                componentShowDTO.setDescription(component.getDescription());
                componentShowDTO.setKeywords(component.getKeywords());
                componentShowDTO.setQuantity(component.getQuantity());

                componentShowDTOList.add(componentShowDTO);
            }

            return componentShowDTOList;
        }
    }
}
