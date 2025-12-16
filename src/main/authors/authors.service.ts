import driver from '../db/neo4j'

export interface Author {
  id: string
  name: string
  birthYear: number
  nationality: string
}

export interface AuthorWithBooks extends Author {
  books: { id: string; title: string; publishedYear: number }[]
}

export async function getAllAuthors(): Promise<Author[]> {
  const session = driver.session()
  try {
    const result = await session.run('MATCH (a:Author) RETURN a ORDER BY a.name')
    return result.records.map((record) => record.get('a').properties as Author)
  } finally {
    await session.close()
  }
}

export async function getAuthorById(id: string): Promise<AuthorWithBooks | null> {
  const session = driver.session()
  try {
    const result = await session.run(
      `MATCH (a:Author {id: $id})
       OPTIONAL MATCH (a)-[:WROTE]->(b:Book)
       RETURN a, 
              collect({id: b.id, title: b.title, publishedYear: b.publishedYear}) AS books`,
      { id }
    )

    if (result.records.length === 0) return null

    const record = result.records[0]
    const author = record.get('a').properties as Author
    const books = record.get('books').filter((b: { id: string | null }) => b.id !== null)

    return { ...author, books }
  } finally {
    await session.close()
  }
}

export async function searchAuthors(query: string): Promise<Author[]> {
  const session = driver.session()
  try {
    const result = await session.run(
      `MATCH (a:Author)
       WHERE toLower(a.name) CONTAINS toLower($query)
       RETURN a
       ORDER BY a.name
       LIMIT 20`,
      { query }
    )
    return result.records.map((record) => record.get('a').properties as Author)
  } finally {
    await session.close()
  }
}

export async function getAuthorsByNationality(nationality: string): Promise<Author[]> {
  const session = driver.session()
  try {
    const result = await session.run(
      `MATCH (a:Author {nationality: $nationality})
       RETURN a
       ORDER BY a.name`,
      { nationality }
    )
    return result.records.map((record) => record.get('a').properties as Author)
  } finally {
    await session.close()
  }
}

export async function createAuthor(author: Omit<Author, 'id'>): Promise<Author> {
  const session = driver.session()
  try {
    const id = `author-${Date.now()}`
    const result = await session.run(
      `CREATE (a:Author {
        id: $id,
        name: $name,
        birthYear: $birthYear,
        nationality: $nationality
      })
      RETURN a`,
      { id, ...author }
    )
    return result.records[0].get('a').properties as Author
  } finally {
    await session.close()
  }
}

export async function updateAuthor(
  id: string,
  updates: Partial<Omit<Author, 'id'>>
): Promise<Author | null> {
  const session = driver.session()
  try {
    const setClause = Object.keys(updates)
      .map((key) => `a.${key} = $${key}`)
      .join(', ')

    const result = await session.run(`MATCH (a:Author {id: $id}) SET ${setClause} RETURN a`, {
      id,
      ...updates
    })

    if (result.records.length === 0) return null
    return result.records[0].get('a').properties as Author
  } finally {
    await session.close()
  }
}

export async function deleteAuthor(id: string): Promise<boolean> {
  const session = driver.session()
  try {
    const result = await session.run(
      'MATCH (a:Author {id: $id}) DETACH DELETE a RETURN count(a) AS deleted',
      { id }
    )
    return result.records[0].get('deleted').toNumber() > 0
  } finally {
    await session.close()
  }
}

export async function getTopAuthors(limit = 10): Promise<(Author & { bookCount: number })[]> {
  const session = driver.session()
  try {
    const result = await session.run(
      `MATCH (a:Author)-[:WROTE]->(b:Book)
       RETURN a, count(b) AS bookCount
       ORDER BY bookCount DESC
       LIMIT $limit`,
      { limit: Number(limit) }
    )
    return result.records.map((record) => ({
      ...(record.get('a').properties as Author),
      bookCount: record.get('bookCount').toNumber()
    }))
  } finally {
    await session.close()
  }
}
