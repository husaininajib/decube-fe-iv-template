import Link from "next/link";

interface MovieDetails {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection?: {
    id: number;
    name: string;
    poster_path: string;
  };
  budget: number;
  genres: { id: number; name: string }[]; // Array of Genre objects
  homepage?: string; // Optional property for homepage
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: {
    id: number;
    logo_path: string;
    name: string;
    origin_country: string;
  }[]; // Array of ProductionCompany objects
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[]; // Array of ProductionCountry objects
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[]; // Array of SpokenLanguage objects
  status: string;
  tagline?: string; // Optional property for tagline
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export default function SingleMovieDetails({
  movieDetails,
  error,
}: {
  movieDetails: MovieDetails;
  error: string;
}) {
  // if (!movieDetails) {
  //   return <div>loading...</div>
  // }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="w-3/4 mx-auto">
      <Link href={"/"}>
        <button className="bg-red-400 p-2">Back</button>
      </Link>
      <h2 className="mt-8 font-bold">{movieDetails?.title}</h2>

      <div>
        {movieDetails?.spoken_languages.length > 0 && (
          <>
            <p className="font-semibold">spoken language:-</p>
            <ul>
              {movieDetails.spoken_languages.map((lang, i) => (
                <li key={i}>
                  {i + 1}. {lang.name}
                </li>
              ))}
            </ul>
          </>
        )}

        <ul>
          <li>Release date: {movieDetails?.release_date}</li>
        </ul>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const { movieId } = context.query;

  try {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
      },
    };
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
      options
    );

    if (!res.ok) {
      throw new Error("somerthing went wrong");
    }
    const data = await res.json();

    return {
      props: {
        movieDetails: data,
      },
    };
  } catch (err) {
    return {
      props: {
        error: "something went wrong",
      },
    };
  }
}
