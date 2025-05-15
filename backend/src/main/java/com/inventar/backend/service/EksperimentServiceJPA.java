package com.inventar.backend.service;

import com.inventar.backend.DTO.*;
import com.inventar.backend.domain.*;
import com.inventar.backend.repo.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.stereotype.*;

import java.time.*;
import java.util.*;

@Service
public class EksperimentServiceJPA {

    @Autowired
    private EksperimentRepo eksperimentRepo;

    @Autowired
    private KomponentaServiceJPA komponentaServiceJPA;

    @Autowired
    private LogServiceJPA logServiceJPA;

    @Autowired
    private KomponentaRepo komponentaRepo;

    public Eksperiment save(EksperimentAddDTO eksperimentAddDTO) {
        System.out.println(eksperimentAddDTO);

        List<Komponenta> komponente = new ArrayList<>();
        for (Komponenta komponenta : eksperimentAddDTO.getKomponente()) {
            komponente.add(komponentaServiceJPA.findById(Long.valueOf(komponenta.getId())));
        }

        Eksperiment eksperiment = new Eksperiment(
                eksperimentAddDTO.getName(),
                eksperimentAddDTO.getField(),
                eksperimentAddDTO.getSubject(),
                eksperimentAddDTO.getDescription(),
                eksperimentAddDTO.getMaterials()
        );
        eksperiment.setKomponente(komponente);
        eksperimentRepo.save(eksperiment);


        for (Komponenta komponenta : komponente) {
            List<Eksperiment> eksperimenti = komponenta.getEksperimenti();
            eksperimenti.add(eksperiment);
            komponenta.setEksperimenti(eksperimenti);
            komponentaRepo.save(komponenta);
        }

        List<Log> logList = new ArrayList<>();
        //Todo: add real user
        Log newLog = new Log(eksperiment, eksperimentAddDTO.getLog(), LocalDateTime.now(), null);
        logList.add(logServiceJPA.save(newLog));
        eksperiment.setLogs(logList);

        return eksperiment;
    }

    public List<Eksperiment> findAll() {
        return eksperimentRepo.findAll();
    }

    public Eksperiment findById(Long id) {
        return eksperimentRepo.findById(id).orElse(null);
    }
}
