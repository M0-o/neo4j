import driver from '../db/neo4j'
import neo4j from 'neo4j-driver'

export interface Book {
  id: string
  title: string
  publishedYear: number
  pages: number
  isbn: string
  rating: number
  description: string
}

export interface BookWithDetails extends Book {
  authors: { id: string; name: string }[]
  genres: { id: string; name: string }[]
}

export async function getAllBooks(): Promise<Book[]> {
  const session = driver.session()
  try {
    const result = await session.run('MATCH (b:Book) RETURN b ORDER BY b.title')
    return result.records.map((record) => record.get('b').properties as Book)
  } finally {
    await session.close()
  }
}

export async function getBookById(id: string): Promise<BookWithDetails | null> {
  const session = driver.session()
  try {
    const result = await session.run(
      `MATCH (b:Book {id: $id})
       OPTIONAL MATCH (a:Author)-[:WROTE]->(b)
       OPTIONAL MATCH (b)-[:BELONGS_TO]->(g:Genre)
       RETURN b, 
              collect(DISTINCT {id: a.id, name: a.name}) AS authors,
              collect(DISTINCT {id: g.id, name: g.name}) AS genres`,
      { id }
    )

    if (result.records.length === 0) return null

    const record = result.records[0]
    const book = record.get('b').properties as Book
    const authors = record.get('authors').filter((a: { id: string | null }) => a.id !== null)
    const genres = record.get('genres').filter((g: { id: string | null }) => g.id !== null)

    return { ...book, authors, genres }
  } finally {
    await session.close()
  }
}

export async function searchBooks(query: string): Promise<Book[]> {
  const session = driver.session()
  try {
    const result = await session.run(
      `MATCH (b:Book)
       WHERE toLower(b.title) CONTAINS toLower($query) 
          OR toLower(b.description) CONTAINS toLower($query)
       RETURN b
       ORDER BY b.rating DESC
       LIMIT 20`,
      { query }
    )
    return result.records.map((record) => record.get('b').properties as Book)
  } finally {
    await session.close()
  }
}

export async function getBooksByGenre(genreId: string): Promise<Book[]> {
  const session = driver.session()
  try {
    const result = await session.run(
      `MATCH (b:Book)-[:BELONGS_TO]->(g:Genre {id: $genreId})
       RETURN b
       ORDER BY b.rating DESC`,
      { genreId }
    )
    return result.records.map((record) => record.get('b').properties as Book)
  } finally {
    await session.close()
  }
}

export async function getBooksByAuthor(authorId: string): Promise<Book[]> {
  const session = driver.session()
  try {
    const result = await session.run(
      `MATCH (a:Author {id: $authorId})-[:WROTE]->(b:Book)
       RETURN b
       ORDER BY b.publishedYear DESC`,
      { authorId }
    )
    return result.records.map((record) => record.get('b').properties as Book)
  } finally {
    await session.close()
  }
}

export async function getSimilarBooks(bookId: string, limit = 5): Promise<Book[]> {
  const session = driver.session()
  try {
    const result = await session.run(
      `MATCH (b:Book {id: $bookId})-[s:SIMILAR_TO]->(similar:Book)
       RETURN similar, s.score AS score
       ORDER BY s.score DESC
       LIMIT $limit`,
      { bookId, limit: neo4j.int(limit) }
    )
    return result.records.map((record) => record.get('similar').properties as Book)
  } finally {
    await session.close()
  }
}

export async function createBook(book: Omit<Book, 'id'>): Promise<Book> {
  const session = driver.session()
  try {
    const id = `book-${Date.now()}`
    const result = await session.run(
      `CREATE (b:Book {
        id: $id,
        title: $title,
        publishedYear: $publishedYear,
        pages: $pages,
        isbn: $isbn,
        rating: $rating,
        description: $description
      })
      RETURN b`,
      { id, ...book }
    )
    return result.records[0].get('b').properties as Book
  } finally {
    await session.close()
  }
}

export async function updateBook(
  id: string,
  updates: Partial<Omit<Book, 'id'>>
): Promise<Book | null> {
  const session = driver.session()
  try {
    const setClause = Object.keys(updates)
      .map((key) => `b.${key} = $${key}`)
      .join(', ')

    const result = await session.run(`MATCH (b:Book {id: $id}) SET ${setClause} RETURN b`, {
      id,
      ...updates
    })

    if (result.records.length === 0) return null
    return result.records[0].get('b').properties as Book
  } finally {
    await session.close()
  }
}

export async function deleteBook(id: string): Promise<boolean> {
  const session = driver.session()
  try {
    const result = await session.run(
      'MATCH (b:Book {id: $id}) DETACH DELETE b RETURN count(b) AS deleted',
      {
        id
      }
    )
    return result.records[0].get('deleted').toNumber() > 0
  } finally {
    await session.close()
  }
}

export async function addBookToGenre(bookId: string, genreId: string): Promise<boolean> {
  const session = driver.session()
  try {
    await session.run(
      `MATCH (b:Book {id: $bookId}), (g:Genre {id: $genreId})
       MERGE (b)-[:BELONGS_TO]->(g)`,
      { bookId, genreId }
    )
    return true
  } finally {
    await session.close()
  }
}

export async function setBookAuthor(bookId: string, authorId: string): Promise<boolean> {
  const session = driver.session()
  try {
    await session.run(
      `MATCH (b:Book {id: $bookId}), (a:Author {id: $authorId})
       MERGE (a)-[:WROTE]->(b)`,
      { bookId, authorId }
    )
    return true
  } finally {
    await session.close()
  }
}

export async function getTopRatedBooks(limit = 10): Promise<Book[]> {
  const session = driver.session()
  try {
    const result = await session.run(
      `MATCH (b:Book)
       RETURN b
       ORDER BY b.rating DESC
       LIMIT $limit`,
      { limit: neo4j.int(limit) }
    )
    return result.records.map((record) => record.get('b').properties as Book)
  } finally {
    await session.close()
  }
}
