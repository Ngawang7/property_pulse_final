const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    // Test the connection
    await prisma.$connect()
    console.log('✅ Successfully connected to the database')
    
    // Try to query the database
    const userCount = await prisma.user.count()
    console.log(`✅ Database query successful. Found ${userCount} users.`)
    
  } catch (error) {
    console.error('❌ Database connection failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main() 