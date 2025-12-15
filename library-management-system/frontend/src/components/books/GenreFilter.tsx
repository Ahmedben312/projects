import React from "react";

interface GenreFilterProps {
  genres: string[];
  selectedGenre: string;
  onSelectGenre: (genre: string) => void;
}

const GenreFilter: React.FC<GenreFilterProps> = ({
  genres,
  selectedGenre,
  onSelectGenre,
}) => {
  // Remove duplicates by creating a Set and then converting back to array
  const uniqueGenres = React.useMemo(() => {
    return [...new Set(genres)].filter(Boolean); // Filter out any empty strings
  }, [genres]);

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        key="all"
        className={`px-4 py-2 rounded-full text-sm font-medium ${
          selectedGenre === "all"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
        }`}
        onClick={() => onSelectGenre("all")}
      >
        All Genres
      </button>
      {uniqueGenres.map((genre) => (
        <button
          key={genre}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            selectedGenre === genre
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
          onClick={() => onSelectGenre(genre)}
        >
          {genre}
        </button>
      ))}
    </div>
  );
};

export default GenreFilter;
