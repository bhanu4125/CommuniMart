import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { Product } from '../models/Product';
import { Order } from '../models/Order';
import { Notice } from '../models/Notice';
import { Message } from '../models/Message';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/communimart';

export async function runSeed() {
  console.log('🌱 Connecting to MongoDB for seeding...');
  await mongoose.connect(MONGO_URI);

  console.log('🧹 Clearing existing database collections...');
  await Promise.all([
    User.deleteMany({}),
    Product.deleteMany({}),
    Order.deleteMany({}),
    Notice.deleteMany({}),
    Message.deleteMany({})
  ]);

  console.log('👥 Creating 10 dummy residents across 4 blocks...');
  const salt = await bcrypt.genSalt(10);
  const defaultPassword = await bcrypt.hash('password123', salt);

  const residentsData = [
    {
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      passwordHash: defaultPassword,
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      role: 'verified_seller',
      phase: 'Phase 1 - Green Meadows',
      block: 'Tower A',
      flatNumber: 'A-402',
      hideFlatNumber: false,
      verificationStatus: 'verified',
      badges: ['Verified Resident', 'Trusted Baker', 'Prompt Handover'],
      rating: 4.9,
      ratingCount: 28,
      upiId: 'priyabakes@okhdfcbank',
      bio: 'Passionate sourdough enthusiast and weekend home baker. Resident of Tower A since 2021.'
    },
    {
      name: 'Vikram Malhotra',
      email: 'vikram.malhotra@example.com',
      passwordHash: defaultPassword,
      phone: '+91 98111 22334',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      role: 'committee_admin',
      phase: 'Phase 1 - Green Meadows',
      block: 'Tower B',
      flatNumber: 'B-101',
      hideFlatNumber: false,
      verificationStatus: 'verified',
      badges: ['Verified Resident', 'Society Committee Lead', 'Punctual Neighbor'],
      rating: 5.0,
      ratingCount: 42,
      upiId: 'vikram.society@icici',
      bio: 'Managing Committee Secretary for Green Meadows. Tech lead by day, avid cyclist by weekend.'
    },
    {
      name: 'Ananya Iyer',
      email: 'ananya.iyer@example.com',
      passwordHash: defaultPassword,
      phone: '+91 99222 33445',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'verified_seller',
      phase: 'Phase 1 - Green Meadows',
      block: 'Tower C',
      flatNumber: 'C-704',
      hideFlatNumber: true, // Privacy enabled!
      verificationStatus: 'verified',
      badges: ['Verified Resident', 'Green Thumb Master', 'Super Neighbor'],
      rating: 4.8,
      ratingCount: 19,
      upiId: 'ananya.plants@oksbi',
      bio: 'Balcony urban gardener propagating rare houseplants and organic herbs.'
    },
    {
      name: 'Rajesh & Meera Kulkarni',
      email: 'rajesh.k@example.com',
      passwordHash: defaultPassword,
      phone: '+91 97333 44556',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      role: 'resident',
      phase: 'Phase 2 - Orchid Woods',
      block: 'Villa Grove',
      flatNumber: 'Villa-14',
      hideFlatNumber: false,
      verificationStatus: 'verified',
      badges: ['Verified Resident', 'Punctual Neighbor'],
      rating: 4.9,
      ratingCount: 15,
      upiId: 'rajesh.villa14@axisbank',
      bio: 'Happy to lend household tools, camping gear, and lawn maintenance equipment.'
    },
    {
      name: 'Dr. Aris Thorne',
      email: 'aris.thorne@example.com',
      passwordHash: defaultPassword,
      phone: '+91 98444 55667',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      role: 'resident',
      phase: 'Phase 1 - Green Meadows',
      block: 'Tower A',
      flatNumber: 'A-1201',
      hideFlatNumber: true,
      verificationStatus: 'verified',
      badges: ['Verified Resident', 'Bookworm'],
      rating: 5.0,
      ratingCount: 12,
      upiId: 'aris.thorne@okaxis',
      bio: 'Literature professor and board game collector. Always open for trades!'
    },
    {
      name: 'Sunita Deshmukh',
      email: 'sunita.d@example.com',
      passwordHash: defaultPassword,
      phone: '+91 99555 66778',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      role: 'resident',
      phase: 'Phase 1 - Green Meadows',
      block: 'Tower B',
      flatNumber: 'B-405',
      hideFlatNumber: false,
      verificationStatus: 'verified',
      badges: ['Verified Resident', 'Kids Corner Hero'],
      rating: 4.7,
      ratingCount: 9,
      upiId: 'sunita.d@paytm',
      bio: 'Mother of two wonderful kids. Regularly decluttering outgrown toys and STEM kits.'
    },
    {
      name: 'Karan Mehra',
      email: 'karan.m@example.com',
      passwordHash: defaultPassword,
      phone: '+91 98666 77889',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      role: 'resident',
      phase: 'Phase 1 - Green Meadows',
      block: 'Tower C',
      flatNumber: 'C-302',
      hideFlatNumber: false,
      verificationStatus: 'verified',
      badges: ['Verified Resident', 'Audio Geek'],
      rating: 4.9,
      ratingCount: 14,
      upiId: 'karan.mehra@kotak',
      bio: 'Software engineer and audiophile. Rotating audio gadgets and monitors.'
    },
    {
      name: 'Rohit Sen',
      email: 'rohit.sen@example.com',
      passwordHash: defaultPassword,
      phone: '+91 97777 88990',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      role: 'verified_seller',
      phase: 'Phase 2 - Orchid Woods',
      block: 'Villa Grove',
      flatNumber: 'Villa-08',
      hideFlatNumber: false,
      verificationStatus: 'verified',
      badges: ['Verified Resident', 'Pet Care Champ', 'Punctual Neighbor'],
      rating: 5.0,
      ratingCount: 22,
      upiId: 'rohit.petcare@icici',
      bio: 'Certified pet CPR trainer & dog lover. Offering weekend sitting for neighborhood pets.'
    },
    {
      name: 'Sneha Patel',
      email: 'sneha.patel@example.com',
      passwordHash: defaultPassword,
      phone: '+91 98888 99001',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      role: 'resident',
      phase: 'Phase 1 - Green Meadows',
      block: 'Tower A',
      flatNumber: 'A-303',
      hideFlatNumber: false,
      verificationStatus: 'pending', // Pending approval to demo committee approval!
      badges: ['New Neighbor'],
      rating: 5.0,
      ratingCount: 1,
      upiId: 'sneha.patel@okhdfcbank',
      bio: 'Recently shifted to Tower A-303 with family. Excited to meet everyone!'
    },
    {
      name: 'Arjun Nambiar',
      email: 'arjun.n@example.com',
      passwordHash: defaultPassword,
      phone: '+91 99999 11223',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      role: 'resident',
      phase: 'Phase 1 - Green Meadows',
      block: 'Tower B',
      flatNumber: 'B-802',
      hideFlatNumber: true,
      verificationStatus: 'verified',
      badges: ['Verified Resident', 'Tech Handyman'],
      rating: 4.8,
      ratingCount: 8,
      upiId: 'arjun.tech@okaxis',
      bio: 'DIY enthusiast with high-end power tools and automotive detailing gear.'
    }
  ];

  const createdResidents = await User.create(residentsData);
  console.log(`✅ Created ${createdResidents.length} residents`);

  const [
    priya,
    vikram,
    ananya,
    rajesh,
    aris,
    sunita,
    karan,
    rohit,
    sneha,
    arjun
  ] = createdResidents;

  console.log('📦 Seeding 26 hyper-realistic community marketplace products...');

  const productsData = [
    // 1. Fresh Home Bakes & Meals
    {
      title: 'Artisanal Country Sourdough Batard (Organic Flour)',
      description: 'Slow-fermented for 36 hours with wild sourdough starter. Crispy blistered crust with soft, airy open crumb. Baked fresh every Saturday morning!',
      category: 'Fresh Home Bakes & Meals',
      listingMode: 'sell',
      price: 240,
      condition: 'Brand New',
      images: [
        'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80'
      ],
      seller: priya._id,
      block: priya.block,
      handoverOptions: ['Doorstep Delivery', 'Club House / Security Gate Drop-box', 'Direct Pickup from Seller Flat'],
      tags: ['bread', 'sourdough', 'vegan', 'fresh', 'baking'],
      views: 142,
      featured: true
    },
    {
      title: 'Dark Chocolate & Salted Caramel Babka (600g loaf)',
      description: 'Buttery brioche swirl ribboned with 70% Callebaut dark chocolate and homemade sea salt caramel. Serves 4-6 people with evening chai.',
      category: 'Fresh Home Bakes & Meals',
      listingMode: 'sell',
      price: 380,
      condition: 'Brand New',
      images: [
        'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80'
      ],
      seller: priya._id,
      block: priya.block,
      handoverOptions: ['Doorstep Delivery', 'Direct Pickup from Seller Flat'],
      tags: ['babka', 'dessert', 'chocolate', 'cake'],
      views: 98,
      featured: true
    },
    {
      title: 'Traditional South Indian Filter Coffee Decoction (500ml glass bottle)',
      description: 'Freshly brewed strong chicory-blend decoction made in brass filter. Keep in fridge for up to 5 days. Makes 12-15 cups of divine morning froth.',
      category: 'Fresh Home Bakes & Meals',
      listingMode: 'sell',
      price: 180,
      condition: 'Brand New',
      images: [
        'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80'
      ],
      seller: ananya._id,
      block: ananya.block,
      handoverOptions: ['Direct Pickup from Seller Flat', 'Club House / Security Gate Drop-box'],
      tags: ['coffee', 'filter coffee', 'beverage', 'morning'],
      views: 65,
      featured: false
    },
    {
      title: 'Weekend Hyderabadi Dum Biryani Box (Serves 2-3)',
      description: 'Dum-cooked in copper degchi with fragrant long-grain aged Basmati and fresh garden herbs. Includes mirchi ka salan and burani raita. Ready at 1:30 PM Sunday.',
      category: 'Fresh Home Bakes & Meals',
      listingMode: 'sell',
      price: 450,
      condition: 'Brand New',
      images: [
        'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80'
      ],
      seller: vikram._id,
      block: vikram.block,
      handoverOptions: ['Doorstep Delivery', 'Direct Pickup from Seller Flat'],
      tags: ['biryani', 'meal', 'lunch', 'sunday'],
      views: 210,
      featured: true
    },

    // 2. Pre-loved Electronics
    {
      title: 'Bose QuietComfort 45 Noise Cancelling Headphones',
      description: 'Pristine condition, bought 9 months ago. Outstanding active noise cancellation, lightweight cushion cups, 24-hr battery. Comes with original hardshell case and aux cable.',
      category: 'Pre-loved Electronics',
      listingMode: 'sell',
      price: 13500,
      condition: 'Like New',
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&auto=format&fit=crop&q=80'
      ],
      seller: karan._id,
      block: karan.block,
      handoverOptions: ['Direct Pickup from Seller Flat', 'Doorstep Delivery'],
      tags: ['audio', 'bose', 'headphones', 'bluetooth'],
      views: 312,
      featured: true
    },
    {
      title: 'Amazon Kindle Paperwhite (10th Gen, 8GB, Waterproof, Twilight Blue)',
      description: '300 ppi glare-free display with adjustable warm light. Battery lasts weeks. Loaded with 40+ classic novels. Screen is scratch-free with magnetic leather cover included.',
      category: 'Pre-loved Electronics',
      listingMode: 'sell',
      price: 4800,
      condition: 'Like New',
      images: [
        'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=600&auto=format&fit=crop&q=80'
      ],
      seller: aris._id,
      block: aris.block,
      handoverOptions: ['Doorstep Delivery', 'Club House / Security Gate Drop-box'],
      tags: ['kindle', 'ereader', 'books', 'gadgets'],
      views: 184,
      featured: false
    },
    {
      title: 'LG UltraFine 27-inch 4K UHD IPS Monitor (USB-C 60W PD)',
      description: 'Perfect for work from home or MacBook dual-screen setup. HDR10, sRGB 98%, height & tilt adjustable stand. Zero dead pixels. Box available.',
      category: 'Pre-loved Electronics',
      listingMode: 'sell',
      price: 18500,
      condition: 'Good',
      images: [
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80'
      ],
      seller: karan._id,
      block: karan.block,
      handoverOptions: ['Direct Pickup from Seller Flat'],
      tags: ['monitor', 'screen', 'lg', 'wfh'],
      views: 220,
      featured: false
    },
    {
      title: 'Raspberry Pi 4 Model B (4GB RAM) + Argon ONE Aluminum Case',
      description: 'Includes power adapter, mini-HDMI cable, and 64GB SanDisk Extreme MicroSD with Ubuntu Server preinstalled. Great for home automation, Pi-hole, or Plex media server.',
      category: 'Pre-loved Electronics',
      listingMode: 'sell',
      price: 3600,
      condition: 'Like New',
      images: [
        'https://images.unsplash.com/photo-1517055729441-db3a6588880e?w=600&auto=format&fit=crop&q=80'
      ],
      seller: arjun._id,
      block: arjun.block,
      handoverOptions: ['Club House / Security Gate Drop-box', 'Direct Pickup from Seller Flat'],
      tags: ['raspberrypi', 'tech', 'coding', 'maker'],
      views: 110,
      featured: false
    },

    // 3. Home & Furniture
    {
      title: 'IKEA POÄNG Armchair with Hillared Dark Blue Cushion',
      description: 'Iconic curved oak veneer frame that provides comfortable resilience. Cushion cover is freshly dry-cleaned. Moving overseas, hence decluttering.',
      category: 'Home & Furniture',
      listingMode: 'sell',
      price: 3200,
      condition: 'Good',
      images: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80'
      ],
      seller: sunita._id,
      block: sunita.block,
      handoverOptions: ['Direct Pickup from Seller Flat'],
      tags: ['chair', 'ikea', 'armchair', 'furniture'],
      views: 175,
      featured: false
    },
    {
      title: 'Solid Sheesham Wood Work-From-Home Study Desk (4ft x 2ft)',
      description: 'Crafted from authentic Indian Rosewood with warm honey teak finish. Features 2 smooth sliding drawers with brass ring pulls. Sturdy enough to last a lifetime.',
      category: 'Home & Furniture',
      listingMode: 'sell',
      price: 5400,
      condition: 'Like New',
      images: [
        'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&auto=format&fit=crop&q=80'
      ],
      seller: rajesh._id,
      block: rajesh.block,
      handoverOptions: ['Direct Pickup from Seller Flat'],
      tags: ['desk', 'wood', 'table', 'furniture'],
      views: 195,
      featured: true
    },
    {
      title: 'Set of 3 Handwoven Bohemian Jute Planter Baskets',
      description: 'Free to any neighbor! Made from eco-friendly jute, waterproof inner lining. Fits 6", 8", and 10" pots. Downsizing our balcony decor.',
      category: 'Home & Furniture',
      listingMode: 'giveaway',
      price: 0,
      condition: 'Good',
      images: [
        'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&auto=format&fit=crop&q=80'
      ],
      seller: ananya._id,
      block: ananya.block,
      handoverOptions: ['Club House / Security Gate Drop-box', 'Direct Pickup from Seller Flat'],
      tags: ['free', 'giveaway', 'planter', 'jute', 'decor'],
      views: 290,
      featured: true
    },

    // 4. Kids & Toys
    {
      title: 'LEGO Technic Bugatti Bolide Racing Car (905 pcs complete set)',
      description: 'Includes original box, step-by-step instruction manual, and spare pins. Assembled once and kept in a glass vitrine. Perfect for young builders aged 9+.',
      category: 'Kids & Toys',
      listingMode: 'sell',
      price: 2600,
      condition: 'Like New',
      images: [
        'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=600&auto=format&fit=crop&q=80'
      ],
      seller: sunita._id,
      block: sunita.block,
      handoverOptions: ['Doorstep Delivery', 'Direct Pickup from Seller Flat'],
      tags: ['lego', 'toys', 'kids', 'racing'],
      views: 145,
      featured: false
    },
    {
      title: 'Strider 12 Sport Kids Balance Bike (Orange) - Rent by Day/Week',
      description: 'The easiest way for toddlers (18 months - 5 years) to learn balance before moving to pedal bikes. Puncture-proof tires, adjustable seat. Helmet provided for free.',
      category: 'Kids & Toys',
      listingMode: 'rent',
      price: 150,
      rentDuration: 'day',
      rentDeposit: 500,
      condition: 'Good',
      images: [
        'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=600&auto=format&fit=crop&q=80'
      ],
      seller: sunita._id,
      block: sunita.block,
      handoverOptions: ['Club House / Security Gate Drop-box', 'Direct Pickup from Seller Flat'],
      tags: ['bike', 'kids', 'toddler', 'rental', 'strider'],
      views: 89,
      featured: false
    },
    {
      title: 'Montessori Wooden Toddler Activity Board & Shape Sorter',
      description: 'Free to a good home! Organic beechwood with child-safe water-based paints. My 4yo has outgrown it completely. Cleaned and sanitized.',
      category: 'Kids & Toys',
      listingMode: 'giveaway',
      price: 0,
      condition: 'Good',
      images: [
        'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&auto=format&fit=crop&q=80'
      ],
      seller: priya._id,
      block: priya.block,
      handoverOptions: ['Club House / Security Gate Drop-box'],
      tags: ['montessori', 'free', 'giveaway', 'baby', 'puzzle'],
      views: 230,
      featured: true
    },

    // 5. Skill Exchange & Services
    {
      title: 'Weekend Dog Walking & Gentle In-Home Pet Sitting',
      description: 'Going out of town for the weekend? Let me take your fur baby on gentle morning walks in our society park, feed them on time, and send photo updates hourly!',
      category: 'Skill Exchange & Services',
      listingMode: 'rent',
      price: 300,
      rentDuration: 'day',
      condition: 'Brand New',
      images: [
        'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&auto=format&fit=crop&q=80'
      ],
      seller: rohit._id,
      block: rohit.block,
      handoverOptions: ['Doorstep Delivery'],
      tags: ['pets', 'dog sitting', 'pet care', 'service'],
      views: 180,
      featured: true
    },
    {
      title: 'ICSE/CBSE Grade 9-12 Physics & Calculus Neighbor Tutoring',
      description: 'IIT Madras alumnus living in Tower B. One-on-one conceptual doubt clearing, HC Verma problem sets, and board exam exam prep right at the Club House library.',
      category: 'Skill Exchange & Services',
      listingMode: 'rent',
      price: 500,
      rentDuration: 'hour',
      condition: 'Brand New',
      images: [
        'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80'
      ],
      seller: vikram._id,
      block: vikram.block,
      handoverOptions: ['Direct Pickup from Seller Flat'],
      tags: ['tutoring', 'physics', 'maths', 'education', 'study'],
      views: 160,
      featured: false
    },
    {
      title: 'Complete Car Foam Wash & Interior Vacuum Service (At Your Parking Slot)',
      description: 'Using high-pressure cordless washer, Meguiar\'s car shampoo, microfiber mitts, and interior upholstery vacuum. No hassle of driving to a service center.',
      category: 'Skill Exchange & Services',
      listingMode: 'rent',
      price: 400,
      rentDuration: 'hour',
      condition: 'Brand New',
      images: [
        'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=600&auto=format&fit=crop&q=80'
      ],
      seller: arjun._id,
      block: arjun.block,
      handoverOptions: ['Doorstep Delivery'],
      tags: ['car wash', 'detailing', 'cleaning', 'service'],
      views: 240,
      featured: true
    },

    // 6. Garden & Plants
    {
      title: 'Rooted Monstera Deliciosa with Ceramic Glazed Pot',
      description: 'Healthy 2-foot Swiss Cheese plant with 5 large fenestrated leaves. Thriving in peat-perlite potting mix. Easy care, great for living rooms and balconies.',
      category: 'Garden & Plants',
      listingMode: 'sell',
      price: 650,
      condition: 'Brand New',
      images: [
        'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600&auto=format&fit=crop&q=80'
      ],
      seller: ananya._id,
      block: ananya.block,
      handoverOptions: ['Direct Pickup from Seller Flat', 'Doorstep Delivery'],
      tags: ['plants', 'monstera', 'indoor', 'garden'],
      views: 135,
      featured: false
    },
    {
      title: 'Variegated Golden Pothos (Money Plant) Cuttings - Free to Neighbors!',
      description: 'Have pruned my 10-foot pothos vine! 4 water-rooted glass vials ready for planting into soil or keeping on your study desk. Free for fellow plant lovers.',
      category: 'Garden & Plants',
      listingMode: 'giveaway',
      price: 0,
      condition: 'Brand New',
      images: [
        'https://images.unsplash.com/photo-1545241047-6083a3684587?w=600&auto=format&fit=crop&q=80'
      ],
      seller: ananya._id,
      block: ananya.block,
      handoverOptions: ['Club House / Security Gate Drop-box', 'Direct Pickup from Seller Flat'],
      tags: ['free', 'moneyplant', 'cuttings', 'green', 'plants'],
      views: 310,
      featured: true
    },
    {
      title: '5kg Bag of Organic Vermicompost & Neem Khali Powder',
      description: 'Locally procured cow dung vermicompost enriched with neem cake to protect roots from fungal attacks. Great for vegetable planters and flowering roses.',
      category: 'Garden & Plants',
      listingMode: 'sell',
      price: 220,
      condition: 'Brand New',
      images: [
        'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&auto=format&fit=crop&q=80'
      ],
      seller: rajesh._id,
      block: rajesh.block,
      handoverOptions: ['Club House / Security Gate Drop-box', 'Direct Pickup from Seller Flat'],
      tags: ['fertilizer', 'compost', 'organic', 'soil'],
      views: 78,
      featured: false
    },

    // 7. Tools & Utilities
    {
      title: 'Heavy Duty 8-Step Aluminum Folding Ladder (Rent by Day)',
      description: 'Anti-skid rubber feet with 150kg weight capacity. Ideal for ceiling fan cleaning, curtain rod installation, or deep Diwali/holiday cleaning.',
      category: 'Tools & Utilities',
      listingMode: 'rent',
      price: 100,
      rentDuration: 'day',
      rentDeposit: 300,
      condition: 'Good',
      images: [
        'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=600&auto=format&fit=crop&q=80'
      ],
      seller: rajesh._id,
      block: rajesh.block,
      handoverOptions: ['Direct Pickup from Seller Flat', 'Club House / Security Gate Drop-box'],
      tags: ['ladder', 'tools', 'repair', 'diy', 'rental'],
      views: 165,
      featured: false
    },
    {
      title: 'Bosch Cordless Drill & Impact Screwdriver Kit (18V Lithium-Ion)',
      description: 'Includes 2 batteries, fast charger, 30 masonry/wood drill bits, and wall anchors. Rent for your weekend furniture assembly or TV mount hanging.',
      category: 'Tools & Utilities',
      listingMode: 'rent',
      price: 200,
      rentDuration: 'day',
      rentDeposit: 1000,
      condition: 'Like New',
      images: [
        'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80'
      ],
      seller: arjun._id,
      block: arjun.block,
      handoverOptions: ['Club House / Security Gate Drop-box', 'Direct Pickup from Seller Flat'],
      tags: ['drill', 'bosch', 'tools', 'diy'],
      views: 140,
      featured: false
    },
    {
      title: 'Kärcher K2 High Pressure Washer (110 Bar) for Balcony & Car',
      description: 'Blast away moss, algae, and grime from balcony tiles, window mesh, and patio furniture in minutes. Includes dirt blaster nozzle and 4m pressure hose.',
      category: 'Tools & Utilities',
      listingMode: 'rent',
      price: 250,
      rentDuration: 'day',
      rentDeposit: 1000,
      condition: 'Like New',
      images: [
        'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80'
      ],
      seller: arjun._id,
      block: arjun.block,
      handoverOptions: ['Direct Pickup from Seller Flat'],
      tags: ['pressure washer', 'cleaning', 'tools', 'karcher'],
      views: 188,
      featured: true
    },

    // 8. Books & Hobbies
    {
      title: 'Complete Harry Potter Hardcover Special Edition Box Set (7 Books)',
      description: 'Bloomsbury adult hardcover edition with beautiful foil stamped spines. Read once, kept in smoke-free home library. Perfect gift for book lovers.',
      category: 'Books & Hobbies',
      listingMode: 'sell',
      price: 3200,
      condition: 'Like New',
      images: [
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'
      ],
      seller: aris._id,
      block: aris.block,
      handoverOptions: ['Doorstep Delivery', 'Club House / Security Gate Drop-box'],
      tags: ['books', 'harrypotter', 'reading', 'novels'],
      views: 260,
      featured: true
    },
    {
      title: 'Settlers of Catan Board Game (5th Edition Complete)',
      description: 'All hexagonal tiles, resource cards, dice, and wooden settlements in pristine condition. Great for neighborhood board game nights at the Club House!',
      category: 'Books & Hobbies',
      listingMode: 'sell',
      price: 1950,
      condition: 'Like New',
      images: [
        'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=600&auto=format&fit=crop&q=80'
      ],
      seller: aris._id,
      block: aris.block,
      handoverOptions: ['Club House / Security Gate Drop-box', 'Direct Pickup from Seller Flat'],
      tags: ['catan', 'boardgames', 'fun', 'strategy'],
      views: 198,
      featured: false
    },
    {
      title: 'Yonex Astrox 77 Badminton Racket Set with 3 Feather Shuttles',
      description: 'Strung with BG65 at 24 lbs. Grip is fresh. Looking to pass it on as I\'ve upgraded to Astrox 88. Can test at our society badminton court.',
      category: 'Books & Hobbies',
      listingMode: 'sell',
      price: 2400,
      condition: 'Good',
      images: [
        'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop&q=80'
      ],
      seller: vikram._id,
      block: vikram.block,
      handoverOptions: ['Direct Pickup from Seller Flat', 'Doorstep Delivery'],
      tags: ['badminton', 'yonex', 'sports', 'fitness'],
      views: 140,
      featured: false
    }
  ];

  const createdProducts = await Product.create(productsData);
  console.log(`✅ Created ${createdProducts.length} realistic marketplace products`);

  console.log('📋 Seeding Community Notice Board alerts and requests...');
  const noticesData = [
    {
      author: sneha._id,
      title: 'Looking to borrow a portable drill for 2 hours this evening',
      description: 'Just moved in to Tower A-303 and need to hang two wall clocks and a mirror. Will return before 8 PM with homemade cookies! 🍪',
      category: 'Request / Borrow',
      urgency: 'urgent',
      resolved: false,
      repliesCount: 3
    },
    {
      author: priya._id,
      title: 'Freshly baked Cinnamon Rolls ready at Tower A-402 (5 PM today)',
      description: 'Taking orders for warm brioche cinnamon rolls with cream cheese glaze. Limited to 8 boxes. Ping me directly or drop by A-402!',
      category: 'Flash Sale / Treat',
      urgency: 'normal',
      resolved: false,
      repliesCount: 6
    },
    {
      author: vikram._id,
      title: 'Society Annual Solar Rooftop Maintenance & Power Window this Saturday',
      description: 'Please note the Club House inverter switchover from 10 AM to 12 PM this Saturday. Regular lifts and water pumps will run on backup DG.',
      category: 'Notice / Alert',
      urgency: 'normal',
      resolved: false,
      repliesCount: 2
    },
    {
      author: rohit._id,
      title: 'Free Puppy Socialization Session at Central Lawn this Sunday 8 AM',
      description: 'Bringing together all society dog parents to let our pups play gently off-leash in the fenced dog run area. Treats & waste bags on me!',
      category: 'Skill Offer',
      urgency: 'normal',
      resolved: false,
      repliesCount: 9
    }
  ];

  await Notice.create(noticesData);
  console.log(`✅ Created ${noticesData.length} community notices`);

  console.log('🛒 Seeding initial orders with lifecycles...');
  const [sourdough, bose, ladder, catan] = createdProducts;

  // Order 1: Completed & Reviewed
  await Order.create({
    product: sourdough._id,
    buyer: vikram._id,
    seller: priya._id,
    status: 'Completed',
    paymentMethod: 'direct_upi',
    paymentStatus: 'paid',
    handoverOption: 'Doorstep Delivery',
    handoverNote: 'Left at doorstep hanger. Rang bell.',
    totalAmount: sourdough.price,
    upiReference: 'CM-ORD-492019-721',
    review: {
      rating: 5,
      comment: 'Best sourdough loaf in the entire society! Still warm when delivered to Tower B.',
      badgesAwarded: ['Trusted Baker', 'Punctual Neighbor'],
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
    },
    timeline: [
      { status: 'Requested', timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000), note: 'Order placed by Vikram (B-101)' },
      { status: 'Accepted by Neighbor', timestamp: new Date(Date.now() - 34 * 60 * 60 * 1000), note: 'Priya accepted request' },
      { status: 'Ready for Handover', timestamp: new Date(Date.now() - 28 * 60 * 60 * 1000), note: 'Freshly baked and packed in paper bag' },
      { status: 'Completed', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), note: 'Doorstep delivery completed' }
    ]
  });

  // Order 2: Ready for Handover
  await Order.create({
    product: ladder._id,
    buyer: karan._id,
    seller: rajesh._id,
    status: 'Ready for Handover',
    paymentMethod: 'cash_on_handover',
    paymentStatus: 'pending',
    handoverOption: 'Club House / Security Gate Drop-box',
    handoverNote: 'Kept with Security Guard Ramesh at Gate 1.',
    totalAmount: ladder.price,
    upiReference: 'CM-ORD-881290-345',
    timeline: [
      { status: 'Requested', timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), note: 'Rental requested for 1 day' },
      { status: 'Accepted by Neighbor', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), note: 'Rajesh accepted rental' },
      { status: 'Ready for Handover', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), note: 'Dropped at Gate 1 Security Desk' }
    ]
  });

  // Order 3: Requested (Fresh order to test accepting/advancing!)
  await Order.create({
    product: bose._id,
    buyer: aris._id,
    seller: karan._id,
    status: 'Requested',
    paymentMethod: 'society_escrow',
    paymentStatus: 'pending',
    handoverOption: 'Direct Pickup from Seller Flat',
    handoverNote: 'Can come inspect around 6 PM after work.',
    totalAmount: bose.price,
    upiReference: 'CM-ORD-991204-512',
    timeline: [
      { status: 'Requested', timestamp: new Date(), note: 'Order requested with Society Escrow guarantee' }
    ]
  });

  console.log('💬 Seeding chat messages...');
  await Message.create([
    {
      sender: vikram._id,
      recipient: priya._id,
      product: sourdough._id,
      text: 'Hi Priya! Is your sourdough bread vegan friendly?',
      isQuickReply: false,
      read: true
    },
    {
      sender: priya._id,
      recipient: vikram._id,
      product: sourdough._id,
      text: 'Yes Vikram! Just organic flour, filtered water, pink salt and wild yeast culture. No dairy or eggs.',
      isQuickReply: false,
      read: true
    },
    {
      sender: vikram._id,
      recipient: priya._id,
      product: sourdough._id,
      text: 'Awesome, just placed an order for one batard! Can you drop it at B-101?',
      isQuickReply: false,
      read: true
    },
    {
      sender: priya._id,
      recipient: vikram._id,
      product: sourdough._id,
      text: 'Will do! Will hang it on your door hook by 4 PM.',
      isQuickReply: false,
      read: true
    }
  ]);

  console.log('🎉 Seeding successfully completed!');
  await mongoose.disconnect();
}

if (require.main === module) {
  runSeed().catch(err => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
}
