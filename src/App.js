import { useState, useEffect, useRef } from "react";

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
  const page = useRef(1);
  const loading = useRef(false);

  const loadMoreImages = async () => {
    if (loading.current) return;

    loading.current = true;

    try {
      const response = await fetch(
        `https://api.unsplash.com/photos/?client_id=${YOUR_ACCESS_KEY}&page=${page.current}&count=10`
      );

      if (!response.ok) {
        throw new Error("Network error");
      }

      const data = await response.json();
      setImages((prevImages) => [...prevImages, ...data]);
      page.current++;
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      loading.current = false;
    }
  };

  useEffect(() => {
    loadMoreImages();
  }, []);

  const filteredImages = images.filter((image) =>
    image.slug.toLowerCase().includes(filterText.toLowerCase())
  );

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      loadMoreImages();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div>
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
