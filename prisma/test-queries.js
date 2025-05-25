const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Query all users with their roles
    const users = await prisma.user.findMany({
      include: {
        bookmarks: true,
      },
    });
    console.log('\n📊 Users in database:', users.length);
    users.forEach(user => {
      console.log(`\n👤 User: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Bookmarks: ${user.bookmarks.length}`);
    });

    // Query all properties (created by admins)
    const properties = await prisma.property.findMany({
      include: {
        bookmarkedBy: true,
      },
    });
    console.log('\n📊 Properties in database:', properties.length);
    properties.forEach(property => {
      console.log(`\n🏠 Property: ${property.title}`);
      console.log(`   Price: $${property.price}`);
      console.log(`   Admin ID: ${property.adminId}`);
      console.log(`   Bookmarked by: ${property.bookmarkedBy.length} users`);
    });

    // Query all messages
    const messages = await prisma.message.findMany({
      include: {
        user: true,
        property: true,
      },
    });
    console.log('\n📊 Messages in database:', messages.length);
    messages.forEach(message => {
      console.log(`\n💬 Message from: ${message.user.name} (${message.user.role})`);
      console.log(`   About property: ${message.property.title}`);
      console.log(`   Content: ${message.content}`);
    });

  } catch (error) {
    console.error('❌ Error querying data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 