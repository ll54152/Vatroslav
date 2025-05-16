package com.inventar.backend.service;

import com.inventar.backend.DTO.KomponentaAddDTO;
import com.inventar.backend.domain.*;
import com.inventar.backend.repo.*;
import jakarta.servlet.http.HttpServletRequest;
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

    @Autowired
    private AuthenticationServiceJPA authenticationServiceJPA;

    @Autowired
    private HttpServletRequest request;

    @Autowired
    private UserServiceJPA userServiceJPA;

    public Komponenta save(KomponentaAddDTO komponentaDTO) {

        String email = authenticationServiceJPA.getEmailFromToken(request.getHeader("Authorization"));
        String firstName = userServiceJPA.findByEmail(email).getFirstName();
        String lastName = userServiceJPA.findByEmail(email).getLastName();
        String note = "Korisnik '" + firstName + " " + lastName + "' je dodao komponentu '" + komponentaDTO.getName() + "' u bazu podataka";

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
        Log newLog = new Log(newKomponenta, note, LocalDateTime.now(), userServiceJPA.findByEmail(email));
        logList.add(logServiceJPA.save(newLog));

        if (komponentaDTO.getLog() != null) {
            Log eksperimentLog = new Log(newKomponenta, komponentaDTO.getLog(), LocalDateTime.now(), userServiceJPA.findByEmail(email));
            logList.add(logServiceJPA.save(eksperimentLog));
        }
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

    public void deleteById(Long id) {
        Komponenta komponenta = komponentaRepo.findById(id).orElse(null);

        if (komponenta != null) {
            List<Eksperiment> eksperimentList = komponenta.getEksperimenti();
            for (Eksperiment eksperiment : eksperimentList) {
                List<Komponenta> komponentaList = eksperiment.getKomponente();
                komponentaList.remove(komponenta);
                eksperiment.setKomponente(komponentaList);
                eksperimentRepo.save(eksperiment);
            }

            List<Log> eksperimentLogs = komponenta.getLogs();
            for (Log log : eksperimentLogs) {
                logServiceJPA.deleteById(log.getId());
            }

            komponentaRepo.deleteById(id);
        }
    }
}
