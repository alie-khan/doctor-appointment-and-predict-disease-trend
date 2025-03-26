import React from 'react';

const AppointmentStatus = () => {
    const goBack = () => {
        window.history.back(); 
    };

    return (
        <div className="d-flex align-items-center justify-content-center vh-100 warning ">
            <div className="card text-center p-4 shadow" style={{ maxWidth: '500px' }}>
                <h1 className="card-title text-primary">Appointment Status</h1>
                <p className="card-text">Your Appointment Confirmed Meet Doctor</p>

                <button className="btn btn-outline-primary" onClick={goBack}>Go Back</button>
            </div>
        </div>
    );
};

export default AppointmentStatus;
