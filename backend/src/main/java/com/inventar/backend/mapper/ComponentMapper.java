package com.inventar.backend.mapper;

import com.inventar.backend.DTO.ComponentDTO;
import com.inventar.backend.DTO.ComponentShowDTO;
import org.springframework.stereotype.Component;


import java.util.ArrayList;
import java.util.List;

@Component
public class ComponentMapper {

    public List<ComponentDTO> mapComponentsToDTOs(List<com.inventar.backend.domain.Component> componentList) {
        if (componentList == null) {
            return List.of();
        } else {
            List<ComponentDTO> componentDTOList = new ArrayList<>();

            for (com.inventar.backend.domain.Component component : componentList) {
                ComponentDTO componentDTO = new ComponentDTO();
                componentDTO.setId(component.getId());
                componentDTO.setName(component.getName());
                componentDTO.setZpf(component.getZpf());
                componentDTO.setDescription(component.getDescription());
                componentDTO.setKeywords(component.getKeywords().stream().sorted().toList());

                componentDTOList.add(componentDTO);
            }

            return componentDTOList;
        }
    }

    public List<ComponentShowDTO> mapComponentsToShowDTOs(List<com.inventar.backend.domain.Component> componentList) {
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
                componentShowDTO.setKeywords(component.getKeywords().stream().sorted().toList());
                componentShowDTO.setQuantity(component.getQuantity());

                componentShowDTOList.add(componentShowDTO);
            }

            return componentShowDTOList;
        }
    }

    public ComponentDTO mapComponentToDTO(com.inventar.backend.domain.Component component) {
        if (component == null) {
            return null;
        } else {
            ComponentDTO componentDTO = new ComponentDTO();
            componentDTO.setId(component.getId());
            componentDTO.setName(component.getName());
            componentDTO.setZpf(component.getZpf());
            componentDTO.setDescription(component.getDescription());
            componentDTO.setKeywords(component.getKeywords().stream().sorted().toList());

            return componentDTO;
        }
    }
}
