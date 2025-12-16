import type { Book, RecommendationResult, Author, Genre, GenreWithStats } from '../types'

// Mock book cover images (using placeholder URLs)
const coverImages = [
  'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop',
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop',
  'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop',
  'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=300&h=400&fit=crop',
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop',
  'https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=400&fit=crop',
  'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=300&h=400&fit=crop',
  'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=300&h=400&fit=crop'
]

// Helper to get a random cover image
const getCover = (index: number): string => coverImages[index % coverImages.length]

export const mockBooks: Book[] = [
  {
    id: 'book-1',
    title: 'The Midnight Library',
    publishedYear: 2020,
    pages: 304,
    isbn: '978-0525559474',
    rating: 4.5,
    description:
      'Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.',
    coverImage: getCover(0)
  },
  {
    id: 'book-2',
    title: 'Project Hail Mary',
    publishedYear: 2021,
    pages: 496,
    isbn: '978-0593135204',
    rating: 4.8,
    description:
      'A lone astronaut must save Earth from disaster in this incredible new science-based thriller from the #1 New York Times bestselling author of The Martian.',
    coverImage: getCover(1)
  },
  {
    id: 'book-3',
    title: 'Atomic Habits',
    publishedYear: 2018,
    pages: 320,
    isbn: '978-0735211292',
    rating: 4.7,
    description:
      'No matter your goals, Atomic Habits offers a proven framework for improving every day. Learn how tiny changes in behavior can lead to remarkable results.',
    coverImage: getCover(2)
  },
  {
    id: 'book-4',
    title: 'The Song of Achilles',
    publishedYear: 2011,
    pages: 378,
    isbn: '978-0062060624',
    rating: 4.6,
    description:
      "A tale of gods, kings, immortal fame, and the human heart, The Song of Achilles is a dazzling literary feat that brilliantly reimagines Homer's Iliad.",
    coverImage: getCover(3)
  },
  {
    id: 'book-5',
    title: 'Dune',
    publishedYear: 1965,
    pages: 688,
    isbn: '978-0441172719',
    rating: 4.4,
    description:
      'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world.',
    coverImage: getCover(4)
  },
  {
    id: 'book-6',
    title: 'The Seven Husbands of Evelyn Hugo',
    publishedYear: 2017,
    pages: 400,
    isbn: '978-1501161933',
    rating: 4.5,
    description:
      'Aging and reclusive Hollywood movie icon Evelyn Hugo is finally ready to tell the truth about her glamorous and scandalous life.',
    coverImage: getCover(5)
  },
  {
    id: 'book-7',
    title: 'A Court of Thorns and Roses',
    publishedYear: 2015,
    pages: 419,
    isbn: '978-1619634459',
    rating: 4.2,
    description:
      'When nineteen-year-old huntress Feyre kills a wolf in the woods, a terrifying creature arrives to demand retribution.',
    coverImage: getCover(6)
  },
  {
    id: 'book-8',
    title: 'The Alchemist',
    publishedYear: 1988,
    pages: 208,
    isbn: '978-0062315007',
    rating: 4.3,
    description:
      "Paulo Coelho's masterpiece tells the mystical story of Santiago, an Andalusian shepherd boy who yearns to travel in search of a worldly treasure.",
    coverImage: getCover(7)
  }
]

export const mockAuthors: Author[] = [
  { id: 'author-1', name: 'Matt Haig', birthYear: 1975, nationality: 'British' },
  { id: 'author-2', name: 'Andy Weir', birthYear: 1972, nationality: 'American' },
  { id: 'author-3', name: 'James Clear', birthYear: 1986, nationality: 'American' },
  { id: 'author-4', name: 'Madeline Miller', birthYear: 1978, nationality: 'American' },
  { id: 'author-5', name: 'Frank Herbert', birthYear: 1920, nationality: 'American' },
  { id: 'author-6', name: 'Taylor Jenkins Reid', birthYear: 1983, nationality: 'American' },
  { id: 'author-7', name: 'Sarah J. Maas', birthYear: 1986, nationality: 'American' },
  { id: 'author-8', name: 'Paulo Coelho', birthYear: 1947, nationality: 'Brazilian' }
]

export const mockGenres: Genre[] = [
  { id: 'genre-1', name: 'Fiction', description: 'Literary and commercial fiction' },
  {
    id: 'genre-2',
    name: 'Science Fiction',
    description: 'Speculative fiction with scientific themes'
  },
  { id: 'genre-3', name: 'Self-Help', description: 'Personal development and improvement' },
  { id: 'genre-4', name: 'Fantasy', description: 'Magical and supernatural fiction' },
  { id: 'genre-5', name: 'Historical Fiction', description: 'Fiction set in past time periods' },
  { id: 'genre-6', name: 'Romance', description: 'Love stories and relationships' }
]

export const mockGenresWithStats: GenreWithStats[] = mockGenres.map((genre, index) => ({
  ...genre,
  bookCount: 15 + index * 5
}))

export const mockRecommendations: RecommendationResult[] = mockBooks
  .slice(0, 6)
  .map((book, index) => ({
    book,
    score: 0.95 - index * 0.05,
    reason:
      index % 3 === 0
        ? 'Based on your reading history'
        : index % 3 === 1
          ? 'Popular with readers like you'
          : 'Matches your favorite genres'
  }))

// Additional mock data for "Users who read this also read..."
export const mockSimilarBooks: Record<string, Book[]> = {
  'book-1': [mockBooks[2], mockBooks[5], mockBooks[7]],
  'book-2': [mockBooks[4], mockBooks[0], mockBooks[3]],
  'book-3': [mockBooks[0], mockBooks[7], mockBooks[1]],
  'book-4': [mockBooks[6], mockBooks[5], mockBooks[0]],
  'book-5': [mockBooks[1], mockBooks[6], mockBooks[3]],
  'book-6': [mockBooks[3], mockBooks[0], mockBooks[7]],
  'book-7': [mockBooks[3], mockBooks[4], mockBooks[5]],
  'book-8': [mockBooks[0], mockBooks[2], mockBooks[3]]
}
