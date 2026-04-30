import React from "react";

function StarRating({ rating = 0, onRate }) {
  const [hover, setHover] = React.useState(0);

  return (
    <div style={{ fontSize: "26px", cursor: "pointer" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            color: star <= (hover || rating) ? "gold" : "gray",
          }}
          onClick={() => onRate(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default StarRating;