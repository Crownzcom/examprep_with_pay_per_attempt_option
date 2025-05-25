import React, { useRef, useState, useEffect } from "react";

const GraphCanvas = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [isStraightLineMode, setIsStraightLineMode] = useState(false);
  const [isEraserMode, setIsEraserMode] = useState(false);
  const [isTextMode, setIsTextMode] = useState(false);
  const [isPlottingMode, setIsPlottingMode] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const [text, setText] = useState("");
  const [textPosition, setTextPosition] = useState(null);
  const [fontSize, setFontSize] = useState(16);
  const [plotPoints, setPlotPoints] = useState([]);

  const drawGridLines = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const originalStyle = context.strokeStyle;
    const originalWidth = context.lineWidth;

    context.strokeStyle = "rgba(200, 200, 200, 0.5)";
    context.lineWidth = 0.5;

    for (let x = 0; x <= canvas.width; x += 20) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, canvas.height);
      context.stroke();
    }

    for (let y = 0; y <= canvas.height; y += 20) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(canvas.width, y);
      context.stroke();
    }

    context.strokeStyle = originalStyle;
    context.lineWidth = originalWidth;
  };

  // Function to draw a point with a circle
  const drawPoint = (x, y) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Draw outer circle
    context.beginPath();
    context.arc(x, y, 6, 0, 2 * Math.PI);
    context.strokeStyle = "black";
    context.lineWidth = 1;
    context.stroke();

    // Draw inner filled circle
    context.beginPath();
    context.arc(x, y, 3, 0, 2 * Math.PI);
    context.fillStyle = "black";
    context.fill();
  };

  // Function to redraw all points
  const redrawPoints = () => {
    plotPoints.forEach((point) => {
      drawPoint(point.x, point.y);
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 800;
    canvas.height = 600;
    const context = canvas.getContext("2d");
    context.lineWidth = 2;
    context.strokeStyle = "black";
    context.lineJoin = "round";
    context.lineCap = "round";

    drawGridLines();
  }, []);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if (e.touches && e.touches[0]) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    } else if (e.clientX && e.clientY) {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    }
    return lastPos;
  };

  const drawingRef = useRef(null);

  const startDrawing = (e) => {
    e.preventDefault();
    const pos = getPos(e);

    if (isPlottingMode) {
      // Add new point to the array and draw it
      setPlotPoints((prevPoints) => [...prevPoints, pos]);
      drawPoint(pos.x, pos.y);
      return;
    }

    if (isTextMode) {
      setTextPosition(pos);
      return;
    }

    if (isStraightLineMode) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      drawingRef.current = context.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );
      setStartPoint(pos);
    } else {
      setLastPos(pos);
      setIsDrawing(true);
    }
  };

  const draw = (e) => {
    if (!isDrawing && !startPoint && !isStraightLineMode) return;
    if (isPlottingMode) return; // Disable drawing while in plotting mode
    e.preventDefault();

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const pos = getPos(e);

    if (isStraightLineMode && startPoint) {
      if (drawingRef.current) {
        context.putImageData(drawingRef.current, 0, 0);
      }

      context.beginPath();
      context.moveTo(startPoint.x, startPoint.y);
      context.lineTo(pos.x, pos.y);
      context.stroke();
      redrawPoints(); // Ensure points stay visible
    } else if (isDrawing) {
      context.beginPath();
      context.moveTo(lastPos.x, lastPos.y);

      if (isEraserMode) {
        context.globalCompositeOperation = "destination-out";
        context.lineWidth = 20;
      } else {
        context.globalCompositeOperation = "source-over";
        context.lineWidth = 2;
      }

      context.lineTo(pos.x, pos.y);
      context.stroke();
      setLastPos(pos);
      redrawPoints(); // Ensure points stay visible
    }
  };

  const stopDrawing = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    context.globalCompositeOperation = "source-over";
    context.lineWidth = 2;

    if (isStraightLineMode && startPoint) {
      const pos = getPos(e);
      context.beginPath();
      context.moveTo(startPoint.x, startPoint.y);
      context.lineTo(pos.x, pos.y);
      context.stroke();
      drawingRef.current = null;
      redrawPoints(); // Ensure points stay visible
    }
    setIsDrawing(false);
    setStartPoint(null);
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    stopDrawing(e.changedTouches[0]);
  };

  const togglePlottingMode = () => {
    setIsPlottingMode(!isPlottingMode);
    setIsStraightLineMode(false);
    setIsEraserMode(false);
    setIsTextMode(false);
  };

  const toggleStraightLineMode = () => {
    setIsStraightLineMode(!isStraightLineMode);
    setIsEraserMode(false);
    setIsTextMode(false);
    setIsPlottingMode(false);
    setStartPoint(null);
    drawingRef.current = null;
  };

  const toggleEraserMode = () => {
    setIsEraserMode(!isEraserMode);
    setIsStraightLineMode(false);
    setIsTextMode(false);
    setIsPlottingMode(false);
  };

  const toggleTextMode = () => {
    setIsTextMode(!isTextMode);
    setIsStraightLineMode(false);
    setIsEraserMode(false);
    setIsPlottingMode(false);
  };

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawGridLines();
    drawingRef.current = null;
    setPlotPoints([]); // Clear plot points array
  };

  const addText = () => {
    if (textPosition && text) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      context.font = `${fontSize}px Arial`;
      context.fillStyle = "black";
      context.fillText(text, textPosition.x, textPosition.y);
      setText("");
      setTextPosition(null);
      setIsTextMode(false);
      redrawPoints(); // Ensure points stay visible
    }
  };

  return (
    <div className="p-4">
      <h2>Draw Your Graph</h2>
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text"
          style={{ marginRight: "10px" }}
          disabled={!isTextMode}
        />
        <input
          type="number"
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          min="8"
          max="72"
          style={{ width: "60px", marginRight: "10px" }}
          disabled={!isTextMode}
        />
        <button
          className="graph-buttons btn-sm"
          onClick={addText}
          disabled={!isTextMode || !text || !textPosition}
        >
          Add Text
        </button>
      </div>
      <canvas
        ref={canvasRef}
        style={{
          border: "1px solid black",
          cursor: isPlottingMode
            ? "crosshair"
            : isEraserMode
            ? "cell"
            : isTextMode
            ? "text"
            : "crosshair",
          touchAction: "none",
          width: "100%",
          maxWidth: "800px",
          height: "auto",
          aspectRatio: "4/3",
        }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      />
      <div style={{ marginTop: "10px" }}>
        <button className="graph-buttons btn-sm" onClick={togglePlottingMode}>
          {isPlottingMode ? "Exit Plotting Mode" : "Plot Points"}
        </button>
        <button
          className="graph-buttons btn-sm"
          onClick={toggleStraightLineMode}
        >
          {isStraightLineMode ? "Exit Line Mode" : "Draw Straight Line"}
        </button>
        <button className="graph-buttons btn-sm" onClick={toggleEraserMode}>
          {isEraserMode ? "Exit Eraser" : "Eraser"}
        </button>
        <button className="graph-buttons btn-sm" onClick={toggleTextMode}>
          {isTextMode ? "Exit Text Mode" : "Add Text"}
        </button>
        <button className="graph-buttons btn-sm" onClick={handleClearCanvas}>
          Clear
        </button>
      </div>
    </div>
  );
};

export default GraphCanvas;
