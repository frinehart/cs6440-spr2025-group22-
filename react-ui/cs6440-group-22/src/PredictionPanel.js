<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 171dee88538350c8f90945dfd4da50625dc3d52e
import React, { useState } from "react";

const PredictionPanel = () => {
  const [predictions] = useState([]);

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px", marginTop: "30px" }}>
      <h3 style={{ textAlign: "center" }}>Prediction Tools</h3>

      {/* Section: Flu Type & Region Descriptions */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <h4>🧬 Flu Type Descriptions</h4>
        <p><strong>INF_A:</strong> A seasonal flu virus that tends to be widespread and more serious, often driving major outbreaks.</p>
        <p><strong>INF_B:</strong> Typically causes smaller-scale flu activity, seen in more limited, regional patterns.</p>
        <p><strong>INF_ALL:</strong> Reflects the combined number of cases from both Flu A and Flu B.</p>
        <p><strong>RSV:</strong> A virus that primarily affects the respiratory system, especially in infants and older adults.</p>
        <p><strong>OtherRespVirus:</strong> Includes other tracked respiratory viruses that don’t fall under the main flu categories.</p>

        <h4 style={{ marginTop: "30px" }}>🌍 Region Descriptions (WHO)</h4>
        <p><strong>AFR:</strong> African Region</p>
        <p><strong>AMR:</strong> Region of the Americas</p>
        <p><strong>EMR:</strong> Eastern Mediterranean Region</p>
        <p><strong>EUR:</strong> European Region</p>
        <p><strong>SEAR:</strong> South-East Asia Region</p>
        <p><strong>WPR:</strong> Western Pacific Region</p>
      </div>

      {/* Section: Prediction Insight Tip */}
      <div style={{
        marginTop: "30px",
        background: "#f9f9f9",
        padding: "20px",
        borderRadius: "6px",
        textAlign: "center",
        boxShadow: "0 0 5px rgba(0, 0, 0, 0.05)"
      }}>
        <h4>📊 Prediction Insight</h4>
        <p>
          Predictions use past data to estimate future trends based on region, week, and flu type.
          Flu A tends to rise in colder weather, while RSV may increase mid-season.
        </p>
        <p style={{ fontStyle: "italic", color: "#555" }}>
          Example: A spike in RSV in the European region during Week 50 may reflect holiday-related spread.
        </p>
      </div>

      {/* Section: Prediction History */}
      {predictions.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <h4>📁 Prediction History</h4>
          <ul>
            {predictions.map((p, idx) => (
              <li key={idx}>
                <strong>{p.label}</strong>: <span>{p.value.toLocaleString()} cases</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PredictionPanel;

<<<<<<< HEAD
=======

=======
import React, { useState } from "react";

const PredictionPanel = () => {
  const [predictions] = useState([]);

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px", marginTop: "30px" }}>
      <h3 style={{ textAlign: "center" }}>Prediction Tools</h3>

      {/* Section: Flu Type & Region Descriptions */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <h4>🧬 Flu Type Descriptions</h4>
        <p><strong>INF_A:</strong> A seasonal flu virus that tends to be widespread and more serious, often driving major outbreaks.</p>
        <p><strong>INF_B:</strong> Typically causes smaller-scale flu activity, seen in more limited, regional patterns.</p>
        <p><strong>INF_ALL:</strong> Reflects the combined number of cases from both Flu A and Flu B.</p>
        <p><strong>RSV:</strong> A virus that primarily affects the respiratory system, especially in infants and older adults.</p>
        <p><strong>OtherRespVirus:</strong> Includes other tracked respiratory viruses that don’t fall under the main flu categories.</p>

        <h4 style={{ marginTop: "30px" }}>🌍 Region Descriptions (WHO)</h4>
        <p><strong>AFR:</strong> African Region</p>
        <p><strong>AMR:</strong> Region of the Americas</p>
        <p><strong>EMR:</strong> Eastern Mediterranean Region</p>
        <p><strong>EUR:</strong> European Region</p>
        <p><strong>SEAR:</strong> South-East Asia Region</p>
        <p><strong>WPR:</strong> Western Pacific Region</p>
      </div>

      {/* Section: Prediction Insight Tip */}
      <div style={{
        marginTop: "30px",
        background: "#f9f9f9",
        padding: "20px",
        borderRadius: "6px",
        textAlign: "center",
        boxShadow: "0 0 5px rgba(0, 0, 0, 0.05)"
      }}>
        <h4>📊 Prediction Insight</h4>
        <p>
          Predictions use past data to estimate future trends based on region, week, and flu type.
          Flu A tends to rise in colder weather, while RSV may increase mid-season.
        </p>
        <p style={{ fontStyle: "italic", color: "#555" }}>
          Example: A spike in RSV in the European region during Week 50 may reflect holiday-related spread.
        </p>
      </div>

      {/* Section: Prediction History */}
      {predictions.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <h4>📁 Prediction History</h4>
          <ul>
            {predictions.map((p, idx) => (
              <li key={idx}>
                <strong>{p.label}</strong>: <span>{p.value.toLocaleString()} cases</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PredictionPanel;


>>>>>>> 8934f0ea17ff472dc4f3935e22acf817b327d842
>>>>>>> 171dee88538350c8f90945dfd4da50625dc3d52e
