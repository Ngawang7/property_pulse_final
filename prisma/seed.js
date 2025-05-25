const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      username: 'admin',
      password: hashedPassword,
      role: 'ADMIN',
      image: null,
      imageType: null,
      imageData: null,
    },
  });

  console.log('Created admin user:', admin);

  // Create sample properties
  const properties = [
    {
      name: 'Modern Apartment in Thimphu',
      description: 'Beautiful modern apartment with mountain views',
      location: 'Thimphu',
      type: 'Apartment',
      status: 'For Sale',
      listingType: 'SALE',
      price: 5000000,
      adminId: admin.id,
      sellerName: 'Admin User',
      sellerEmail: 'admin@example.com',
      sellerPhone: '1234567890',
      is_featured: true,
    },
    {
      name: 'Luxury Villa in Paro',
      description: 'Spacious villa with garden and modern amenities',
      location: 'Paro',
      type: 'House',
      status: 'For Rent',
      listingType: 'RENT',
      price: 50000,
      adminId: admin.id,
      sellerName: 'Admin User',
      sellerEmail: 'admin@example.com',
      sellerPhone: '1234567890',
      is_featured: true,
    },
  ];

  for (const property of properties) {
    const createdProperty = await prisma.property.create({
      data: property,
    });
    console.log('Created property:', createdProperty);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 