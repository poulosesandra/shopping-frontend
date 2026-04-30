import React from "react";

function OrderTimeline({ order }) {
  const steps = ["Placed", "Packed", "Shipped", "Delivered"];

  const currentStatus = order?.status || "Placed"; 
  // default fallback instead of showing loading text

  const getColor = (step) => {
    const currentIndex = steps.indexOf(currentStatus);
    const stepIndex = steps.indexOf(step);

    if (stepIndex < currentIndex) return "green";
    if (stepIndex === currentIndex) return "blue";
    return "gray";
  };

  return (
    <div style={{ marginTop: "10px" }}>
      <h4>Order Tracking</h4>

      <div style={{ display: "flex", gap: "15px" }}>
        {steps.map((step, index) => (
          <div key={index} style={{ textAlign: "center" }}>
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                backgroundColor: getColor(step),
                margin: "auto",
              }}
            ></div>

            <p style={{ color: getColor(step), margin: 0 }}>
              {step}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
export default OrderTimeline;