package mk.ukim.team38.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class RecommendationRequest {

    @NotBlank(message = "Crop type is required.")
    private String cropType;

    @NotBlank(message = "Soil type is required.")
    private String soilType;

    @NotNull(message = "Temperature is required.")
    private Double temperature;

    @NotNull(message = "Humidity is required.")
    private Double humidity;

    @NotNull(message = "Rainfall is required.")
    private Double rainfall;

    public String getCropType() {
        return cropType;
    }

    public String getSoilType() {
        return soilType;
    }

    public Double getTemperature() {
        return temperature;
    }

    public Double getHumidity() {
        return humidity;
    }

    public Double getRainfall() {
        return rainfall;
    }

    public void setCropType(String cropType) {
        this.cropType = cropType;
    }

    public void setSoilType(String soilType) {
        this.soilType = soilType;
    }

    public void setTemperature(Double temperature) {
        this.temperature = temperature;
    }

    public void setHumidity(Double humidity) {
        this.humidity = humidity;
    }

    public void setRainfall(Double rainfall) {
        this.rainfall = rainfall;
    }
}