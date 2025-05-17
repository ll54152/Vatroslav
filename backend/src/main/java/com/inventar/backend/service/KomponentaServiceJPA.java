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
    private AuthenticationServiceJPA authenticationServiceJPA;

    @Autowired
    private HttpServletRequest request;

    @Autowired
    private UserServiceJPA userServiceJPA;

    @Autowired
    private LogRepo logRepo;

    public Komponenta save(KomponentaAddDTO komponentaDTO) {

        String email = authenticationServiceJPA.getEmailFromToken(request.getHeader("Authorization"));
        User user = userServiceJPA.findByEmail(email);
        String note = "Korisnik '" + user.getFirstName() + " " + user.getLastName() + "' je dodao komponentu '" + komponentaDTO.getName() + "' u bazu podataka";

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
        komponentaRepo.save(komponenta);

        Log newLog = new Log(komponenta, note, LocalDateTime.now(), user);
        logRepo.save(newLog);

        if (komponentaDTO.getLog() != null) {
            Log eksperimentLog = new Log(komponenta, komponentaDTO.getLog(), LocalDateTime.now(), user);
            logRepo.save(eksperimentLog);
        }

        return komponenta;
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
                logRepo.deleteById(log.getId());
            }

            komponentaRepo.deleteById(id);
        }
    }
}
