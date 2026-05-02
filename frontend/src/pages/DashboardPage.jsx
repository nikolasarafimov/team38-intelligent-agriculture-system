import "./DashboardPage.css";
const mockData = {
    soil_pH: 6.5,
    soil_Moisture: 45.0,
    organic_Carbon: 0.8,
    electrical_Conductivity: 1.2,
    temperature_C: 28.0,
    humidity: 60.0,
    rainfall_mm: 10.0,
    sunlight_Hours: 8.0,
    wind_Speed_kmh: 12.0,
    field_Area_hectare: 2.5,
    previous_Irrigation_mm: 5.0,
    soil_Type: "Loamy",
    crop_Type: "Wheat",
    crop_Growth_Stage: "Vegetative",
    season: "Summer",
    irrigation_Type: "Drip",
    water_Source: "Well",
    mulching_Used: "Yes",
    region: "Southern Europe",
};

function GaugeView({ value, unit, color }) {
    const safe = Math.min(100, Math.max(0, value));
    const rotation = safe / 100 / 2;

    return (
        <div className="gauge">
            <div className="gauge-body">
                <div
                    className="gauge-fill"
                    style={{
                        transform: `rotate(${rotation}turn)`,
                        background: color
                    }}
                />
                <div className="gauge-cover">
                    {safe}{unit}
                </div>
            </div>
        </div>
    );
}

function MetricCard({
                        label,
                        value,
                        unit,
                        fillPercent,
                        color,
                        type = "bar"
                    }) {

    const renderContent = () => {
        switch (type) {
            case "gauge":
                return <GaugeView value={value} unit={unit} color={color} />;

            case "circle":
                return <CircleView value={value} unit={unit} color={color} />;

            case "text":
                return (
                    <p className="metric-value">
                        {value}<span className="metric-unit">{unit}</span>
                    </p>
                );

            case "bar":
            default:
                return (
                    <>
                        <p className="metric-value">
                            {value}<span className="metric-unit">{unit}</span>
                        </p>
                        <div className="metric-bar">
                            <div
                                className="metric-fill"
                                style={{
                                    width: `${fillPercent}%`,
                                    background: color
                                }}
                            />
                        </div>
                    </>
                );
        }
    };

    return (
        <div className="metric-card">
            <p className="metric-label">{label}</p>
            {renderContent()}
        </div>
    );
}

function getIrrigationRecommendations(d) {
    if (d.soil_Moisture < 40)
    {
        return "Итно е потребно наводнување"
    }
    if (d.soil_Moisture < 60 && d.temperature_C > 25)
    {
        return "Препорачано е умерено наводнување"
    }
    if (d.rainfall_mm > 15)
    {
        return "Има доволно врнежи, не е потребно наводнување"
    }
    return "Нема потреба од наводнување"
}

function computedScores(d){
    const waterBalance =
        d.soil_Moisture * 0.5 +
        d.rainfall_mm * 2 -
        d.temperature_C * 1.2 -
        d.wind_Speed_kmh * 0.5;

    return {
        waterBalance
    };

}

export default function Dashboard() {
    const d = mockData;
    const scores = computedScores(d);
    return (
        <div className="dashboard">

            <section>
                <h3 className="section-label">Агрегатни индикатори</h3>
                <div className="metrics-grid">

                    <MetricCard
                        label="🌱 Water Balance"
                        value={scores.waterBalance.toFixed(1)}
                        unit="%"
                        fillPercent={scores.waterBalance}
                        color="#1D9E75"
                        type="gauge"
                    />



                </div>
            </section>


            <section>
                <h3 className="section-label">Состојба на почва</h3>
                <div className="metrics-grid">
                    <MetricCard label="pH вредност"         value={d.soil_pH}                unit=""      fillPercent={d.soil_pH * 10}       color="#639922" />
                    <MetricCard label="Влажност"             value={d.soil_Moisture}          type="gauge" unit="%"     fillPercent={d.soil_Moisture}       color="#1D9E75" />
                    <MetricCard label="Температура"          value={d.temperature_C}          unit="°C"    fillPercent={d.temperature_C / 50 * 100} color="#D85A30" />
                    <MetricCard label="Органски јаглерод"   value={d.organic_Carbon}         unit="%"     fillPercent={d.organic_Carbon * 20} color="#888780" />
                    <MetricCard label="Ел. спроводливост"   value={d.electrical_Conductivity} unit=" dS/m" fillPercent={d.electrical_Conductivity * 20} color="#378ADD" />
                </div>

                <div className="recommendation">
                    {getIrrigationRecommendations(d)}
                </div>
            </section>

            <section>
                <h3 className="section-label">Временски услови</h3>
                <div className="metrics-grid">
                    <MetricCard label="Врнежи"              value={d.rainfall_mm}    unit=" mm"   fillPercent={d.rainfall_mm * 2}    color="#378ADD" />
                    <MetricCard label="Влажност на воздух"  value={d.humidity}       unit="%"     fillPercent={d.humidity}           color="#1D9E75" />
                    <MetricCard label="Сончеви часови"      value={d.sunlight_Hours} unit=" h"    fillPercent={d.sunlight_Hours / 12 * 100} color="#EF9F27" />
                    <MetricCard label="Брзина на ветер"     value={d.wind_Speed_kmh} unit=" km/h" fillPercent={d.wind_Speed_kmh / 50 * 100} color="#888780" />
                </div>
            </section>

            <section>
                <h3 className="section-label">Култура и парцела</h3>
                <div className="cards-grid">
                    <div className="card">
                        <h4>Информации за култура</h4>
                        <div className="row"><span>Вид</span><span>{d.crop_Type}</span></div>
                        <div className="row"><span>Фаза на раст</span><span>{d.crop_Growth_Stage}</span></div>
                        <div className="row"><span>Сезона</span><span>{d.season}</span></div>
                    </div>
                    <div className="card">
                        <h4>Информации за парцела</h4>
                        <div className="row"><span>Тип на почва</span><span>{d.soil_Type}</span></div>
                        <div className="row"><span>Површина</span><span>{d.field_Area_hectare} ha</span></div>
                        <div className="row"><span>Наводнување</span><span>{d.irrigation_Type}</span></div>
                        <div className="row"><span>Извор на вода</span><span>{d.water_Source}</span></div>
                        <div className="row"><span>Малчирање</span><span>{d.mulching_Used}</span></div>
                    </div>
                </div>
            </section>

        </div>
    );
}