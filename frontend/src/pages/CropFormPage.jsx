/* name, type, planting date*/

import {useState} from "react";

export default function CropForm(){
    const [formData,setFormData]=useState({
        name: "",
        type: "",
        plantingDate: "",
    });

    const handleChange = (e) => {
        const {name,value} = e.target;
        setFormData((prev) => ({...prev, [name]:value}));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Име на растение:</label>
                <input class="form-control" type="text" value={formData.name} onChange={handleChange}/>
            </div>

            <div className="form-group">
                <label>Тип на растение:</label>
                <input class="form-control" type="text" value={formData.type} onChange={handleChange}/>
            </div>

            <div className="form-group">
                <label>Датум на засадување:</label>
                <input class="form-control" type="date" value={formData.plantingDate} onChange={handleChange}></input>
            </div>

            <div>
            <button type="submit" className="btn mt-4 btn-secondary mb-2">Внеси</button>
            </div>
        </form>
    )
}