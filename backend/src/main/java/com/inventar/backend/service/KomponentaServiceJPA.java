package com.inventar.backend.service;

import com.inventar.backend.DTO.*;
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

    @Autowired
    private FilesRepo filesRepo;

    public Komponenta save(KomponentaAddDTO komponentaAddDTO) {

        String email = authenticationServiceJPA.getEmailFromToken(request.getHeader("Authorization"));
        User user = userServiceJPA.findByEmail(email);
        String note = "Korisnik '" + user.getFirstName() + " " + user.getLastName() + "' je dodao komponentu '" + komponentaAddDTO.getName() + "' u bazu podataka";

        LocalDateTime timestamp = LocalDateTime.now();

        Location location = locationRepo.findById((long) komponentaAddDTO.getLocationID()).orElse(null);

        List<Eksperiment> eksperimenti = new ArrayList<>();
        if (komponentaAddDTO.getEksperiments() != null) {
            for (EksperimentDTO eksperiment : komponentaAddDTO.getEksperiments()) {
                if (eksperiment.getId() != null) {
                    Eksperiment existingEksperiment = eksperimentRepo.findById(Long.valueOf(eksperiment.getId())).orElse(null);
                    if (existingEksperiment != null) {
                        eksperimenti.add(existingEksperiment);
                    }
                }
            }
        }

        Komponenta komponenta = new Komponenta(
                komponentaAddDTO.getName()
                , komponentaAddDTO.getZpf()
                , komponentaAddDTO.getFer()
                , komponentaAddDTO.getQuantity()
                , komponentaAddDTO.getDescription()
                , location
        );

        if (!eksperimenti.isEmpty()) {
            komponenta.setEksperimenti(eksperimenti);
        }

        komponentaRepo.save(komponenta);

        logRepo.save(new Log(komponenta, note, timestamp, user));

        if (komponentaAddDTO.getFiles() != null) {
            for (FilesDTO filesDTO : komponentaAddDTO.getFiles()) {
                Files files = new Files();
                files.setName(filesDTO.getName());
                files.setKomponenta(komponenta);
                files.setFileType(filesDTO.getData().getContentType());
                files.setUser(user);
                try {
                    files.setFileByte(filesDTO.getData().getBytes());
                    filesRepo.save(files);

                    String noteFile = "Korisnik '" + user.getFirstName() + " " + user.getLastName() + "' je dodao datoteku '" + files.getName() + "' u komponentu '" + komponenta.getName() + "'";
                    logRepo.save(new Log(komponenta, noteFile, timestamp, user));
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }

        for (Eksperiment eksperiment : eksperimenti) {
            List<Komponenta> komponente = eksperiment.getKomponente();
            komponente.add(komponenta);
            eksperiment.setKomponente(komponente);

            String noteKomponent = "Korisnik '" + user.getFirstName() + " " + user.getLastName() + "' je povezao komponentu '" + komponenta.getName() + "' sa eksperimentom '" + eksperiment.getName() + "'";
            logRepo.save(new Log(komponenta, noteKomponent, timestamp, user));
            logRepo.save(new Log(eksperiment, noteKomponent, timestamp, user));

            eksperimentRepo.save(eksperiment);
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

    public KomponentaShowDTO getShowDTO(Komponenta komponenta) {
        KomponentaShowDTO komponentaShowDTO = new KomponentaShowDTO();
        komponentaShowDTO.setId(komponenta.getId());
        komponentaShowDTO.setFer(komponenta.getFer());
        komponentaShowDTO.setZpf(komponenta.getZpf());
        komponentaShowDTO.setName(komponenta.getName());
        komponentaShowDTO.setDescription(komponenta.getDescription());
        komponentaShowDTO.setQuantity(komponenta.getQuantity());

        if (komponenta.getLocation() != null) {
            LocationDTO locationDTO = new LocationDTO();
            locationDTO.setId(komponenta.getLocation().getId());
            locationDTO.setAdress(komponenta.getLocation().getAdress());
            locationDTO.setRoom(komponenta.getLocation().getRoom());
            komponentaShowDTO.setLocation(locationDTO);
        }

        if (komponenta.getEksperimenti() != null) {
            List<EksperimentShowDTO> eksperimentShowDTOList = new ArrayList<>();
            for (Eksperiment eksperiment : komponenta.getEksperimenti()) {
                EksperimentShowDTO eksperimentShowDTO = new EksperimentShowDTO();
                eksperimentShowDTO.setId(eksperiment.getId());
                eksperimentShowDTO.setName(eksperiment.getName());
                eksperimentShowDTO.setField(eksperiment.getField());
                eksperimentShowDTO.setSubject(eksperiment.getSubject());
                eksperimentShowDTO.setDescription(eksperiment.getDescription());
                eksperimentShowDTO.setMaterials(eksperiment.getMaterials());
                eksperimentShowDTOList.add(eksperimentShowDTO);
            }

            komponentaShowDTO.setEksperimenti(eksperimentShowDTOList);
        }

        if (komponenta.getLogs() != null) {
            List<LogShowDTO> logShowDTOList = new ArrayList<>();
            for (Log log : komponenta.getLogs()) {
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

            komponentaShowDTO.setLogs(logShowDTOList);
        }

        if (komponenta.getFiles() != null) {
            List<FilesShowDTO> filesShowDTOList = new ArrayList<>();
            for (Files file : komponenta.getFiles()) {
                FilesShowDTO filesShowDTO = new FilesShowDTO();
                filesShowDTO.setId(file.getId());
                filesShowDTO.setName(file.getName());
                filesShowDTO.setFileByte(Base64.getEncoder().encodeToString(file.getFileByte()));
                filesShowDTOList.add(filesShowDTO);
            }

            komponentaShowDTO.setFiles(filesShowDTOList);
        }

        return komponentaShowDTO;
    }
}
