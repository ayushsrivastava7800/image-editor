import React, { useState, useEffect } from "react";
import * as fabric  from "fabric";

const App = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const UNSPLASH_API_KEY = "YOUR_UNSPLASH_API_KEY";

  const fetchImages = async (query) => {
    if (!query.trim()) {
      alert("Please enter a search term.");
      return;
    }

    try {
      const response = await fetch(
       "https://api.unsplash.com/search/photos?page=1&query=office&client_id=BxoDVvjOdcXHhbTUmZV1B8yzuXLuvucDB6wHHzTYuNk"
      );
      const data = await response.json();
      setImages(data.results);
    } catch (error) {
      console.error("Error fetching images:", error);
      alert("Failed to fetch images. Check your API key or internet connection.");
    }
  };

  const ImageEditor = ({ imageUrl, onBack }) => {
    const [canvas, setCanvas] = useState(null);

    // Use effect to initialize canvas only once and dispose of it when unmounting or imageUrl changes
    useEffect(() => {
      const canvasInstance = new fabric.Canvas("canvas");

      // Initialize image on canvas
      fabric.Image.fromURL(imageUrl, (img) => {
        img.set({ left: 50, top: 50 });
        canvasInstance.add(img);
      });

      setCanvas(canvasInstance); // Store the canvas instance

      // Cleanup function to dispose of the canvas when unmounting or before reinitializing
      return () => {
        canvasInstance.dispose(); // Dispose of the canvas
      };
    }, [imageUrl]); // Re-run effect when imageUrl changes

    const addCaption = () => {
      if (canvas) {
        const caption = new fabric.Textbox("Add your caption here", {
          left: 50,
          top: 300,
          fontSize: 20,
          fill: "black",
          width: 400,
        });
        canvas.add(caption);
      }
    };

    const downloadCanvas = () => {
      if (canvas) {
        const link = document.createElement("a");
        link.download = "edited-image.png";
        link.href = canvas.toDataURL();
        link.click();
      }
    };

    return (
      <div style={{ padding: "20px" }}>
        <h2>Image Editor</h2>
        <canvas
          id="canvas"
          width="800"
          height="400"
          style={{ border: "1px solid #ccc" }}
        ></canvas>
        <div style={{ marginTop: "10px" }}>
          <button onClick={addCaption}>Add Caption</button>
          <button onClick={downloadCanvas}>Download</button>
          <button onClick={onBack}>Back to Search</button>
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Image Search and Editor</h1>

      {!selectedImage ? (
        <div>
          <input
            type="text"
            placeholder="Search for images"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={() => fetchImages(searchQuery)}>Search</button>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              marginTop: "10px",
            }}
          >
            {images.map((image) => (
              <img
                key={image.id}
                src={image.urls.small}
                alt={image.alt_description || "Image"}
                style={{ width: "150px", cursor: "pointer" }}
                onClick={() => {
                  setSelectedImage(image.urls.full);
                }}
              />
            ))}
          </div>
        </div>
      ) : (
        <ImageEditor
          imageUrl={selectedImage}
          onBack={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
};

export default App;