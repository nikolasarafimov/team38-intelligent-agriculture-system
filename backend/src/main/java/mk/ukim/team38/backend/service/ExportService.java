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

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
public class ExportService {

    private final CropRepository cropRepository;
    private final ParcelRepository parcelRepository;
    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;

    public ExportService(CropRepository cropRepository,
                         ParcelRepository parcelRepository,
                         ActivityRepository activityRepository,
                         UserRepository userRepository) {
        this.cropRepository = cropRepository;
        this.parcelRepository = parcelRepository;
        this.activityRepository = activityRepository;
        this.userRepository = userRepository;
    }

    public String exportCropsCsv(User user) {
        List<Crop> crops = cropRepository.findByUser(user);
        StringBuilder sb = new StringBuilder();
        sb.append("id,name,type,plantingDate\n");
        for (Crop c : crops) {
            sb.append(c.getId()).append(",")
              .append(escapeCsv(c.getName())).append(",")
              .append(escapeCsv(c.getType())).append(",")
              .append(escapeCsv(c.getPlantingDate() != null ? c.getPlantingDate() : ""))
              .append("\n");
        }
        return sb.toString();
    }

    public String exportParcelsCsv(User user) {
        List<Parcel> parcels = parcelRepository.findByUser(user);
        StringBuilder sb = new StringBuilder();
        sb.append("id,location,size,soilType\n");
        for (Parcel p : parcels) {
            sb.append(p.getId()).append(",")
              .append(escapeCsv(p.getLocation() != null ? p.getLocation() : "")).append(",")
              .append(p.getSize() != null ? p.getSize() : "").append(",")
              .append(escapeCsv(p.getSoilType() != null ? p.getSoilType() : ""))
              .append("\n");
        }
        return sb.toString();
    }

    public String exportActivitiesCsv(User user) {
        List<Activity> activities = activityRepository.findByUser(user);
        StringBuilder sb = new StringBuilder();
        sb.append("id,description,date,type\n");
        for (Activity a : activities) {
            sb.append(a.getId()).append(",")
              .append(escapeCsv(a.getDescription() != null ? a.getDescription() : "")).append(",")
              .append(escapeCsv(a.getDate() != null ? a.getDate() : "")).append(",")
              .append(escapeCsv(a.getType() != null ? a.getType() : ""))
              .append("\n");
        }
        return sb.toString();
    }

    public byte[] exportAllToExcel(User user) throws IOException {
        Workbook workbook = new XSSFWorkbook();

        Sheet cropsSheet = workbook.createSheet("Crops");
        Row cropsHeader = cropsSheet.createRow(0);
        String[] cropsColumns = {"ID", "Name", "Type", "Planting Date"};
        for (int i = 0; i < cropsColumns.length; i++) {
            cropsHeader.createCell(i).setCellValue(cropsColumns[i]);
        }
        List<Crop> crops = cropRepository.findByUser(user);
        int rowIdx = 1;
        for (Crop c : crops) {
            Row row = cropsSheet.createRow(rowIdx++);
            row.createCell(0).setCellValue(c.getId());
            row.createCell(1).setCellValue(c.getName());
            row.createCell(2).setCellValue(c.getType());
            row.createCell(3).setCellValue(c.getPlantingDate());
        }

        Sheet parcelsSheet = workbook.createSheet("Parcels");
        Row parcelsHeader = parcelsSheet.createRow(0);
        String[] parcelsColumns = {"ID", "Location", "Size", "Soil Type"};
        for (int i = 0; i < parcelsColumns.length; i++) {
            parcelsHeader.createCell(i).setCellValue(parcelsColumns[i]);
        }
        List<Parcel> parcels = parcelRepository.findByUser(user);
        rowIdx = 1;
        for (Parcel p : parcels) {
            Row row = parcelsSheet.createRow(rowIdx++);
            row.createCell(0).setCellValue(p.getId());
            row.createCell(1).setCellValue(p.getLocation());
            row.createCell(2).setCellValue(p.getSize() != null ? p.getSize() : 0);
            row.createCell(3).setCellValue(p.getSoilType());
        }

        Sheet activitiesSheet = workbook.createSheet("Activities");
        Row activitiesHeader = activitiesSheet.createRow(0);
        String[] activitiesColumns = {"ID", "Description", "Date", "Type"};
        for (int i = 0; i < activitiesColumns.length; i++) {
            activitiesHeader.createCell(i).setCellValue(activitiesColumns[i]);
        }
        List<Activity> activities = activityRepository.findByUser(user);
        rowIdx = 1;
        for (Activity a : activities) {
            Row row = activitiesSheet.createRow(rowIdx++);
            row.createCell(0).setCellValue(a.getId());
            row.createCell(1).setCellValue(a.getDescription());
            row.createCell(2).setCellValue(a.getDate());
            row.createCell(3).setCellValue(a.getType());
        }

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        workbook.write(out);
        workbook.close();
        return out.toByteArray();
    }

    private String escapeCsv(String value) {
        if (value == null) return "";
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }
}
