import driver from '../db/neo4j'
import { Book } from '../books/books.service'

export interface User {
  id: string
  username: string
  email: string
  createdAt: string
  preferredGenres: string[]
}

export interface UserWithActivity extends User {
  booksRead: number
  followers: number
  following: number
}

export interface ReadingHistory {
  book: Book
  rating: number
  readDate: string
  review: string
}

export async function getAllUsers(): Promise<User[]> {
  const session = driver.session()
  try {
    const result = await session.run('MATCH (u:User) RETURN u ORDER BY u.username')
    return result.records.map((record) => record.get('u').properties as User)
  } finally {
    await session.close()
  }
}

export async function getUserById(id: string): Promise<UserWithActivity | null> {
  const session = driver.session()
  try {
    const result = await session.run(
      `MATCH (u:User {id: $id})
       OPTIONAL MATCH (u)-[:READ]->(b:Book)
       OPTIONAL MATCH (follower:User)-[:FOLLOWS]->(u)
       OPTIONAL MATCH (u)-[:FOLLOWS]->(followed:User)
       RETURN u,
              count(DISTINCT b) AS booksRead,
              count(DISTINCT follower) AS followers,
              count(DISTINCT followed) AS following`,
      { id }
    )

    if (result.records.length === 0) return null

    const record = result.records[0]
    const user = record.get('u').properties as User

    return {
      ...user,
      booksRead: record.get('booksRead').toNumber(),
      followers: record.get('followers').toNumber(),
      following: record.get('following').toNumber()
    }
  } finally {
    await session.close()
  }
}

export async function getUserByUsername(username: string): Promise<User | null> {
  const session = driver.session()
  try {
    const result = await session.run('MATCH (u:User {username: $username}) RETURN u', { username })

    if (result.records.length === 0) return null
    return result.records[0].get('u').properties as User
  } finally {
    await session.close()
  }
}

export async function createUser(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
  const session = driver.session()
  try {
    const id = `user-${Date.now()}`
    const createdAt = new Date().toISOString().split('T')[0]
    const result = await session.run(
      `CREATE (u:User {
        id: $id,
        username: $username,
        email: $email,
        createdAt: $createdAt,
        preferredGenres: $preferredGenres
      })
      RETURN u`,
      { id, createdAt, ...user }
    )
    return result.records[0].get('u').properties as User
  } finally {
    await session.close()
  }
}

export async function updateUser(
  id: string,
  updates: Partial<Omit<User, 'id' | 'createdAt'>>
): Promise<User | null> {
  const session = driver.session()
  try {
    const setClause = Object.keys(updates)
      .map((key) => `u.${key} = $${key}`)
      .join(', ')

    const result = await session.run(`MATCH (u:User {id: $id}) SET ${setClause} RETURN u`, {
      id,
      ...updates
    })

    if (result.records.length === 0) return null
    return result.records[0].get('u').properties as User
  } finally {
    await session.close()
  }
}

export async function deleteUser(id: string): Promise<boolean> {
  const session = driver.session()
  try {
    const result = await session.run(
      'MATCH (u:User {id: $id}) DETACH DELETE u RETURN count(u) AS deleted',
      { id }
    )
    return result.records[0].get('deleted').toNumber() > 0
  } finally {
    await session.close()
  }
}

export async function getUserReadingHistory(userId: string): Promise<ReadingHistory[]> {
  const session = driver.session()
  try {
    const result = await session.run(
      `MATCH (u:User {id: $userId})-[r:READ]->(b:Book)
       RETURN b, r.rating AS rating, r.readDate AS readDate, r.review AS review
       ORDER BY r.readDate DESC`,
      { userId }
    )

    return result.records.map((record) => ({
      book: record.get('b').properties as Book,
      rating: record.get('rating'),
      readDate: record.get('readDate'),
      review: record.get('review')
    }))
  } finally {
    await session.close()
  }
}

export async function markBookAsRead(
  userId: string,
  bookId: string,
  rating: number,
  review?: string
): Promise<boolean> {
  const session = driver.session()
  try {
    const readDate = new Date().toISOString().split('T')[0]
    await session.run(
      `MATCH (u:User {id: $userId}), (b:Book {id: $bookId})
       MERGE (u)-[r:READ]->(b)
       SET r.rating = $rating, r.readDate = $readDate, r.review = $review`,
      { userId, bookId, rating, readDate, review: review || '' }
    )
    return true
  } finally {
    await session.close()
  }
}

export async function removeBookFromRead(userId: string, bookId: string): Promise<boolean> {
  const session = driver.session()
  try {
    const result = await session.run(
      `MATCH (u:User {id: $userId})-[r:READ]->(b:Book {id: $bookId})
       DELETE r
       RETURN count(r) AS deleted`,
      { userId, bookId }
    )
    return result.records[0].get('deleted').toNumber() > 0
  } finally {
    await session.close()
  }
}

export async function getUserWishlist(userId: string): Promise<Book[]> {
  const session = driver.session()
  try {
    const result = await session.run(
      `MATCH (u:User {id: $userId})-[:WANTS_TO_READ]->(b:Book)
       RETURN b
       ORDER BY b.title`,
      { userId }
    )
    return result.records.map((record) => record.get('b').properties as Book)
  } finally {
    await session.close()
  }
}

export async function addToWishlist(userId: string, bookId: string): Promise<boolean> {
  const session = driver.session()
  try {
    await session.run(
      `MATCH (u:User {id: $userId}), (b:Book {id: $bookId})
       MERGE (u)-[:WANTS_TO_READ {addedDate: date()}]->(b)`,
      { userId, bookId }
    )
    return true
  } finally {
    await session.close()
  }
}

export async function removeFromWishlist(userId: string, bookId: string): Promise<boolean> {
  const session = driver.session()
  try {
    const result = await session.run(
      `MATCH (u:User {id: $userId})-[r:WANTS_TO_READ]->(b:Book {id: $bookId})
       DELETE r
       RETURN count(r) AS deleted`,
      { userId, bookId }
    )
    return result.records[0].get('deleted').toNumber() > 0
  } finally {
    await session.close()
  }
}

export async function followUser(followerId: string, followedId: string): Promise<boolean> {
  const session = driver.session()
  try {
    await session.run(
      `MATCH (follower:User {id: $followerId}), (followed:User {id: $followedId})
       MERGE (follower)-[:FOLLOWS]->(followed)`,
      { followerId, followedId }
    )
    return true
  } finally {
    await session.close()
  }
}

export async function unfollowUser(followerId: string, followedId: string): Promise<boolean> {
  const session = driver.session()
  try {
    const result = await session.run(
      `MATCH (follower:User {id: $followerId})-[r:FOLLOWS]->(followed:User {id: $followedId})
       DELETE r
       RETURN count(r) AS deleted`,
      { followerId, followedId }
    )
    return result.records[0].get('deleted').toNumber() > 0
  } finally {
    await session.close()
  }
}

export async function getUserFollowers(userId: string): Promise<User[]> {
  const session = driver.session()
  try {
    const result = await session.run(
      `MATCH (follower:User)-[:FOLLOWS]->(u:User {id: $userId})
       RETURN follower
       ORDER BY follower.username`,
      { userId }
    )
    return result.records.map((record) => record.get('follower').properties as User)
  } finally {
    await session.close()
  }
}

export async function getUserFollowing(userId: string): Promise<User[]> {
  const session = driver.session()
  try {
    const result = await session.run(
      `MATCH (u:User {id: $userId})-[:FOLLOWS]->(followed:User)
       RETURN followed
       ORDER BY followed.username`,
      { userId }
    )
    return result.records.map((record) => record.get('followed').properties as User)
  } finally {
    await session.close()
  }
}

export async function updateUserPreferredGenres(
  userId: string,
  genres: string[]
): Promise<User | null> {
  const session = driver.session()
  try {
    const result = await session.run(
      `MATCH (u:User {id: $userId})
       SET u.preferredGenres = $genres
       RETURN u`,
      { userId, genres }
    )

    if (result.records.length === 0) return null
    return result.records[0].get('u').properties as User
  } finally {
    await session.close()
  }
}
