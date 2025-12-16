import driver from './neo4j'

export async function seedDatabase(): Promise<void> {
  const session = driver.session()

  try {
    // Clear existing data
    await session.run('MATCH (n) DETACH DELETE n')
    console.log('Cleared existing data')

    // Create constraints and indexes
    await session.run('CREATE CONSTRAINT book_id IF NOT EXISTS FOR (b:Book) REQUIRE b.id IS UNIQUE')
    await session.run(
      'CREATE CONSTRAINT author_id IF NOT EXISTS FOR (a:Author) REQUIRE a.id IS UNIQUE'
    )
    await session.run(
      'CREATE CONSTRAINT genre_id IF NOT EXISTS FOR (g:Genre) REQUIRE g.id IS UNIQUE'
    )
    await session.run('CREATE CONSTRAINT user_id IF NOT EXISTS FOR (u:User) REQUIRE u.id IS UNIQUE')
    await session.run('CREATE INDEX book_title IF NOT EXISTS FOR (b:Book) ON (b.title)')
    await session.run('CREATE INDEX author_name IF NOT EXISTS FOR (a:Author) ON (a.name)')
    console.log('Created constraints and indexes')

    // Create Authors
    const authors = [
      { id: 'author-1', name: 'George Orwell', birthYear: 1903, nationality: 'British' },
      { id: 'author-2', name: 'J.K. Rowling', birthYear: 1965, nationality: 'British' },
      { id: 'author-3', name: 'Stephen King', birthYear: 1947, nationality: 'American' },
      { id: 'author-4', name: 'Agatha Christie', birthYear: 1890, nationality: 'British' },
      { id: 'author-5', name: 'Isaac Asimov', birthYear: 1920, nationality: 'American' },
      { id: 'author-6', name: 'Jane Austen', birthYear: 1775, nationality: 'British' },
      { id: 'author-7', name: 'Frank Herbert', birthYear: 1920, nationality: 'American' },
      { id: 'author-8', name: 'Gabriel García Márquez', birthYear: 1927, nationality: 'Colombian' },
      { id: 'author-9', name: 'Haruki Murakami', birthYear: 1949, nationality: 'Japanese' },
      { id: 'author-10', name: 'Neil Gaiman', birthYear: 1960, nationality: 'British' }
    ]

    await session.run(
      `UNWIND $authors AS author
       CREATE (a:Author {id: author.id, name: author.name, birthYear: author.birthYear, nationality: author.nationality})`,
      { authors }
    )
    console.log('Created authors')

    // Create Genres
    const genres = [
      {
        id: 'genre-1',
        name: 'Science Fiction',
        description:
          'Fiction dealing with imaginative concepts such as futuristic science and technology'
      },
      {
        id: 'genre-2',
        name: 'Fantasy',
        description: 'Fiction involving magical elements and supernatural phenomena'
      },
      {
        id: 'genre-3',
        name: 'Mystery',
        description: 'Fiction dealing with the solution of a crime or puzzle'
      },
      {
        id: 'genre-4',
        name: 'Horror',
        description: 'Fiction intended to frighten, scare, or disgust'
      },
      {
        id: 'genre-5',
        name: 'Romance',
        description: 'Fiction focusing on romantic love relationships'
      },
      {
        id: 'genre-6',
        name: 'Dystopian',
        description: 'Fiction set in an imagined state or society with great suffering or injustice'
      },
      {
        id: 'genre-7',
        name: 'Literary Fiction',
        description: 'Fiction with literary merit and artistic value'
      },
      {
        id: 'genre-8',
        name: 'Thriller',
        description: 'Fiction characterized by fast pacing, tension, and excitement'
      },
      {
        id: 'genre-9',
        name: 'Magical Realism',
        description: 'Fiction with magical elements in an otherwise realistic setting'
      },
      {
        id: 'genre-10',
        name: 'Classic',
        description: 'Timeless works of literature recognized for their quality'
      }
    ]

    await session.run(
      `UNWIND $genres AS genre
       CREATE (g:Genre {id: genre.id, name: genre.name, description: genre.description})`,
      { genres }
    )
    console.log('Created genres')

    // Create Books
    const books = [
      {
        id: 'book-1',
        title: '1984',
        publishedYear: 1949,
        pages: 328,
        isbn: '978-0451524935',
        rating: 4.5,
        description: 'A dystopian novel about totalitarianism and surveillance'
      },
      {
        id: 'book-2',
        title: 'Animal Farm',
        publishedYear: 1945,
        pages: 112,
        isbn: '978-0451526342',
        rating: 4.3,
        description: 'An allegorical novella reflecting events leading to the Russian Revolution'
      },
      {
        id: 'book-3',
        title: "Harry Potter and the Philosopher's Stone",
        publishedYear: 1997,
        pages: 309,
        isbn: '978-0747532699',
        rating: 4.7,
        description: 'A young wizard discovers his magical heritage'
      },
      {
        id: 'book-4',
        title: 'Harry Potter and the Chamber of Secrets',
        publishedYear: 1998,
        pages: 341,
        isbn: '978-0747538493',
        rating: 4.6,
        description: 'Harry returns to Hogwarts for a second year of magical education'
      },
      {
        id: 'book-5',
        title: 'The Shining',
        publishedYear: 1977,
        pages: 447,
        isbn: '978-0307743657',
        rating: 4.4,
        description: 'A family becomes isolated in a haunted hotel during winter'
      },
      {
        id: 'book-6',
        title: 'It',
        publishedYear: 1986,
        pages: 1138,
        isbn: '978-1501142970',
        rating: 4.3,
        description: 'A group of friends face an ancient evil in their hometown'
      },
      {
        id: 'book-7',
        title: 'Murder on the Orient Express',
        publishedYear: 1934,
        pages: 256,
        isbn: '978-0062693662',
        rating: 4.5,
        description: 'Detective Poirot investigates a murder on a train'
      },
      {
        id: 'book-8',
        title: 'And Then There Were None',
        publishedYear: 1939,
        pages: 272,
        isbn: '978-0062073471',
        rating: 4.6,
        description: 'Ten strangers are lured to an island where they begin to die one by one'
      },
      {
        id: 'book-9',
        title: 'Foundation',
        publishedYear: 1951,
        pages: 244,
        isbn: '978-0553293357',
        rating: 4.4,
        description: 'The fall of a galactic empire and the rise of a new civilization'
      },
      {
        id: 'book-10',
        title: 'I, Robot',
        publishedYear: 1950,
        pages: 224,
        isbn: '978-0553382563',
        rating: 4.2,
        description: 'A collection of short stories about robots and artificial intelligence'
      },
      {
        id: 'book-11',
        title: 'Pride and Prejudice',
        publishedYear: 1813,
        pages: 279,
        isbn: '978-0141439518',
        rating: 4.6,
        description: 'A witty romance between Elizabeth Bennet and Mr. Darcy'
      },
      {
        id: 'book-12',
        title: 'Sense and Sensibility',
        publishedYear: 1811,
        pages: 352,
        isbn: '978-0141439662',
        rating: 4.3,
        description: 'Two sisters navigate love and heartbreak in Georgian England'
      },
      {
        id: 'book-13',
        title: 'Dune',
        publishedYear: 1965,
        pages: 688,
        isbn: '978-0441172719',
        rating: 4.5,
        description: 'An epic tale of politics, religion, and ecology on a desert planet'
      },
      {
        id: 'book-14',
        title: 'One Hundred Years of Solitude',
        publishedYear: 1967,
        pages: 417,
        isbn: '978-0060883287',
        rating: 4.4,
        description: 'The multi-generational story of the Buendía family'
      },
      {
        id: 'book-15',
        title: 'Norwegian Wood',
        publishedYear: 1987,
        pages: 296,
        isbn: '978-0375704024',
        rating: 4.1,
        description: 'A nostalgic story of loss and sexuality in 1960s Japan'
      },
      {
        id: 'book-16',
        title: 'Kafka on the Shore',
        publishedYear: 2002,
        pages: 467,
        isbn: '978-1400079278',
        rating: 4.2,
        description: 'A metaphysical journey of a teenage boy and an old man'
      },
      {
        id: 'book-17',
        title: 'American Gods',
        publishedYear: 2001,
        pages: 541,
        isbn: '978-0063081918',
        rating: 4.3,
        description: 'Old gods and new clash across America'
      },
      {
        id: 'book-18',
        title: 'Coraline',
        publishedYear: 2002,
        pages: 162,
        isbn: '978-0380807345',
        rating: 4.4,
        description: 'A young girl discovers a sinister alternate world'
      },
      {
        id: 'book-19',
        title: 'The Stand',
        publishedYear: 1978,
        pages: 1153,
        isbn: '978-0307743688',
        rating: 4.5,
        description: 'Survivors of a deadly plague face a final battle between good and evil'
      },
      {
        id: 'book-20',
        title: 'Harry Potter and the Prisoner of Azkaban',
        publishedYear: 1999,
        pages: 435,
        isbn: '978-0747542155',
        rating: 4.8,
        description: 'Harry learns about his past while a dangerous prisoner escapes'
      }
    ]

    await session.run(
      `UNWIND $books AS book
       CREATE (b:Book {id: book.id, title: book.title, publishedYear: book.publishedYear, pages: book.pages, isbn: book.isbn, rating: book.rating, description: book.description})`,
      { books }
    )
    console.log('Created books')

    // Create Users
    const users = [
      {
        id: 'user-1',
        username: 'bookworm42',
        email: 'bookworm42@email.com',
        createdAt: '2024-01-15',
        preferredGenres: ['Science Fiction', 'Fantasy']
      },
      {
        id: 'user-2',
        username: 'mysterylover',
        email: 'mystery@email.com',
        createdAt: '2024-02-20',
        preferredGenres: ['Mystery', 'Thriller']
      },
      {
        id: 'user-3',
        username: 'classicfan',
        email: 'classic@email.com',
        createdAt: '2024-03-10',
        preferredGenres: ['Classic', 'Romance']
      },
      {
        id: 'user-4',
        username: 'horrornight',
        email: 'horror@email.com',
        createdAt: '2024-04-05',
        preferredGenres: ['Horror', 'Thriller']
      },
      {
        id: 'user-5',
        username: 'scifigeek',
        email: 'scifi@email.com',
        createdAt: '2024-05-12',
        preferredGenres: ['Science Fiction', 'Dystopian']
      },
      {
        id: 'user-6',
        username: 'fantasydreamer',
        email: 'fantasy@email.com',
        createdAt: '2024-06-18',
        preferredGenres: ['Fantasy', 'Magical Realism']
      },
      {
        id: 'user-7',
        username: 'litcritic',
        email: 'litcritic@email.com',
        createdAt: '2024-07-22',
        preferredGenres: ['Literary Fiction', 'Classic']
      },
      {
        id: 'user-8',
        username: 'pageturner',
        email: 'pageturner@email.com',
        createdAt: '2024-08-30',
        preferredGenres: ['Thriller', 'Mystery']
      }
    ]

    await session.run(
      `UNWIND $users AS user
       CREATE (u:User {id: user.id, username: user.username, email: user.email, createdAt: user.createdAt, preferredGenres: user.preferredGenres})`,
      { users }
    )
    console.log('Created users')

    // Create WROTE relationships (Author -> Book)
    const wroteRelationships = [
      { authorId: 'author-1', bookId: 'book-1' },
      { authorId: 'author-1', bookId: 'book-2' },
      { authorId: 'author-2', bookId: 'book-3' },
      { authorId: 'author-2', bookId: 'book-4' },
      { authorId: 'author-2', bookId: 'book-20' },
      { authorId: 'author-3', bookId: 'book-5' },
      { authorId: 'author-3', bookId: 'book-6' },
      { authorId: 'author-3', bookId: 'book-19' },
      { authorId: 'author-4', bookId: 'book-7' },
      { authorId: 'author-4', bookId: 'book-8' },
      { authorId: 'author-5', bookId: 'book-9' },
      { authorId: 'author-5', bookId: 'book-10' },
      { authorId: 'author-6', bookId: 'book-11' },
      { authorId: 'author-6', bookId: 'book-12' },
      { authorId: 'author-7', bookId: 'book-13' },
      { authorId: 'author-8', bookId: 'book-14' },
      { authorId: 'author-9', bookId: 'book-15' },
      { authorId: 'author-9', bookId: 'book-16' },
      { authorId: 'author-10', bookId: 'book-17' },
      { authorId: 'author-10', bookId: 'book-18' }
    ]

    await session.run(
      `UNWIND $relationships AS rel
       MATCH (a:Author {id: rel.authorId}), (b:Book {id: rel.bookId})
       CREATE (a)-[:WROTE]->(b)`,
      { relationships: wroteRelationships }
    )
    console.log('Created WROTE relationships')

    // Create BELONGS_TO relationships (Book -> Genre)
    const belongsToRelationships = [
      { bookId: 'book-1', genreId: 'genre-6' },
      { bookId: 'book-1', genreId: 'genre-1' },
      { bookId: 'book-2', genreId: 'genre-6' },
      { bookId: 'book-2', genreId: 'genre-10' },
      { bookId: 'book-3', genreId: 'genre-2' },
      { bookId: 'book-4', genreId: 'genre-2' },
      { bookId: 'book-5', genreId: 'genre-4' },
      { bookId: 'book-5', genreId: 'genre-8' },
      { bookId: 'book-6', genreId: 'genre-4' },
      { bookId: 'book-7', genreId: 'genre-3' },
      { bookId: 'book-7', genreId: 'genre-10' },
      { bookId: 'book-8', genreId: 'genre-3' },
      { bookId: 'book-8', genreId: 'genre-8' },
      { bookId: 'book-9', genreId: 'genre-1' },
      { bookId: 'book-10', genreId: 'genre-1' },
      { bookId: 'book-11', genreId: 'genre-5' },
      { bookId: 'book-11', genreId: 'genre-10' },
      { bookId: 'book-12', genreId: 'genre-5' },
      { bookId: 'book-12', genreId: 'genre-10' },
      { bookId: 'book-13', genreId: 'genre-1' },
      { bookId: 'book-13', genreId: 'genre-2' },
      { bookId: 'book-14', genreId: 'genre-9' },
      { bookId: 'book-14', genreId: 'genre-7' },
      { bookId: 'book-15', genreId: 'genre-7' },
      { bookId: 'book-15', genreId: 'genre-5' },
      { bookId: 'book-16', genreId: 'genre-9' },
      { bookId: 'book-16', genreId: 'genre-7' },
      { bookId: 'book-17', genreId: 'genre-2' },
      { bookId: 'book-17', genreId: 'genre-9' },
      { bookId: 'book-18', genreId: 'genre-4' },
      { bookId: 'book-18', genreId: 'genre-2' },
      { bookId: 'book-19', genreId: 'genre-4' },
      { bookId: 'book-19', genreId: 'genre-6' },
      { bookId: 'book-20', genreId: 'genre-2' }
    ]

    await session.run(
      `UNWIND $relationships AS rel
       MATCH (b:Book {id: rel.bookId}), (g:Genre {id: rel.genreId})
       CREATE (b)-[:BELONGS_TO]->(g)`,
      { relationships: belongsToRelationships }
    )
    console.log('Created BELONGS_TO relationships')

    // Create READ and RATED relationships (User -> Book)
    const readRelationships = [
      {
        userId: 'user-1',
        bookId: 'book-1',
        rating: 5,
        readDate: '2024-02-15',
        review: 'A masterpiece of dystopian fiction'
      },
      {
        userId: 'user-1',
        bookId: 'book-9',
        rating: 4,
        readDate: '2024-03-20',
        review: 'Fascinating exploration of civilization'
      },
      {
        userId: 'user-1',
        bookId: 'book-13',
        rating: 5,
        readDate: '2024-04-10',
        review: 'Epic world-building at its finest'
      },
      {
        userId: 'user-1',
        bookId: 'book-3',
        rating: 4,
        readDate: '2024-05-05',
        review: 'Magical and captivating'
      },
      {
        userId: 'user-2',
        bookId: 'book-7',
        rating: 5,
        readDate: '2024-03-01',
        review: 'Classic mystery with brilliant twists'
      },
      {
        userId: 'user-2',
        bookId: 'book-8',
        rating: 5,
        readDate: '2024-04-15',
        review: 'Keeps you guessing until the end'
      },
      {
        userId: 'user-2',
        bookId: 'book-5',
        rating: 3,
        readDate: '2024-05-20',
        review: 'Creepy but a bit slow'
      },
      {
        userId: 'user-3',
        bookId: 'book-11',
        rating: 5,
        readDate: '2024-04-01',
        review: 'Timeless romance and wit'
      },
      {
        userId: 'user-3',
        bookId: 'book-12',
        rating: 4,
        readDate: '2024-05-10',
        review: 'Beautiful portrayal of sisterhood'
      },
      {
        userId: 'user-3',
        bookId: 'book-14',
        rating: 5,
        readDate: '2024-06-15',
        review: 'Magical and profound'
      },
      {
        userId: 'user-4',
        bookId: 'book-5',
        rating: 5,
        readDate: '2024-05-01',
        review: 'Terrifying and brilliant'
      },
      {
        userId: 'user-4',
        bookId: 'book-6',
        rating: 5,
        readDate: '2024-06-10',
        review: 'A horror epic that stays with you'
      },
      {
        userId: 'user-4',
        bookId: 'book-18',
        rating: 4,
        readDate: '2024-07-20',
        review: 'Dark fairy tale perfection'
      },
      {
        userId: 'user-4',
        bookId: 'book-19',
        rating: 5,
        readDate: '2024-08-15',
        review: 'Kings magnum opus'
      },
      {
        userId: 'user-5',
        bookId: 'book-1',
        rating: 5,
        readDate: '2024-06-01',
        review: 'Eerily prescient'
      },
      {
        userId: 'user-5',
        bookId: 'book-9',
        rating: 5,
        readDate: '2024-07-05',
        review: 'Foundation of modern sci-fi'
      },
      {
        userId: 'user-5',
        bookId: 'book-10',
        rating: 4,
        readDate: '2024-08-10',
        review: 'Thought-provoking robot stories'
      },
      {
        userId: 'user-5',
        bookId: 'book-13',
        rating: 5,
        readDate: '2024-09-01',
        review: 'Unparalleled science fiction'
      },
      {
        userId: 'user-6',
        bookId: 'book-3',
        rating: 5,
        readDate: '2024-07-01',
        review: 'The start of something magical'
      },
      {
        userId: 'user-6',
        bookId: 'book-4',
        rating: 5,
        readDate: '2024-07-15',
        review: 'Even better than the first'
      },
      {
        userId: 'user-6',
        bookId: 'book-17',
        rating: 4,
        readDate: '2024-08-20',
        review: 'Mythology meets modern America'
      },
      {
        userId: 'user-6',
        bookId: 'book-14',
        rating: 4,
        readDate: '2024-09-10',
        review: 'Dreamlike and beautiful'
      },
      {
        userId: 'user-6',
        bookId: 'book-20',
        rating: 5,
        readDate: '2024-10-01',
        review: 'My favorite in the series'
      },
      {
        userId: 'user-7',
        bookId: 'book-14',
        rating: 5,
        readDate: '2024-08-01',
        review: 'A literary masterpiece'
      },
      {
        userId: 'user-7',
        bookId: 'book-15',
        rating: 4,
        readDate: '2024-09-05',
        review: 'Melancholic beauty'
      },
      {
        userId: 'user-7',
        bookId: 'book-16',
        rating: 5,
        readDate: '2024-10-10',
        review: 'Surreal and captivating'
      },
      {
        userId: 'user-7',
        bookId: 'book-11',
        rating: 5,
        readDate: '2024-11-01',
        review: 'Austens finest work'
      },
      {
        userId: 'user-8',
        bookId: 'book-7',
        rating: 4,
        readDate: '2024-09-01',
        review: 'Classic whodunit'
      },
      {
        userId: 'user-8',
        bookId: 'book-8',
        rating: 5,
        readDate: '2024-10-05',
        review: 'Best mystery ever written'
      },
      {
        userId: 'user-8',
        bookId: 'book-5',
        rating: 4,
        readDate: '2024-11-10',
        review: 'Atmospheric horror'
      },
      {
        userId: 'user-8',
        bookId: 'book-6',
        rating: 4,
        readDate: '2024-12-01',
        review: 'Long but worth it'
      }
    ]

    await session.run(
      `UNWIND $relationships AS rel
       MATCH (u:User {id: rel.userId}), (b:Book {id: rel.bookId})
       CREATE (u)-[:READ {rating: rel.rating, readDate: rel.readDate, review: rel.review}]->(b)`,
      { relationships: readRelationships }
    )
    console.log('Created READ relationships')

    // Create SIMILAR_TO relationships between books (based on shared genres/themes)
    const similarRelationships = [
      { bookId1: 'book-1', bookId2: 'book-2', similarity: 0.9 },
      { bookId1: 'book-1', bookId2: 'book-19', similarity: 0.7 },
      { bookId1: 'book-3', bookId2: 'book-4', similarity: 0.95 },
      { bookId1: 'book-3', bookId2: 'book-20', similarity: 0.95 },
      { bookId1: 'book-4', bookId2: 'book-20', similarity: 0.95 },
      { bookId1: 'book-5', bookId2: 'book-6', similarity: 0.85 },
      { bookId1: 'book-5', bookId2: 'book-19', similarity: 0.75 },
      { bookId1: 'book-6', bookId2: 'book-19', similarity: 0.8 },
      { bookId1: 'book-7', bookId2: 'book-8', similarity: 0.9 },
      { bookId1: 'book-9', bookId2: 'book-10', similarity: 0.85 },
      { bookId1: 'book-9', bookId2: 'book-13', similarity: 0.8 },
      { bookId1: 'book-11', bookId2: 'book-12', similarity: 0.9 },
      { bookId1: 'book-14', bookId2: 'book-16', similarity: 0.75 },
      { bookId1: 'book-14', bookId2: 'book-17', similarity: 0.7 },
      { bookId1: 'book-15', bookId2: 'book-16', similarity: 0.85 },
      { bookId1: 'book-17', bookId2: 'book-18', similarity: 0.8 },
      { bookId1: 'book-5', bookId2: 'book-18', similarity: 0.7 },
      { bookId1: 'book-13', bookId2: 'book-17', similarity: 0.65 }
    ]

    await session.run(
      `UNWIND $relationships AS rel
       MATCH (b1:Book {id: rel.bookId1}), (b2:Book {id: rel.bookId2})
       CREATE (b1)-[:SIMILAR_TO {score: rel.similarity}]->(b2)
       CREATE (b2)-[:SIMILAR_TO {score: rel.similarity}]->(b1)`,
      { relationships: similarRelationships }
    )
    console.log('Created SIMILAR_TO relationships')

    // Create FOLLOWS relationships between users
    const followsRelationships = [
      { followerId: 'user-1', followedId: 'user-5' },
      { followerId: 'user-1', followedId: 'user-6' },
      { followerId: 'user-2', followedId: 'user-4' },
      { followerId: 'user-2', followedId: 'user-8' },
      { followerId: 'user-3', followedId: 'user-7' },
      { followerId: 'user-4', followedId: 'user-2' },
      { followerId: 'user-5', followedId: 'user-1' },
      { followerId: 'user-6', followedId: 'user-1' },
      { followerId: 'user-6', followedId: 'user-3' },
      { followerId: 'user-7', followedId: 'user-3' },
      { followerId: 'user-8', followedId: 'user-2' },
      { followerId: 'user-8', followedId: 'user-4' }
    ]

    await session.run(
      `UNWIND $relationships AS rel
       MATCH (u1:User {id: rel.followerId}), (u2:User {id: rel.followedId})
       CREATE (u1)-[:FOLLOWS]->(u2)`,
      { relationships: followsRelationships }
    )
    console.log('Created FOLLOWS relationships')

    // Create WANTS_TO_READ relationships (User wishlist)
    const wantsToReadRelationships = [
      { userId: 'user-1', bookId: 'book-17' },
      { userId: 'user-1', bookId: 'book-14' },
      { userId: 'user-2', bookId: 'book-6' },
      { userId: 'user-3', bookId: 'book-15' },
      { userId: 'user-4', bookId: 'book-17' },
      { userId: 'user-5', bookId: 'book-2' },
      { userId: 'user-6', bookId: 'book-16' },
      { userId: 'user-7', bookId: 'book-17' },
      { userId: 'user-8', bookId: 'book-19' }
    ]

    await session.run(
      `UNWIND $relationships AS rel
       MATCH (u:User {id: rel.userId}), (b:Book {id: rel.bookId})
       CREATE (u)-[:WANTS_TO_READ {addedDate: date()}]->(b)`,
      { relationships: wantsToReadRelationships }
    )
    console.log('Created WANTS_TO_READ relationships')

    console.log('Database seeded successfully!')
  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  } finally {
    await session.close()
  }
}

// Utility function to run seed independently
export async function runSeed(): Promise<void> {
  try {
    await seedDatabase()
  } finally {
    await driver.close()
  }
}
