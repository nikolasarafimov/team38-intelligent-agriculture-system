import { useEffect, useState } from "react";
import "./DashboardPage.css";

function GaugeView({ value, unit, color }) {
    const safe = Math.min(100, Math.max(0, value));
    const rotation = safe / 100 / 2;
    return (
        <div className="gauge">
            <div className="gauge-body">
                <div className="gauge-fill" style={{ transform: `rotate(${rotation}turn)`, background: color }} />
                <div className="gauge-cover">{safe}{unit}</div>
            </div>
        </div>
    );
}

function MetricCard({ label, value, unit, fillPercent, color, type = "bar" }) {
    const renderContent = () => {
        switch (type) {
            case "gauge":
                return <GaugeView value={value} unit={unit} color={color} />;
            case "text":
                return <p className="metric-value">{value}<span className="metric-unit">{unit}</span></p>;
            case "bar":
            default:
                return (
                    <>
                        <p className="metric-value">{value}<span className="metric-unit">{unit}</span></p>
                        <div className="metric-bar">
                            <div className="metric-fill" style={{ width: `${Math.min(100, fillPercent)}%`, background: color }} />
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
    if (d.soil_Moisture < 40) return "* Итно е потребно наводнување";
    if (d.soil_Moisture < 60 && d.temperature_C > 25) return "* Препорачано е умерено наводнување";
    if (d.rainfall_mm > 15) return "* Има доволно врнежи, не е потребно наводнување";
    return "* Нема потреба од наводнување";
}

function computedScores(d) {
    const waterBalance = (d.soil_Moisture * 0.5 + d.rainfall_mm * 2 - d.temperature_C * 1.2 - d.wind_Speed_kmh * 0.5) / 100 * 100;
    const soilQuality = (100 - Math.abs(6.5 - d.soil_pH) * 20 + d.organic_Carbon * 40 - d.electrical_Conductivity * 15);
    return {
        waterBalance: Math.max(0, Math.min(100, waterBalance)),
        soilQuality: Math.max(0, Math.min(100, soilQuality)),
    };
}

function parseCSV(text) {
    const [headerLine, ...rows] = text.trim().split("\n");
    const headers = headerLine.split(",");
    return rows.map(row => {
        const values = row.split(",");
        const obj = {};
        headers.forEach((h, i) => {
            const v = values[i];
            obj[h.trim()] = isNaN(v) ? v?.trim() : parseFloat(v);
        });
        return obj;
    });
}

function toD(obj) {
    return {
        soil_pH: obj.Soil_pH,
        soil_Moisture: obj.Soil_Moisture,
        organic_Carbon: obj.Organic_Carbon,
        electrical_Conductivity: obj.Electrical_Conductivity,
        temperature_C: obj.Temperature_C,
        humidity: obj.Humidity,
        rainfall_mm: obj.Rainfall_mm,
        sunlight_Hours: obj.Sunlight_Hours,
        wind_Speed_kmh: obj.Wind_Speed_kmh,
        field_Area_hectare: obj.Field_Area_hectare,
        previous_Irrigation_mm: obj.Previous_Irrigation_mm,
        soil_Type: obj.Soil_Type,
        crop_Type: obj.Crop_Type,
        crop_Growth_Stage: obj.Crop_Growth_Stage,
        season: obj.Season,
        irrigation_Type: obj.Irrigation_Type,
        water_Source: obj.Water_Source,
        mulching_Used: obj.Mulching_Used,
        region: obj.Region,
    };
}

const FILTER_FIELDS = [
    { key: "Crop_Type",        label: "Култура" },
    { key: "Soil_Type",        label: "Тип на почва" },
    { key: "Season",           label: "Сезона" },
    { key: "Region",           label: "Регион" },
    { key: "Irrigation_Type",  label: "Наводнување" },
];

export default function Dashboard() {
    const [allRows, setAllRows] = useState([]);
    const [filters, setFilters] = useState({});
    const [d, setD] = useState(null);

    useEffect(() => {
        fetch("/irrigation_prediction.csv")
            .then(res => res.text())
            .then(text => {
                const rows = parseCSV(text);
                setAllRows(rows);
                // default: random row
                const random = rows[Math.floor(Math.random() * rows.length)];
                setD(toD(random));
            });
    }, []);

    // unique values for each filter dropdown
    const options = {};
    FILTER_FIELDS.forEach(({ key }) => {
        options[key] = ["", ...new Set(allRows.map(r => r[key]))].filter(Boolean);
        options[key].unshift("");
    });

    const handleFilter = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        if (!value) delete newFilters[key];
        setFilters(newFilters);

        const matched = allRows.filter(row =>
            Object.entries(newFilters).every(([k, v]) => row[k] === v)
        );
        if (matched.length > 0) {
            const pick = matched[Math.floor(Math.random() * matched.length)];
            setD(toD(pick));
        }
    };

    if (!d) return <div className="dashboard">Loading...</div>;

    const scores = computedScores(d);

    return (
        <div className="dashboard">

            <div className="filter-bar">
                {FILTER_FIELDS.map(({ key, label }) => (
                    <select
                        key={key}
                        value={filters[key] || ""}
                        onChange={e => handleFilter(key, e.target.value)}
                        className="filter-select"
                    >
                        <option value="">{label}</option>
                        {[...new Set(allRows.map(r => r[key]))].sort().map(v => (
                            <option key={v} value={v}>{v}</option>
                        ))}
                    </select>
                ))}
            </div>

            {/* rest of your JSX unchanged below */}
            <section>
                <h3 className="section-label">Агрегатни индикатори</h3>
                <div className="metrics-grid">
                    <MetricCard label="Water Balance" value={scores.waterBalance.toFixed(1)} unit="%" fillPercent={scores.waterBalance} color="#1D9E75" type="gauge" />
                    <MetricCard label="Soil Quality"  value={scores.soilQuality.toFixed(1)}  unit="%" fillPercent={scores.soilQuality}  color="#639922" type="gauge" />
                </div>
            </section>

            <section>
                <h3 className="section-label">Состојба на почва</h3>
                <div className="metrics-grid">
                    <MetricCard label="pH вредност"          value={d.soil_pH}                  unit=""       fillPercent={d.soil_pH * 10}                  color="#639922" />
                    <MetricCard label="Влажност"              value={d.soil_Moisture}             type="gauge"  unit="%"    fillPercent={d.soil_Moisture}           color="#1D9E75" />
                    <MetricCard label="Температура"           value={d.temperature_C}             unit="°C"     fillPercent={d.temperature_C / 50 * 100}       color="#D85A30" />
                    <MetricCard label="Органски јаглерод"    value={d.organic_Carbon}            unit="%"      fillPercent={d.organic_Carbon * 20}            color="#888780" />
                    <MetricCard label="Ел. спроводливост"    value={d.electrical_Conductivity}   unit=" dS/m"  fillPercent={d.electrical_Conductivity * 20}   color="#378ADD" />
                </div>
            </section>

            <section>
                <h3 className="section-label">Временски услови</h3>
                <div className="metrics-grid">
                    <MetricCard label="Врнежи"               value={d.rainfall_mm}     unit=" mm"    fillPercent={Math.min(100, d.rainfall_mm / 5)}     color="#378ADD" />
                    <MetricCard label="Влажност на воздух"   value={d.humidity}        unit="%"      fillPercent={d.humidity}                           color="#1D9E75" />
                    <MetricCard label="Сончеви часови"       value={d.sunlight_Hours}  unit=" h"     fillPercent={d.sunlight_Hours / 12 * 100}          color="#EF9F27" />
                    <MetricCard label="Брзина на ветер"      value={d.wind_Speed_kmh}  unit=" km/h"  fillPercent={d.wind_Speed_kmh / 50 * 100}          color="#888780" />
                </div>
            </section>

            <div className="recommendation">
                {getIrrigationRecommendations(d)}
            </div>

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