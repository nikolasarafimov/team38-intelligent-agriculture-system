package mk.ukim.team38.backend.controller;

import mk.ukim.team38.backend.model.User;
import mk.ukim.team38.backend.repository.UserRepository;
import mk.ukim.team38.backend.service.ExportService;
import mk.ukim.team38.backend.service.ImportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/data")
public class DataController {

    @Autowired
    private ExportService exportService;

    @Autowired
    private ImportService importService;

    @Autowired
    private UserRepository userRepository;

    // Export Crops to CSV
    @GetMapping("/export/crops")
    public ResponseEntity<byte[]> exportCrops(@RequestParam Long userId) throws IOException {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        String csv = exportService.exportCropsCsv(user);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.TEXT_PLAIN);
        headers.setContentDispositionFormData("attachment", "crops.csv");
        return ResponseEntity.ok().headers(headers).body(csv.getBytes());
    }

    // Import Crops from CSV
    @PostMapping("/import/crops")
    public ResponseEntity<Map<String, Object>> importCrops(@RequestParam("file") MultipartFile file, @RequestParam Long userId) throws IOException {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Map<String, Object> result = importService.importCropsCsv(file, user);
        return ResponseEntity.ok(result);
    }

    // Export Parcels to CSV
    @GetMapping("/export/parcels")
    public ResponseEntity<byte[]> exportParcels(@RequestParam Long userId) throws IOException {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        String csv = exportService.exportParcelsCsv(user);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.TEXT_PLAIN);
        headers.setContentDispositionFormData("attachment", "parcels.csv");
        return ResponseEntity.ok().headers(headers).body(csv.getBytes());
    }

    // Import Parcels from CSV
    @PostMapping("/import/parcels")
    public ResponseEntity<Map<String, Object>> importParcels(@RequestParam("file") MultipartFile file, @RequestParam Long userId) throws IOException {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Map<String, Object> result = importService.importParcelsCsv(file, user);
        return ResponseEntity.ok(result);
    }

    // Export Activities to CSV
    @GetMapping("/export/activities")
    public ResponseEntity<byte[]> exportActivities(@RequestParam Long userId) throws IOException {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        String csv = exportService.exportActivitiesCsv(user);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.TEXT_PLAIN);
        headers.setContentDispositionFormData("attachment", "activities.csv");
        return ResponseEntity.ok().headers(headers).body(csv.getBytes());
    }

    // Import Activities from CSV
    @PostMapping("/import/activities")
    public ResponseEntity<Map<String, Object>> importActivities(@RequestParam("file") MultipartFile file, @RequestParam Long userId) throws IOException {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Map<String, Object> result = importService.importActivitiesCsv(file, user);
        return ResponseEntity.ok(result);
    }

    // Export All to Excel
    @GetMapping("/export/excel")
    public ResponseEntity<byte[]> exportAllExcel(@RequestParam Long userId) throws IOException {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        byte[] excelData = exportService.exportAllToExcel(user);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
        headers.setContentDispositionFormData("attachment", "agriculture_data.xlsx");
        return ResponseEntity.ok().headers(headers).body(excelData);
    }

    // Import from Excel
    @PostMapping("/import/excel")
    public ResponseEntity<Map<String, Object>> importExcel(@RequestParam("file") MultipartFile file, @RequestParam Long userId) throws IOException {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Map<String, Object> result = importService.importFromExcel(file, user);
        return ResponseEntity.ok(result);
    }
}
