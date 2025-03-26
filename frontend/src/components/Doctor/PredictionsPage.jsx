import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { MenuItem, Select, Button, Card, CardContent, Typography, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

const PredictionPage = () => {
  const [disease, setDisease] = useState("");
  const [diseaseList, setDiseaseList] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDiseases = async () => {
      try {
        const response = await axios.get("http://localhost:3000/doctor/diseases");
        setDiseaseList(response.data);
      } catch (err) {
        console.error("Error fetching diseases:", err);
      }
    };
    fetchDiseases();
  }, []);

  const handlePredict = async () => {
    if (!disease) {
      setError("Please select a disease.");
      return;
    }
    setError("");

    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", { disease });
      console.log("API Response:", response.data);

      const formattedData = response.data.map((p) => {
        const date = new Date(p.ds);
        const formattedDate = `${date.getFullYear()} - ${date.toLocaleString('default', { month: 'long' })}`;
        let predictedValue = Math.max(0, Math.round(p.yhat));
        return { ds: formattedDate, yhat: predictedValue };
      });

      setPredictions(formattedData);
    } catch (err) {
      setError(err.response?.data?.error || "Error fetching predictions");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <Card className="w-full max-w-xl shadow-lg">
        <CardContent>
          <Typography variant="h4" className="mb-4 mt-3 text-center text-blue-600 font-bold">
            Disease Prediction
          </Typography>

          <div className="flex gap-3 mb-4">
            <Select fullWidth value={disease} onChange={(e) => setDisease(e.target.value)} displayEmpty>
              <MenuItem value="" disabled>Select a Disease</MenuItem>
              {diseaseList.map((d, index) => (
                <MenuItem key={index} value={d.disease_name}>{d.disease_name}</MenuItem>
              ))}
            </Select>
            <Button className="mt-3" variant="contained" color="primary" onClick={handlePredict}>
              Predict
            </Button>
          </div>

          {error && <Typography color="error">{error}</Typography>}

          {predictions.length > 0 && (
            <>
              <Typography variant="h4" className="mt-8 text-blue-500 font-semibold">
                Prediction Graph
              </Typography>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-64 mt-4">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={predictions}>
                    <XAxis dataKey="ds" tickFormatter={(date) => date} />
                    <YAxis />
                    <Tooltip />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Line type="monotone" dataKey="yhat" stroke="#007bff" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>

              <Typography variant="h4" className="mt-5 mb-2 text-blue-500 font-semibold">
                Prediction Results
              </Typography>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Table>
                  <TableHead>
                    <TableRow className="bg-blue-100">
                      <TableCell>Year - Month</TableCell>
                      <TableCell>Predicted Cases</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {predictions.map((p, index) => (
                      <TableRow key={index}>
                        <TableCell>{p.ds}</TableCell>
                        <TableCell>{p.yhat}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </motion.div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PredictionPage;