package com.inventar.backend.service;

import com.inventar.backend.DTO.KomponentaAddDTO;
import com.inventar.backend.domain.*;
import com.inventar.backend.repo.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.stereotype.*;

import java.time.*;
import java.util.*;

@Service
public class KomponentaServiceJPA {

    @Autowired
    private KomponentaRepo komponentaRepo;

    @Autowired
    private LocationRepo locationRepo;

    @Autowired
    private EksperimentRepo eksperimentRepo;

    @Autowired
    private LogServiceJPA logServiceJPA;

    public Komponenta save(KomponentaAddDTO komponentaDTO) {
        Location location = locationRepo.findById((long) komponentaDTO.getLocationID()).orElse(null);

        List<Eksperiment> eksperimentList = new ArrayList<>();
        eksperimentList.add(eksperimentRepo.findById((long) komponentaDTO.getEksperimentID()).orElse(null));

        Komponenta komponenta = new Komponenta(
                komponentaDTO.getName()
                , komponentaDTO.getZpf()
                , komponentaDTO.getFer()
                , komponentaDTO.getQuantity()
                , komponentaDTO.getDescription()
                , location
                , eksperimentList
        );
        Komponenta newKomponenta = komponentaRepo.save(komponenta);

        List<Log> logList = new ArrayList<>();
        //Todo: add real user
        Log newLog = new Log(newKomponenta, komponentaDTO.getLog(), LocalDateTime.now(), null);
        logList.add(logServiceJPA.save(newLog));
        newKomponenta.setLogs(logList);

        return newKomponenta;
    }

    public Komponenta findByZpf(String zpf) {
        return komponentaRepo.findByZpf(zpf).orElse(null);
    }

    public Komponenta findById(Long id) {
        return komponentaRepo.findById(id).orElse(null);
    }

    public List<Komponenta> findAll() {
        return komponentaRepo.findAll();
    }
}
