import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './TrainingChart.css';

function TrainingChart({ data }) {
    if (!data || data.length === 0) {
        return (
            <div className="training-chart">
                <h3>Training Progress</h3>
                <div className="chart-placeholder">
                    No training data yet. Start training to see progress.
                </div>
            </div>
        );
    }

    return (
        <div className="training-chart">
            <h3>Training Progress</h3>
            <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3e3e42" />
                    <XAxis
                        dataKey="epoch"
                        stroke="#858585"
                        tick={{ fill: '#858585', fontSize: 11 }}
                    />
                    <YAxis
                        stroke="#858585"
                        tick={{ fill: '#858585', fontSize: 11 }}
                    />
                    <Tooltip
                        contentStyle={{
                            background: '#2d2d30',
                            border: '1px solid #3e3e42',
                            borderRadius: '4px',
                            color: '#d4d4d4'
                        }}
                    />
                    <Legend
                        wrapperStyle={{ fontSize: '11px', color: '#858585' }}
                    />
                    <Line
                        type="monotone"
                        dataKey="loss"
                        stroke="#f48771"
                        strokeWidth={2}
                        dot={{ fill: '#f48771', r: 3 }}
                        name="Loss"
                    />
                    <Line
                        type="monotone"
                        dataKey="accuracy"
                        stroke="#6a9955"
                        strokeWidth={2}
                        dot={{ fill: '#6a9955', r: 3 }}
                        name="Accuracy"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default TrainingChart;
