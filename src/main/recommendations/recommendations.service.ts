import driver from '../db/neo4j'
import neo4j from 'neo4j-driver'
import { Book } from '../books/books.service'

export interface RecommendationResult {
  book: Book
  score: number
  reason: string
}

/**
 * Get personalized book recommendations based on user's reading history
 * Uses collaborative filtering - finds similar users and recommends what they liked
 */
export async function getRecommendationsForUser(
  userId: string,
  limit = 10
): Promise<RecommendationResult[]> {
  const session = driver.session()
  try {
    const result = await session.run(
      `MATCH (u:User {id: $userId})-[:READ]->(b:Book)<-[:READ]-(similar:User)-[r:READ]->(rec:Book)
       WHERE NOT (u)-[:READ]->(rec)
         AND NOT (u)-[:WANTS_TO_READ]->(rec)
         AND r.rating >= 4
       WITH rec, count(DISTINCT similar) AS commonReaders, avg(r.rating) AS avgRating
       RETURN rec, 
              commonReaders,
              avgRating,
              (commonReaders * 0.4 + avgRating * 0.6) AS score
       ORDER BY score DESC
       LIMIT $limit`,
      { userId, limit: neo4j.int(limit) }
    )

    return result.records.map((record) => ({
      book: record.get('rec').properties as Book,
      score: record.get('score'),
      reason: `Recommended by ${record.get('commonReaders').toNumber()} users with similar taste`
    }))
  } finally {
    await session.close()
  }
}

/**
 * Get recommendations based on a specific book (similar books)
 */
export async function getRecommendationsFromBook(
  bookId: string,
  limit = 5
): Promise<RecommendationResult[]> {
  const session = driver.session()
  try {
    const result = await session.run(
      `MATCH (b:Book {id: $bookId})-[s:SIMILAR_TO]->(similar:Book)
       RETURN similar, s.score AS score
       ORDER BY s.score DESC
       LIMIT $limit`,
      { bookId, limit: neo4j.int(limit) }
    )

    return result.records.map((record) => ({
      book: record.get('similar').properties as Book,
      score: record.get('score'),
      reason: 'Similar to a book you viewed'
    }))
  } finally {
    await session.close()
  }
}

/**
 * Get recommendations based on user's preferred genres
 */
export async function getRecommendationsByPreferredGenres(
  userId: string,
  limit = 10
): Promise<RecommendationResult[]> {
  const session = driver.session()
  try {
    const result = await session.run(
      `MATCH (u:User {id: $userId})
       UNWIND u.preferredGenres AS genreName
       MATCH (g:Genre {name: genreName})<-[:BELONGS_TO]-(b:Book)
       WHERE NOT (u)-[:READ]->(b)
       WITH b, count(DISTINCT g) AS genreMatches, b.rating AS rating
       RETURN b, 
              genreMatches,
              rating,
              (genreMatches * 2 + rating) AS score
       ORDER BY score DESC
       LIMIT $limit`,
      { userId, limit: neo4j.int(limit) }
    )

    return result.records.map((record) => ({
      book: record.get('b').properties as Book,
      score: record.get('score'),
      reason: `Matches ${record.get('genreMatches').toNumber()} of your preferred genres`
    }))
  } finally {
    await session.close()
  }
}

/**
 * Get recommendations from users that the current user follows
 */
export async function getRecommendationsFromFollowing(
  userId: string,
  limit = 10
): Promise<RecommendationResult[]> {
  const session = driver.session()
  try {
    const result = await session.run(
      `MATCH (u:User {id: $userId})-[:FOLLOWS]->(followed:User)-[r:READ]->(b:Book)
       WHERE NOT (u)-[:READ]->(b)
         AND r.rating >= 4
       WITH b, collect(DISTINCT followed.username) AS recommenders, avg(r.rating) AS avgRating
       RETURN b, recommenders, avgRating
       ORDER BY avgRating DESC, size(recommenders) DESC
       LIMIT $limit`,
      { userId, limit: neo4j.int(limit) }
    )

    return result.records.map((record) => ({
      book: record.get('b').properties as Book,
      score: record.get('avgRating'),
      reason: `Liked by ${record.get('recommenders').join(', ')}`
    }))
  } finally {
    await session.close()
  }
}

/**
 * Get recommendations based on author - if user liked one book by author, recommend others
 */
export async function getRecommendationsByFavoriteAuthors(
  userId: string,
  limit = 10
): Promise<RecommendationResult[]> {
  const session = driver.session()
  try {
    const result = await session.run(
      `MATCH (u:User {id: $userId})-[r:READ]->(b:Book)<-[:WROTE]-(a:Author)-[:WROTE]->(other:Book)
       WHERE NOT (u)-[:READ]->(other)
         AND r.rating >= 4
       WITH other, a, max(r.rating) AS userRating
       RETURN other, a.name AS authorName, userRating
       ORDER BY userRating DESC
       LIMIT $limit`,
      { userId, limit: neo4j.int(limit) }
    )

    return result.records.map((record) => ({
      book: record.get('other').properties as Book,
      score: record.get('userRating'),
      reason: `More from ${record.get('authorName')}, an author you enjoyed`
    }))
  } finally {
    await session.close()
  }
}

/**
 * Get trending books - most read in recent period with high ratings
 */
export async function getTrendingBooks(limit = 10): Promise<RecommendationResult[]> {
  const session = driver.session()
  try {
    const result = await session.run(
      `MATCH (u:User)-[r:READ]->(b:Book)
       WITH b, count(r) AS readers, avg(r.rating) AS avgRating
       WHERE readers >= 2
       RETURN b, readers, avgRating, (readers * 0.3 + avgRating * 0.7) AS trendScore
       ORDER BY trendScore DESC
       LIMIT $limit`,
      { limit: neo4j.int(limit) }
    )

    return result.records.map((record) => ({
      book: record.get('b').properties as Book,
      score: record.get('trendScore'),
      reason: `Popular: ${record.get('readers').toNumber()} readers, ${record.get('avgRating').toFixed(1)} avg rating`
    }))
  } finally {
    await session.close()
  }
}

/**
 * Get comprehensive recommendations combining multiple strategies
 */
export async function getHybridRecommendations(
  userId: string,
  limit = 10
): Promise<RecommendationResult[]> {
  const session = driver.session()
  try {
    const result = await session.run(
      `MATCH (u:User {id: $userId})
       
       // Strategy 1: Collaborative filtering - books from similar readers
       OPTIONAL MATCH (u)-[:READ]->(read:Book)<-[:READ]-(similar:User)-[r1:READ]->(rec1:Book)
       WHERE NOT (u)-[:READ]->(rec1) AND r1.rating >= 4
       WITH u, collect(DISTINCT rec1) AS collabBooks
       
       // Strategy 2: Genre-based - books from preferred genres
       OPTIONAL MATCH (g:Genre)<-[:BELONGS_TO]-(rec2:Book)
       WHERE g.name IN u.preferredGenres AND NOT (u)-[:READ]->(rec2)
       WITH u, collabBooks, collect(DISTINCT rec2) AS genreBooks
       
       // Strategy 3: Author-based - more books from authors of highly rated books
       OPTIONAL MATCH (u)-[r3:READ]->(b:Book)<-[:WROTE]-(a:Author)-[:WROTE]->(rec3:Book)
       WHERE NOT (u)-[:READ]->(rec3) AND r3.rating >= 4
       WITH collabBooks, genreBooks, collect(DISTINCT rec3) AS authorBooks
       
       // Combine all unique books
       WITH collabBooks + genreBooks + authorBooks AS allBooks
       UNWIND allBooks AS book
       WITH DISTINCT book
       WHERE book IS NOT NULL
       RETURN book, book.rating AS score
       ORDER BY score DESC
       LIMIT $limit`,
      { userId, limit: neo4j.int(limit) }
    )

    return result.records.map((record) => ({
      book: record.get('book').properties as Book,
      score: record.get('score'),
      reason: 'Personalized recommendation based on your reading history'
    }))
  } finally {
    await session.close()
  }
}
