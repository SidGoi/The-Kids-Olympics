import initialGames from '@/data/Games';
import { notFound } from 'next/navigation';

// 1. Make the function async
export default async function GamePage({ params }) {
  // 2. Await the params object
  const { slug } = await params;

  // 3. Find the game based on the unwrapped slug
  const game = initialGames.find((g) => g.slug === slug);

  if (!game) return notFound();

  return (
    <div className="min-h-screen bg-pink-50 p-12 flex flex-col items-center">
      <h1 className="text-5xl font-bold text-pink-600">{game.name}</h1>
      <p className="mt-4 text-pink-400 text-xl">Welcome to the game room!</p>
    </div>
  );
}