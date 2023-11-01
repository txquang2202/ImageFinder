import { useState, useEffect, useRef } from "react";

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("random");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
    setQuery("");
  };

  return (
    <form onSubmit={handleSearchSubmit} className="search">
      <input
        type="text"
        value={query}
        placeholder="Search..."
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit" class="searchButton">
        Search
      </button>
    </form>
  );
}

function Images({ queryText, key }) {
  const [images, setImages] = useState([]);
  const YOUR_ACCESS_KEY = "-toNEvxV5hfS1hX3aNk6doP46p1L1eTqU3rj7VXxBg8";
  const page = useRef(1);
  const loading = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const loadMoreImages = async () => {
    const query = queryText;
    if (loading.current || isLoading) return;
    console.log(query);
    loading.current = true;
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos/?client_id=${YOUR_ACCESS_KEY}&page=${page.current}&query=${query}`
      );

      const data = await response.json();
      setImages((prevImages) => [...prevImages, ...data.results]);
      page.current++;
      if (data.results.length === 0) {
        setNotFound(true);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      loading.current = false;
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMoreImages();
  }, [queryText, key]);
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100
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
        {images.map((image, index) => (
          <img
            key={index}
            src={image.urls.regular}
            alt={image.slug}
            className="image"
          />
        ))}
      </div>
      {notFound ? <div className="not-found">No Result</div> : null}
      {isLoading && <div className="loading">LOADING.....</div>}
    </div>
  );
}

function FilterableImageLoader({ images }) {
  const [query, setQuery] = useState("random");
  const [key, setKey] = useState(0);

  const handleSearch = (newQuery) => {
    setQuery(newQuery);
    setKey((prevKey) => prevKey + 1);
  };

  return (
    <div>
      <div className="container">
        <h1 className="title"> Image Finder</h1>
        <SearchBar query={query} onSearch={handleSearch} />
        <div className="list-images">
          <Images images={images} queryText={query} key={key} />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return <FilterableImageLoader />;
}
