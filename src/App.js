import { useState, useEffect } from "react";

function FilterableImageLoader({ images }) {
  const [filterText, setFilterText] = useState("");

  return (
    <div>
      <SearchBar filterText={filterText} onFilterTextChange={setFilterText} />
      <Images images={images} filterText={filterText} />
    </div>
  );
}
function Images({ filterText }) {
  const [images, setImages] = useState([]);
  const YOUR_ACCESS_KEY = "eupMYpd7d9Rbvo4SbiQWpOP7dTGyOVv4P19tLFVGfgU";
  const toggle = true;
  useEffect(() => {
    async function fetchUnsplashImages() {
      try {
        const response = await fetch(
          `https://api.unsplash.com/photos/?client_id=${YOUR_ACCESS_KEY}&query=random&count=10  `
        );

        if (!response.ok) {
          throw new Error("Network error");
        }

        const data = await response.json();
        setImages(data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }
    fetchUnsplashImages();
  }, []);

  const filteredImages = images.filter((image) =>
    image.slug.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div>
      {toggle ? (
        <div className="image-container">
          {filteredImages.map((image, index) => (
            <img
              key={index}
              src={image.urls.regular}
              alt={image.slug}
              className="image"
            />
          ))}
        </div>
      ) : (
        <div>Đéo có kết quả</div>
      )}
    </div>
  );
}
function SearchBar({ filterText, onFilterTextChange }) {
  return (
    <form>
      <input
        type="text"
        value={filterText}
        placeholder="Search..."
        onChange={(e) => onFilterTextChange(e.target.value)}
      />
    </form>
  );
}
export default function App() {
  return <FilterableImageLoader />;
}
