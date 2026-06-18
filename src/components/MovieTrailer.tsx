import React, { useState } from 'react';
import { Youtube, ExternalLink, Play } from 'lucide-react';

interface MovieTrailerProps {
  title: string;
}

type TrailerSource = {
  id: string;
  label: string;
  query: string;
};

const MovieTrailer: React.FC<MovieTrailerProps> = ({ title }) => {
  const sources: TrailerSource[] = [
    { id: 'official', label: 'Official Trailer', query: `${title} official trailer` },
    { id: 'general', label: 'General Trailer', query: `${title} trailer` },
    { id: 'clips', label: 'Movie Clips', query: `${title} movie clips` },
  ];

  const [activeSource, setActiveSource] = useState<string>('official');
  const active = sources.find((s) => s.id === activeSource) || sources[0];

  const buttonBase =
    'inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border';

  return (
    <div>
      <div className="flex items-center mb-4">
        <Play className="w-6 h-6 text-purple-400 mr-3" />
        <h3 className="text-2xl font-bold text-white">Trailer</h3>
      </div>

      <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black">
        <iframe
          key={activeSource}
          src={`https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(
            active.query
          )}&autoplay=1&rel=0`}
          title={`${title} ${active.label}`}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="eager"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {sources.map((source) => (
          <button
            key={source.id}
            onClick={() => setActiveSource(source.id)}
            className={
              activeSource === source.id
                ? `${buttonBase} bg-gradient-to-r from-purple-500 to-pink-500 text-white border-transparent shadow-lg`
                : `${buttonBase} bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:text-white`
            }
          >
            <Youtube className="w-4 h-4 mr-2" />
            {source.label}
          </button>
        ))}

        <a
          href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
            `${title} trailer`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`${buttonBase} bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:text-white`}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Search on YouTube
        </a>
      </div>

      <p className="mt-3 text-sm text-gray-400">
        If the first trailer doesn’t match, try a different source above.
      </p>
    </div>
  );
};

export default MovieTrailer;
