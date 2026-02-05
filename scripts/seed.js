
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

// Since we are running this as a standalone script in node, we need to manually
// load the env vars or just ask the user to provide them if they aren't set.
// However, 'read' tool showed .env.local exists, so let's try to load it.
// Note: 'dotenv' might not be installed. If not, we'll need to install it or ask user.
// Let's assume for a dev script we can use the client SDK with the public keys if rules allow write.
// The current rules allow write until March 2026, so client SDK is fine.

require('dotenv').config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const MOCK_PRODUCTS = [
  {
    name: 'TWICE 4TH WORLD TOUR [III] ENCORE - CANDYBONG Z',
    description: 'Official light stick for the encore concert. Includes random photocard.',
    images: [
      'https://placehold.co/600x600/FF69B4/FFF?text=CandyBong+Z',
      'https://placehold.co/600x600/FF69B4/FFF?text=Detail+View'
    ],
    price_stage1: 1580,
    price_stage2_est: 200,
    stock: 50,
    status: 'INSTOCK',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    name: 'NAYEON The 2nd Mini Album [NA]',
    description: 'Nayeon\'s second mini album. Includes photobook, CD, and postcards.',
    images: [
      'https://placehold.co/600x600/87CEEB/FFF?text=NAYEON+Album'
    ],
    price_stage1: 650,
    stock: 100,
    status: 'PREORDER',
    releaseDate: '2026-06-14',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    name: 'TWICE Ready To Be World Tour Hoodie',
    description: 'Comfortable oversized hoodie from the Ready To Be tour.',
    images: [
      'https://placehold.co/600x600/000/FFF?text=Tour+Hoodie'
    ],
    price_stage1: 2200,
    price_stage2_est: 350,
    stock: 25,
    status: 'INSTOCK',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
   {
    name: 'JIHYO Zone - Photobook',
    description: 'Exclusive photobook featuring Jihyo.',
    images: [
      'https://placehold.co/600x600/FFA500/FFF?text=JIHYO+Zone'
    ],
    price_stage1: 1200,
    price_stage2_est: 150,
    stock: 0,
    status: 'CLOSED',
    createdAt: Date.now() - 100000,
    updatedAt: Date.now(),
  }
];

async function seed() {
  console.log('Seeding products...');
  const productsRef = collection(db, 'products');

  for (const product of MOCK_PRODUCTS) {
    try {
      const docRef = await addDoc(productsRef, product);
      console.log(`Added product: ${product.name} with ID: ${docRef.id}`);
    } catch (e) {
      console.error(`Error adding product ${product.name}: `, e);
    }
  }
  console.log('Seeding complete.');
  process.exit(0);
}

seed();
