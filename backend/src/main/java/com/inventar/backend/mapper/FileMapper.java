package com.inventar.backend.mapper;

import com.inventar.backend.DTO.FileShowDTO;
import com.inventar.backend.domain.File;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class FileMapper {

    public List<FileShowDTO> mapFilesToDTOs(List<File> fileList) {
        if (fileList == null) {
            return List.of();
        } else {
            List<FileShowDTO> fileShowDTOList = new ArrayList<>();

            for (File file : fileList) {
                FileShowDTO fileShowDTO = new FileShowDTO();
                fileShowDTO.setId(file.getId());
                fileShowDTO.setName(file.getName());
                fileShowDTO.setFileCategory(file.getFileCategory());

                fileShowDTOList.add(fileShowDTO);
            }

            return fileShowDTOList;
        }
    }
}
