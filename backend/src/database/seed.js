import pool from './config.js';
import createTables from './migrate.js';

const seedData = async () => {
  try {
    // First ensure tables exist
    await createTables();
    
    console.log('Seeding database...');

  
    const existingTags = await pool.query('SELECT COUNT(*) FROM tags');
    if (parseInt(existingTags.rows[0].count) > 0) {
      console.log('Data already exists, skipping seed');
      return;
    }

  
    const tagData = [
      { name: "Rice", iconUrl: "https://firebasestorage.googleapis.com/v0/b/heypay-e9f1f.appspot.com/o/food%2Fjapanese-food-rice-svgrepo-com%201.svg_1657125340797?alt=media&token=5e4c0b0b-4a87-45c5-b053-85dfd13f624e" },
      { name: "Chicken", iconUrl: "https://firebasestorage.googleapis.com/v0/b/heypay-e9f1f.appspot.com/o/food%2Fchicken-christmas-food-svgrepo-com%201.svg_1657123972810?alt=media&token=6258348f-0c78-4df0-a15b-f1f1813fb042" },
      { name: "Shawarma", iconUrl: "https://firebasestorage.googleapis.com/v0/b/heypay-e9f1f.appspot.com/o/food%2Fburrito-svgrepo-com%201.svg_1657123337321?alt=media&token=b0db6e73-057f-4040-b106-347f8f32a49d" },
      { name: "Juice", iconUrl: "https://firebasestorage.googleapis.com/v0/b/heypay-e9f1f.appspot.com/o/food%2Fjuice-svgrepo-com%202.svg_1657125631077?alt=media&token=7c8056d4-400a-4ed2-b88e-e456458769cb" },
      { name: "Goat meat", iconUrl: "https://firebasestorage.googleapis.com/v0/b/heypay-e9f1f.appspot.com/o/food%2Fmeat-on-bone-svgrepo-com%201.svg_1657125800626?alt=media&token=ec420ff7-afe9-4a04-8dc4-d82d8e2b39fc" },
      { name: "Fastfood", iconUrl: "https://firebasestorage.googleapis.com/v0/b/heypay-e9f1f.appspot.com/o/food%2Ffast-food-burger-svgrepo-com%202.svg_1657124812917?alt=media&token=d5f00823-8f3a-4085-8edd-76c161fb9618" },
      { name: "Pizza", iconUrl: "https://firebasestorage.googleapis.com/v0/b/heypay-e9f1f.appspot.com/o/food%2Fpizza-svgrepo-com%201.svg_1657126266919?alt=media&token=b0659e3e-1aa8-42ed-8849-93cf927180bc" },
      { name: "Burger", iconUrl: "https://firebasestorage.googleapis.com/v0/b/heypay-e9f1f.appspot.com/o/food%2Fburger-svgrepo-com%202.svg_1657122987363?alt=media&token=ae88b275-a3d9-43b1-8baf-a0e430a57a1d" },
      { name: "Soup bowl", iconUrl: "https://firebasestorage.googleapis.com/v0/b/heypay-e9f1f.appspot.com/o/food%2Fsoup-svgrepo-com%201.svg_1657126696679?alt=media&token=1a7a0734-e08a-4eef-8554-03f014210b7a" },
      { name: "Turkey", iconUrl: "https://firebasestorage.googleapis.com/v0/b/heypay-e9f1f.appspot.com/o/food%2FGroup.svg_1657125210117?alt=media&token=55cbf5ac-a157-42b8-9cb3-b5c782d734a0" },
      { name: "Grills", iconUrl: "https://firebasestorage.googleapis.com/v0/b/heypay-e9f1f.appspot.com/o/food%2Fsausage-meat-svgrepo-com%201.svg_1657126581944?alt=media&token=1450cb6c-4ee8-4110-a9a9-396306bf87d1" },
      { name: "Pounded Yam", iconUrl: "https://firebasestorage.googleapis.com/v0/b/heypay-e9f1f.appspot.com/o/food%2F192px.svg_1666186478054?alt=media&token=f060fce9-2a2c-4164-873d-a65cf05a6f56" },
      { name: "Snacks", iconUrl: "https://firebasestorage.googleapis.com/v0/b/heypay-e9f1f.appspot.com/o/food%2F192px.svg_1666286493527?alt=media&token=11e3897b-f3bb-43f7-b715-bbc9f5b0c751" },
      { name: "Parfait", iconUrl: "https://firebasestorage.googleapis.com/v0/b/heypay-e9f1f.appspot.com/o/food%2Fbakery%2Bsvg%2Bflat%2Bparfait-1319964833384041423.svg_1686046599322?alt=media&token=63ed1035-de63-4ec0-ae2c-d56e995812ce" },
      { name: "Pastries", iconUrl: "https://firebasestorage.googleapis.com/v0/b/heypay-e9f1f.appspot.com/o/food%2Fmuffin-131979035407500020.svg_1686046699134?alt=media&token=44b80646-1d78-4dc7-930b-315aed9bd73d" },
      { name: "Small Chops", iconUrl: "https://firebasestorage.googleapis.com/v0/b/heypay-e9f1f.appspot.com/o/food%2FSamosa.svg_1657289906949?alt=media&token=a56178ee-13ab-4808-961d-c29e5ed55485" },
      { name: "Ewa Agoyin", iconUrl: "https://firebasestorage.googleapis.com/v0/b/heypay-e9f1f.appspot.com/o/food%2FFrame%201482.svg_1657125007546?alt=media&token=f7131558-2d48-4ba1-8981-9f98103aae34" }
    ];


    const tagInsertPromises = tagData.map(tag => 
      pool.query(
        'INSERT INTO tags (name, icon_url) VALUES ($1, $2) RETURNING id, name',
        [tag.name, tag.iconUrl]
      )
    );
    const tagResults = await Promise.all(tagInsertPromises);
    const tagMap = new Map(tagResults.map(result => [result.rows[0].name, result.rows[0].id]));

    console.log(`Inserted ${tagResults.length} tags`);

    const restaurantData = [
      {
        name: "Ile Iyan bodija",
        imageUrl: "https://images.unsplash.com/photo-1555126634-323283e090fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        rating: 4.3,
        ratingsCount: "230+ Ratings",
        isOpen: false,
        status: "Currently closed"
      },
      {
        name: "Jollof Square AgbowoUI",
        imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        rating: 4.5,
        ratingsCount: "1156+ Ratings",
        isOpen: false,
        status: "Currently closed",
        promoText: "10% off order"
      },
      {
        name: "Musanga's Restaurant",
        imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        rating: 3.8,
        ratingsCount: "463+ Ratings",
        isOpen: false,
        status: "Currently closed"
      },
      {
        name: "Omoge Olowosibi",
        imageUrl: "https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        rating: 4.4,
        ratingsCount: "403+ Ratings",
        isOpen: false,
        status: "Currently closed"
      },
      {
        name: "PIZZA LOUNGE",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        rating: 5.0,
        ratingsCount: "0+ Ratings",
        isOpen: false,
        status: "Currently closed",
        promoText: "10% off selected items",
        deliveryInfo: "This store handles it's own deliveries"
      },
      {
        name: "Duos Bite",
        imageUrl: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        rating: 3.4,
        ratingsCount: "17+ Ratings",
        isOpen: false,
        status: "Not taking orders"
      },
      {
        name: "Ile Iyan",
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        rating: 4.1,
        ratingsCount: "332+ Ratings",
        isOpen: false,
        status: "Currently closed"
      },
      {
        name: "FOLTA EXPRESS cafe",
        imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        rating: 3.2,
        ratingsCount: "5+ Ratings",
        isOpen: false,
        status: "Currently closed",
        promoText: "Free delivery"
      }
    ];

    // Insert restaurants
    const restaurantInsertPromises = restaurantData.map(restaurant => 
      pool.query(
        `INSERT INTO restaurants (name, image_url, rating, ratings_count, is_open, status, promo_text, delivery_info) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, name`,
        [
          restaurant.name,
          restaurant.imageUrl,
          restaurant.rating,
          restaurant.ratingsCount,
          restaurant.isOpen,
          restaurant.status,
          restaurant.promoText || null,
          restaurant.deliveryInfo || null
        ]
      )
    );
    const restaurantResults = await Promise.all(restaurantInsertPromises);
    const restaurantMap = new Map(restaurantResults.map(result => [result.rows[0].name, result.rows[0].id]));

    console.log(`Inserted ${restaurantResults.length} restaurants`);

    // Link restaurants to tags
    const restaurantTagMappings = [
      { restaurantName: "Ile Iyan bodija", tagNames: ["Goat meat", "Soup bowl"] },
      { restaurantName: "Jollof Square AgbowoUI", tagNames: ["Rice", "Chicken", "Turkey"] },
      { restaurantName: "Musanga's Restaurant", tagNames: ["Pounded Yam"] },
      { restaurantName: "Omoge Olowosibi", tagNames: ["Chicken", "Rice", "Soup bowl"] },
      { restaurantName: "PIZZA LOUNGE", tagNames: ["Pizza"] },
      { restaurantName: "Duos Bite", tagNames: ["Rice", "Chicken"] },
      { restaurantName: "Ile Iyan", tagNames: ["Goat meat", "Pounded Yam", "Soup bowl"] },
      { restaurantName: "FOLTA EXPRESS cafe", tagNames: ["Snacks", "Parfait", "Pastries"] }
    ];

    let tagLinkCount = 0;
    for (const mapping of restaurantTagMappings) {
      const restaurantId = restaurantMap.get(mapping.restaurantName);
      if (restaurantId) {
        for (const tagName of mapping.tagNames) {
          const tagId = tagMap.get(tagName);
          if (tagId) {
            await pool.query(
              'INSERT INTO restaurant_tags (restaurant_id, tag_id) VALUES ($1, $2)',
              [restaurantId, tagId]
            );
            tagLinkCount++;
          }
        }
      }
    }

    console.log(`Created ${tagLinkCount} restaurant-tag relationships`);
    console.log('Database seeded successfully!');

  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

if (import.meta.url === `file://${process.argv[1]}`) {
  seedData()
    .then(() => {
      console.log('Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

export default seedData;