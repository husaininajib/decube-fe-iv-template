import { Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });
const cn = (...classes: string[]) => classes.filter(Boolean).join(" ");

export default function Home({
  movieResponse,
  error,
}: {
  movieResponse: MovieResponse;
  error: string;
}) {
  if (error) {
    return <div>{error}</div>;
  }

  if (!movieResponse) {
    return <div>loading...</div>;
  }

  const movieList = movieResponse.results;

  return (
    <main
      className={cn(
        "min-h-screen flex flex-col items-center justify-center p-24 gap-4",
        inter.className
      )}
    >
      <div className="flex flex-wrap gap-4 justify-between">
        {movieList.map((movie) => {
          return (
            <Link href={`/movie/${movie.id}`}>
              <div className="p-4 border border-red-500 w-48 h-full">
                <ul>
                  <li className="font-bold mb-4">Title: {movie.title}</li>
                  <li className="mb-4">Overview: {movie.overview}</li>
                  <li className="font-bold">Release date: {movie.release_date}</li>
                </ul>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}

interface Movie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

interface MovieResponse {
  total_pages: number;
  total_results: number;
  page: number;
  results: Movie[];
}

export async function getStaticProps() {
  try {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
      },
    };
    const res = await fetch(
      "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
      options
    );

    if (!res.ok) {
      throw new Error("somerthing went wrong");
    }

    const data = await res.json();

    return {
      props: {
        movieResponse: data,
      },
    };
  } catch (err) {
    return {
      props: {
        error: "something went wrong!",
      },
    };
  }
}
