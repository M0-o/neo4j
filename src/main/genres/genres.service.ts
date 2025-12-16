import driver from '../db/neo4j'

export interface Genre {
  id: string
  name: string
  description: string
}

export interface GenreWithStats extends Genre {
  bookCount: number
}

export async function getAllGenres(): Promise<Genre[]> {
  const session = driver.session()
  try {
    const result = await session.run('MATCH (g:Genre) RETURN g ORDER BY g.name')
    return result.records.map((record) => record.get('g').properties as Genre)
  } finally {
    await session.close()
  }
}

export async function getGenreById(id: string): Promise<Genre | null> {
  const session = driver.session()
  try {
    const result = await session.run('MATCH (g:Genre {id: $id}) RETURN g', { id })

    if (result.records.length === 0) return null
    return result.records[0].get('g').properties as Genre
  } finally {
    await session.close()
  }
}

export async function getGenresWithStats(): Promise<GenreWithStats[]> {
  const session = driver.session()
  try {
    const result = await session.run(
      `MATCH (g:Genre)
       OPTIONAL MATCH (b:Book)-[:BELONGS_TO]->(g)
       RETURN g, count(b) AS bookCount
       ORDER BY bookCount DESC`
    )
    return result.records.map((record) => ({
      ...(record.get('g').properties as Genre),
      bookCount: record.get('bookCount').toNumber()
    }))
  } finally {
    await session.close()
  }
}

export async function searchGenres(query: string): Promise<Genre[]> {
  const session = driver.session()
  try {
    const result = await session.run(
      `MATCH (g:Genre)
       WHERE toLower(g.name) CONTAINS toLower($query)
          OR toLower(g.description) CONTAINS toLower($query)
       RETURN g
       ORDER BY g.name`,
      { query }
    )
    return result.records.map((record) => record.get('g').properties as Genre)
  } finally {
    await session.close()
  }
}

export async function createGenre(genre: Omit<Genre, 'id'>): Promise<Genre> {
  const session = driver.session()
  try {
    const id = `genre-${Date.now()}`
    const result = await session.run(
      `CREATE (g:Genre {
        id: $id,
        name: $name,
        description: $description
      })
      RETURN g`,
      { id, ...genre }
    )
    return result.records[0].get('g').properties as Genre
  } finally {
    await session.close()
  }
}

export async function updateGenre(
  id: string,
  updates: Partial<Omit<Genre, 'id'>>
): Promise<Genre | null> {
  const session = driver.session()
  try {
    const setClause = Object.keys(updates)
      .map((key) => `g.${key} = $${key}`)
      .join(', ')

    const result = await session.run(`MATCH (g:Genre {id: $id}) SET ${setClause} RETURN g`, {
      id,
      ...updates
    })

    if (result.records.length === 0) return null
    return result.records[0].get('g').properties as Genre
  } finally {
    await session.close()
  }
}

export async function deleteGenre(id: string): Promise<boolean> {
  const session = driver.session()
  try {
    const result = await session.run(
      'MATCH (g:Genre {id: $id}) DETACH DELETE g RETURN count(g) AS deleted',
      { id }
    )
    return result.records[0].get('deleted').toNumber() > 0
  } finally {
    await session.close()
  }
}

export async function getPopularGenres(limit = 5): Promise<GenreWithStats[]> {
  const session = driver.session()
  try {
    const result = await session.run(
      `MATCH (g:Genre)<-[:BELONGS_TO]-(b:Book)<-[:READ]-(u:User)
       RETURN g, count(DISTINCT u) AS readers
       ORDER BY readers DESC
       LIMIT $limit`,
      { limit: Number(limit) }
    )
    return result.records.map((record) => ({
      ...(record.get('g').properties as Genre),
      bookCount: record.get('readers').toNumber()
    }))
  } finally {
    await session.close()
  }
}
