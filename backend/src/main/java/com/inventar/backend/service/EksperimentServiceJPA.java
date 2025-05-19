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
    private KomponentaRepo komponentaRepo;

    @Autowired
    private AuthenticationServiceJPA authenticationServiceJPA;

    @Autowired
    private HttpServletRequest request;

    @Autowired
    private UserServiceJPA userServiceJPA;

    @Autowired
    private LogRepo logRepo;

    public Eksperiment save(EksperimentAddDTO eksperimentAddDTO) {

        String email = authenticationServiceJPA.getEmailFromToken(request.getHeader("Authorization"));
        User user = userServiceJPA.findByEmail(email);
        String note = "Korisnik '" + user.getFirstName() + " " + user.getLastName() + "' je dodao eksperiment '" + eksperimentAddDTO.getName() + "' u bazu podataka";


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

            String noteKomponent = "Korisnik '" + user.getFirstName() + " " + user.getLastName() + "' je povezao komponentu '" + komponenta.getName() + "' sa eksperimentom '" + eksperiment.getName() + "'";
            Log logKomponenta = new Log(komponenta, noteKomponent, LocalDateTime.now(), user);
            logRepo.save(logKomponenta);

            komponentaRepo.save(komponenta);
        }

        Log newLog = new Log(eksperiment, note, LocalDateTime.now(), user);
        logRepo.save(newLog);

        if (eksperimentAddDTO.getLog() != null) {
            Log eksperimentLog = new Log(eksperiment, eksperimentAddDTO.getLog(), LocalDateTime.now(), user);
            logRepo.save(eksperimentLog);
        }

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
                logRepo.deleteById(log.getId());
            }

            eksperimentRepo.deleteById(id);
        }
    }

    public EksperimentShowDTO getShowDTO(Eksperiment eksperiment) {
        EksperimentShowDTO eksperimentShowDTO = new EksperimentShowDTO();
        eksperimentShowDTO.setId(eksperiment.getId());
        eksperimentShowDTO.setName(eksperiment.getName());
        eksperimentShowDTO.setField(eksperiment.getField());
        eksperimentShowDTO.setSubject(eksperiment.getSubject());
        eksperimentShowDTO.setDescription(eksperiment.getDescription());
        eksperimentShowDTO.setMaterials(eksperiment.getMaterials());


        if (eksperiment.getKomponente() != null) {
            List<KomponentaShowDTO> komponentaShowDTOList = new ArrayList<>();
            for (Komponenta komponenta : eksperiment.getKomponente()) {
                KomponentaShowDTO komponentaShowDTO = new KomponentaShowDTO();
                komponentaShowDTO.setId(komponenta.getId());
                komponentaShowDTO.setName(komponenta.getName());
                komponentaShowDTO.setDescription(komponenta.getDescription());
                komponentaShowDTO.setZpf(komponenta.getZpf());
                komponentaShowDTO.setFer(komponenta.getFer());
                komponentaShowDTO.setQuantity(komponenta.getQuantity());
                komponentaShowDTOList.add(komponentaShowDTO);
            }

            eksperimentShowDTO.setKomponente(komponentaShowDTOList);
        }


        if (eksperiment.getLogs() != null) {
            List<LogShowDTO> logShowDTOList = new ArrayList<>();
            for (Log log : eksperiment.getLogs()) {
                LogShowDTO logShowDTO = new LogShowDTO();
                logShowDTO.setId(log.getId());
                logShowDTO.setNote(log.getNote());
                logShowDTO.setTimestamp(log.getTimestamp());

                if (log.getUser() != null) {
                    UserShowDTO userShowDTO = new UserShowDTO();
                    userShowDTO.setEmail(log.getUser().getEmail());
                    userShowDTO.setFirstName(log.getUser().getFirstName());
                    userShowDTO.setLastName(log.getUser().getLastName());
                    logShowDTO.setUser(userShowDTO);
                }

                logShowDTOList.add(logShowDTO);
            }

            eksperimentShowDTO.setLogs(logShowDTOList);
        }


        if (eksperiment.getFiles() != null) {
            List<FilesShowDTO> filesShowDTOList = new ArrayList<>();
            for (Files files : eksperiment.getFiles()) {
                FilesShowDTO filesShowDTO = new FilesShowDTO();
                filesShowDTO.setId(files.getId());
                filesShowDTO.setName(files.getName());
                filesShowDTO.setFileByte(Base64.getEncoder().encodeToString(files.getFileByte()));
                filesShowDTOList.add(filesShowDTO);
            }

            eksperimentShowDTO.setFiles(filesShowDTOList);
        }


        return eksperimentShowDTO;
    }
}
