package mk.ukim.team38.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public class RecommendationRequest {

    @JsonProperty("Soil_pH")
    @NotNull(message = "Soil pH is required.")
    private Double soilPH;

    @JsonProperty("Soil_Moisture")
    @NotNull(message = "Soil moisture is required.")
    @PositiveOrZero(message = "Soil moisture must be greater than or equal to 0.")
    private Double soilMoisture;

    @JsonProperty("Organic_Carbon")
    @NotNull(message = "Organic carbon is required.")
    @PositiveOrZero(message = "Organic carbon must be greater than or equal to 0.")
    private Double organicCarbon;

    @JsonProperty("Electrical_Conductivity")
    @NotNull(message = "Electrical conductivity is required.")
    @PositiveOrZero(message = "Electrical conductivity must be greater than or equal to 0.")
    private Double electricalConductivity;

    @JsonProperty("Temperature_C")
    @NotNull(message = "Temperature is required.")
    private Double temperatureC;

    @JsonProperty("Humidity")
    @NotNull(message = "Humidity is required.")
    @PositiveOrZero(message = "Humidity must be greater than or equal to 0.")
    private Double humidity;

    @JsonProperty("Rainfall_mm")
    @NotNull(message = "Rainfall is required.")
    @PositiveOrZero(message = "Rainfall must be greater than or equal to 0.")
    private Double rainfallMm;

    @JsonProperty("Sunlight_Hours")
    @NotNull(message = "Sunlight hours are required.")
    @PositiveOrZero(message = "Sunlight hours must be greater than or equal to 0.")
    private Double sunlightHours;

    @JsonProperty("Wind_Speed_kmh")
    @NotNull(message = "Wind speed is required.")
    @PositiveOrZero(message = "Wind speed must be greater than or equal to 0.")
    private Double windSpeedKmh;

    @JsonProperty("Field_Area_hectare")
    @NotNull(message = "Field area is required.")
    @PositiveOrZero(message = "Field area must be greater than or equal to 0.")
    private Double fieldAreaHectare;

    @JsonProperty("Previous_Irrigation_mm")
    @NotNull(message = "Previous irrigation is required.")
    @PositiveOrZero(message = "Previous irrigation must be greater than or equal to 0.")
    private Double previousIrrigationMm;

    @JsonProperty("Soil_Type")
    @NotBlank(message = "Soil type is required.")
    private String soilType;

    @JsonProperty("Crop_Type")
    @NotBlank(message = "Crop type is required.")
    private String cropType;

    @JsonProperty("Crop_Growth_Stage")
    @NotBlank(message = "Crop growth stage is required.")
    private String cropGrowthStage;

    @JsonProperty("Season")
    @NotBlank(message = "Season is required.")
    private String season;

    @JsonProperty("Irrigation_Type")
    @NotBlank(message = "Irrigation type is required.")
    private String irrigationType;

    @JsonProperty("Water_Source")
    @NotBlank(message = "Water source is required.")
    private String waterSource;

    @JsonProperty("Mulching_Used")
    @NotBlank(message = "Mulching used is required.")
    private String mulchingUsed;

    @JsonProperty("Region")
    @NotBlank(message = "Region is required.")
    private String region;

    public Double getSoilPH() {
        return soilPH;
    }

    public void setSoilPH(Double soilPH) {
        this.soilPH = soilPH;
    }

    public Double getSoilMoisture() {
        return soilMoisture;
    }

    public void setSoilMoisture(Double soilMoisture) {
        this.soilMoisture = soilMoisture;
    }

    public Double getOrganicCarbon() {
        return organicCarbon;
    }

    public void setOrganicCarbon(Double organicCarbon) {
        this.organicCarbon = organicCarbon;
    }

    public Double getElectricalConductivity() {
        return electricalConductivity;
    }

    public void setElectricalConductivity(Double electricalConductivity) {
        this.electricalConductivity = electricalConductivity;
    }

    public Double getTemperatureC() {
        return temperatureC;
    }

    public void setTemperatureC(Double temperatureC) {
        this.temperatureC = temperatureC;
    }

    public Double getHumidity() {
        return humidity;
    }

    public void setHumidity(Double humidity) {
        this.humidity = humidity;
    }

    public Double getRainfallMm() {
        return rainfallMm;
    }

    public void setRainfallMm(Double rainfallMm) {
        this.rainfallMm = rainfallMm;
    }

    public Double getSunlightHours() {
        return sunlightHours;
    }

    public void setSunlightHours(Double sunlightHours) {
        this.sunlightHours = sunlightHours;
    }

    public Double getWindSpeedKmh() {
        return windSpeedKmh;
    }

    public void setWindSpeedKmh(Double windSpeedKmh) {
        this.windSpeedKmh = windSpeedKmh;
    }

    public Double getFieldAreaHectare() {
        return fieldAreaHectare;
    }

    public void setFieldAreaHectare(Double fieldAreaHectare) {
        this.fieldAreaHectare = fieldAreaHectare;
    }

    public Double getPreviousIrrigationMm() {
        return previousIrrigationMm;
    }

    public void setPreviousIrrigationMm(Double previousIrrigationMm) {
        this.previousIrrigationMm = previousIrrigationMm;
    }

    public String getSoilType() {
        return soilType;
    }

    public void setSoilType(String soilType) {
        this.soilType = soilType;
    }

    public String getCropType() {
        return cropType;
    }

    public void setCropType(String cropType) {
        this.cropType = cropType;
    }

    public String getCropGrowthStage() {
        return cropGrowthStage;
    }

    public void setCropGrowthStage(String cropGrowthStage) {
        this.cropGrowthStage = cropGrowthStage;
    }

    public String getSeason() {
        return season;
    }

    public void setSeason(String season) {
        this.season = season;
    }

    public String getIrrigationType() {
        return irrigationType;
    }

    public void setIrrigationType(String irrigationType) {
        this.irrigationType = irrigationType;
    }

    public String getWaterSource() {
        return waterSource;
    }

    public void setWaterSource(String waterSource) {
        this.waterSource = waterSource;
    }

    public String getMulchingUsed() {
        return mulchingUsed;
    }

    public void setMulchingUsed(String mulchingUsed) {
        this.mulchingUsed = mulchingUsed;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }
}