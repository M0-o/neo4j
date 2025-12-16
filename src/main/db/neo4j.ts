import neo4j from 'neo4j-driver'

const uri = import.meta.env.MAIN_VITE_NEO4J_URI
const user = import.meta.env.MAIN_VITE_NEO4J_USER
const password = import.meta.env.MAIN_VITE_NEO4J_PASSWORD

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password), { maxConnectionPoolSize: 10 })

export default driver
