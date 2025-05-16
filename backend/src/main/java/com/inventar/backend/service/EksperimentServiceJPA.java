package com.inventar.backend.service;

import com.inventar.backend.DTO.*;
import com.inventar.backend.domain.*;
import com.inventar.backend.repo.*;
import com.inventar.backend.security.JWTService;
import jakarta.servlet.http.HttpServletRequest;
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

    @Autowired
    private AuthenticationServiceJPA authenticationServiceJPA;

    @Autowired
    private HttpServletRequest request;

    @Autowired
    private UserServiceJPA userServiceJPA;

    public Eksperiment save(EksperimentAddDTO eksperimentAddDTO) {

        String email = authenticationServiceJPA.getEmailFromToken(request.getHeader("Authorization"));
        String firstName = userServiceJPA.findByEmail(email).getFirstName();
        String lastName = userServiceJPA.findByEmail(email).getLastName();
        String note = "Korisnik '" + firstName + " " + lastName + "' je dodao eksperiment '" + eksperimentAddDTO.getName() + "' u bazu podataka";


        List<Komponenta> komponente = new ArrayList<>();
        if (eksperimentAddDTO.getKomponente() != null) {
            for (Komponenta komponenta : eksperimentAddDTO.getKomponente()) {
                komponente.add(komponentaServiceJPA.findById(Long.valueOf(komponenta.getId())));
            }
        }

        Eksperiment eksperiment = new Eksperiment(
                eksperimentAddDTO.getName(),
                eksperimentAddDTO.getField(),
                eksperimentAddDTO.getSubject(),
                eksperimentAddDTO.getDescription(),
                eksperimentAddDTO.getMaterials()
        );

        if (!komponente.isEmpty()) {
            eksperiment.setKomponente(komponente);
        }

        eksperimentRepo.save(eksperiment);


        for (Komponenta komponenta : komponente) {
            List<Eksperiment> eksperimenti = komponenta.getEksperimenti();
            eksperimenti.add(eksperiment);
            komponenta.setEksperimenti(eksperimenti);

            List<Log> komponentaLogs = komponenta.getLogs();
            String noteKomponent  = "Korisnik '" + firstName + " " + lastName + "' je povezao komponentu '" + komponenta.getName() + "' sa eksperimentom '" + eksperiment.getName() + "'";
            Log logKomponenta = new Log(komponenta, noteKomponent, LocalDateTime.now(), userServiceJPA.findByEmail(email));
            komponentaLogs.add(logKomponenta);
            komponenta.setLogs(komponentaLogs);

            komponentaRepo.save(komponenta);
        }

        List<Log> logList = new ArrayList<>();
        Log newLog = new Log(eksperiment, note, LocalDateTime.now(), userServiceJPA.findByEmail(email));
        logList.add(logServiceJPA.save(newLog));

        if (eksperimentAddDTO.getLog() != null) {
            Log eksperimentLog = new Log(eksperiment, eksperimentAddDTO.getLog(), LocalDateTime.now(), userServiceJPA.findByEmail(email));
            logList.add(logServiceJPA.save(eksperimentLog));
        }
        eksperiment.setLogs(logList);

        return eksperiment;
    }

    public List<Eksperiment> findAll() {
        return eksperimentRepo.findAll();
    }

    public Eksperiment findById(Long id) {
        return eksperimentRepo.findById(id).orElse(null);
    }

    public void deleteById(Long id) {
        Eksperiment eksperiment = eksperimentRepo.findById(id).orElse(null);
        if (eksperiment != null) {
            List<Komponenta> komponente = eksperiment.getKomponente();
            for (Komponenta komponenta : komponente) {
                List<Eksperiment> eksperimenti = komponenta.getEksperimenti();
                eksperimenti.remove(eksperiment);
                komponenta.setEksperimenti(eksperimenti);
                komponentaRepo.save(komponenta);
            }

            List<Log> eksperimentLogs = eksperiment.getLogs();
            for (Log log : eksperimentLogs) {
                logServiceJPA.deleteById(log.getId());
            }

            eksperimentRepo.deleteById(id);
        }
    }
}
