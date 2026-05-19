package com.inventar.backend.mapper;

import com.inventar.backend.DTO.ComponentDTO;
import com.inventar.backend.DTO.ExperimentDTO;
import com.inventar.backend.DTO.LogShowAllDTO;
import com.inventar.backend.DTO.LogShowDTO;
import com.inventar.backend.domain.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class LogMapper {

    private final UserMapper userMapper;

    @Autowired
    public LogMapper(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    public List<LogShowDTO> mapLogsToShowDTOs(List<Log> logList) {
        if (logList == null) {
            return List.of();
        } else {
            List<LogShowDTO> logShowDTOList = new ArrayList<>();

            for (Log log : logList) {
                LogShowDTO logShowDTO = new LogShowDTO();
                logShowDTO.setId(log.getId());
                logShowDTO.setNote(log.getNote());
                logShowDTO.setTimestamp(log.getTimestamp());
                logShowDTO.setDeletable(log.isDeletable());
                logShowDTO.setUserShowDTO(userMapper.mapUserToShowDTO(log.getUser()));

                logShowDTOList.add(logShowDTO);
            }

            return logShowDTOList;
        }
    }

    public List<LogShowAllDTO> mapLogsToShowAllDTOs(List<Log> logList) {
        if (logList == null) {
            return List.of();
        } else {
            List<LogShowAllDTO> logShowAllDTOList = new ArrayList<>();
            for (Log log : logList) {
                LogShowAllDTO logShowAllDTO = new LogShowAllDTO();
                logShowAllDTO.setId(log.getId());
                logShowAllDTO.setNote(log.getNote());
                logShowAllDTO.setTimestamp(log.getTimestamp());
                logShowAllDTO.setDeletable(log.isDeletable());
                logShowAllDTO.setUserShowDTO(userMapper.mapUserToShowDTO(log.getUser()));

                if (log.getComponent() != null) {
                    ComponentDTO componentDTO = new ComponentDTO();
                    componentDTO.setId(log.getComponent().getId());
                    componentDTO.setName(log.getComponent().getName());
                    componentDTO.setZpf(log.getComponent().getZpf());
                    componentDTO.setDescription(log.getComponent().getDescription());
                    componentDTO.setKeywords(log.getComponent().getKeywords());
                    logShowAllDTO.setComponentDTO(componentDTO);
                }

                if (log.getExperiment() != null) {
                    ExperimentDTO experimentDTO = new ExperimentDTO();
                    experimentDTO.setId(log.getExperiment().getId());
                    experimentDTO.setName(log.getExperiment().getName());
                    experimentDTO.setZpf(log.getExperiment().getZpf());
                    experimentDTO.setDescription(log.getExperiment().getDescription());
                    experimentDTO.setKeywords(log.getExperiment().getKeywords());
                    logShowAllDTO.setExperimentDTO(experimentDTO);
                }

                logShowAllDTOList.add(logShowAllDTO);
            }

            return logShowAllDTOList;
        }
    }
}
