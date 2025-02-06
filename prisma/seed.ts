import { db } from '@/server/db';

async function main() {
  const coffees = [
    {
      name: "Espresso",
      description: "A strong and bold coffee served in a small shot.",
      price: 1.5,
      image:
        "https://upload.wikimedia.org/wikipedia/commons/f/ff/Cup_of_Espresso_1290041.jpg",
    },
    {
      name: "Latte",
      description: "A smooth coffee drink made with espresso and steamed milk.",
      price: 2.5,
      image:
        "https://upload.wikimedia.org/wikipedia/commons/9/9f/Caffe_Latte_cup.jpg",
    },
    {
      name: "Cappuccino",
      description:
        "A balanced coffee with espresso, steamed milk, and frothy foam.",
      price: 2.8,
      image:
        "https://upload.wikimedia.org/wikipedia/commons/7/79/Italian_cappuccino.jpg",
    },
    {
      name: "Americano",
      description: "Espresso diluted with hot water for a milder taste.",
      price: 2.0,
      image:
        "https://upload.wikimedia.org/wikipedia/commons/d/d4/Caff%C3%A8_Americano.JPG",
    },
    {
      name: "Mocha",
      description: "A sweet mix of espresso, chocolate, and steamed milk.",
      price: 3.2,
      image:
        "https://upload.wikimedia.org/wikipedia/commons/7/7e/Mocha_coffee.jpg",
    },
    {
      name: "Macchiato",
      description: "Espresso with a small amount of foamed milk.",
      price: 2.2,
      image:
        "https://upload.wikimedia.org/wikipedia/commons/d/dc/Latte_Macchiato_%281%29.jpg",
    },
    {
      name: "Iced Coffee",
      description:
        "Chilled coffee served over ice for a refreshing experience.",
      price: 2.7,
      image:
        "https://upload.wikimedia.org/wikipedia/commons/4/4e/The_Coffee_life_%28Unsplash%29.jpg",
    },
  ];

  for (const coffee of coffees) {
    await db.coffee.upsert({
      where: { 
        name: coffee.name 
      },
      update: {},
      create: {
        name: coffee.name,
        description: coffee.description,
        price: coffee.price,
        image: coffee.image,
      },
    });
  }

  console.log("✅ Seeding complete!");
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
