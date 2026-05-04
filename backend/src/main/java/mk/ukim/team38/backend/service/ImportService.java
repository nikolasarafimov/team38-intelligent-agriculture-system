package mk.ukim.team38.backend.service;

import mk.ukim.team38.backend.model.Activity;
import mk.ukim.team38.backend.model.Crop;
import mk.ukim.team38.backend.model.Parcel;
import mk.ukim.team38.backend.model.User;
import mk.ukim.team38.backend.repository.ActivityRepository;
import mk.ukim.team38.backend.repository.CropRepository;
import mk.ukim.team38.backend.repository.ParcelRepository;
import mk.ukim.team38.backend.repository.UserRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.*;

@Service
public class ImportService {

    private final CropRepository cropRepository;
    private final ParcelRepository parcelRepository;
    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;

    public ImportService(CropRepository cropRepository,
                         ParcelRepository parcelRepository,
                         ActivityRepository activityRepository,
                         UserRepository userRepository) {
        this.cropRepository = cropRepository;
        this.parcelRepository = parcelRepository;
        this.activityRepository = activityRepository;
        this.userRepository = userRepository;
    }

    public Map<String, Object> importCropsCsv(MultipartFile file, User user) throws IOException {
        int imported = 0, skipped = 0;
        List<String> errors = new ArrayList<>();

        BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()));
        String line;
        boolean isHeader = true;
        int lineNumber = 0;

        while ((line = reader.readLine()) != null) {
            lineNumber++;
            if (isHeader) { isHeader = false; continue; } // skip header

            String[] cols = line.split(",");
            if (cols.length < 2) {
                errors.add("Line " + lineNumber + ": not enough columns");
                skipped++;
                continue;
            }

            try {
                Crop crop = new Crop();
                crop.setName(cols[1].trim());
                if (cols.length > 2) crop.setType(cols[2].trim());
                if (cols.length > 3 && !cols[3].trim().isEmpty()) crop.setPlantingDate(cols[3].trim());
                crop.setUser(user);
                cropRepository.save(crop);
                imported++;
            } catch (Exception e) {
                errors.add("Line " + lineNumber + ": " + e.getMessage());
                skipped++;
            }
        }

        return Map.of("imported", imported, "skipped", skipped, "errors", errors);
    }

    public Map<String, Object> importParcelsCsv(MultipartFile file, User user) throws IOException {
        int imported = 0, skipped = 0;
        List<String> errors = new ArrayList<>();

        BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()));
        String line;
        boolean isHeader = true;
        int lineNumber = 0;

        while ((line = reader.readLine()) != null) {
            lineNumber++;
            if (isHeader) { isHeader = false; continue; }

            String[] cols = line.split(",");
            if (cols.length < 2) {
                errors.add("Line " + lineNumber + ": not enough columns");
                skipped++;
                continue;
            }

            try {
                Parcel parcel = new Parcel();
                parcel.setLocation(cols[1].trim());
                if (cols.length > 2 && !cols[2].trim().isEmpty()) parcel.setSize(Double.parseDouble(cols[2].trim()));
                if (cols.length > 3) parcel.setSoilType(cols[3].trim());
                parcel.setUser(user);
                parcelRepository.save(parcel);
                imported++;
            } catch (Exception e) {
                errors.add("Line " + lineNumber + ": " + e.getMessage());
                skipped++;
            }
        }

        return Map.of("imported", imported, "skipped", skipped, "errors", errors);
    }

    public Map<String, Object> importActivitiesCsv(MultipartFile file, User user) throws IOException {
        int imported = 0, skipped = 0;
        List<String> errors = new ArrayList<>();

        BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()));
        String line;
        boolean isHeader = true;
        int lineNumber = 0;

        while ((line = reader.readLine()) != null) {
            lineNumber++;
            if (isHeader) { isHeader = false; continue; }

            String[] cols = line.split(",");
            if (cols.length < 2) {
                errors.add("Line " + lineNumber + ": not enough columns");
                skipped++;
                continue;
            }

            try {
                Activity activity = new Activity();
                activity.setDescription(cols[1].trim());
                if (cols.length > 2 && !cols[2].trim().isEmpty()) activity.setDate(cols[2].trim());
                if (cols.length > 3) activity.setType(cols[3].trim());
                activity.setUser(user);
                activityRepository.save(activity);
                imported++;
            } catch (Exception e) {
                errors.add("Line " + lineNumber + ": " + e.getMessage());
                skipped++;
            }
        }

        return Map.of("imported", imported, "skipped", skipped, "errors", errors);
    }

    public Map<String, Object> importFromExcel(MultipartFile file, User user) throws IOException {
        int imported = 0, skipped = 0;
        List<String> errors = new ArrayList<>();

        Workbook workbook = new XSSFWorkbook(file.getInputStream());

        Sheet cropsSheet = workbook.getSheet("Crops");
        if (cropsSheet != null) {
            for (int i = 1; i <= cropsSheet.getLastRowNum(); i++) {
                Row row = cropsSheet.getRow(i);
                if (row == null) continue;
                try {
                    Crop crop = new Crop();
                    crop.setName(getCellValue(row, 1));
                    crop.setType(getCellValue(row, 2));
                    crop.setPlantingDate(getCellValue(row, 3));
                    crop.setUser(user);
                    cropRepository.save(crop);
                    imported++;
                } catch (Exception e) {
                    errors.add("Crops row " + i + ": " + e.getMessage());
                    skipped++;
                }
            }
        }

        Sheet parcelsSheet = workbook.getSheet("Parcels");
        if (parcelsSheet != null) {
            for (int i = 1; i <= parcelsSheet.getLastRowNum(); i++) {
                Row row = parcelsSheet.getRow(i);
                if (row == null) continue;
                try {
                    Parcel parcel = new Parcel();
                    parcel.setLocation(getCellValue(row, 1));
                    String size = getCellValue(row, 2);
                    if (!size.isEmpty()) parcel.setSize(Double.parseDouble(size));
                    parcel.setSoilType(getCellValue(row, 3));
                    parcel.setUser(user);
                    parcelRepository.save(parcel);
                    imported++;
                } catch (Exception e) {
                    errors.add("Parcels row " + i + ": " + e.getMessage());
                    skipped++;
                }
            }
        }

        Sheet activitiesSheet = workbook.getSheet("Activities");
        if (activitiesSheet != null) {
            for (int i = 1; i <= activitiesSheet.getLastRowNum(); i++) {
                Row row = activitiesSheet.getRow(i);
                if (row == null) continue;
                try {
                    Activity activity = new Activity();
                    activity.setDescription(getCellValue(row, 1));
                    activity.setDate(getCellValue(row, 2));
                    activity.setType(getCellValue(row, 3));
                    activity.setUser(user);
                    activityRepository.save(activity);
                    imported++;
                } catch (Exception e) {
                    errors.add("Activities row " + i + ": " + e.getMessage());
                    skipped++;
                }
            }
        }

        workbook.close();
        return Map.of("imported", imported, "skipped", skipped, "errors", errors);
    }

    private String getCellValue(Row row, int index) {
        Cell cell = row.getCell(index);
        if (cell == null) return "";
        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue().trim();
            case NUMERIC -> String.valueOf((long) cell.getNumericCellValue());
            default -> "";
        };
    }
}
