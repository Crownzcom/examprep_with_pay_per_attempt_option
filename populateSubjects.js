// const { Client, Databases } = require('appwrite');

// // Appwrite configuration
// const client = new Client()
//   .setEndpoint('https://appwrite.exampreptutor.com/v1') // e.g., 'https://cloud.appwrite.io/v1'
//   .setProject('66a604290011456dccf3');

// const databases = new Databases(client);

// const database_id = '655f5a677fcf3b1d8b79'; // Replace with your database ID
// const subjectsTable_id = '6821df580035bda5b425'; // Replace with your collection ID

// // Collection metadata
// const collectionMetadata = {
//   '67ab1c58000047ae76d8': { type: 'practical', subjectName: 'Biology' },
//   '67ab1c240009b61410bb': { type: 'practical', subjectName: 'Physics' },
//   '672df1c30039f7cc043f': { type: 'practical', subjectName: 'Chemistry' },
//   '673447d1001ca059bcf3': { type: 'theory', package: 'standard', subjectName: 'Geography' },
//   '671671c300032b03732c': { type: 'theory', package: 'standard', subjectName: 'Math' },
//   '6708f89b001c6e8e17e0': { type: 'theory', package: 'standard', subjectName: 'History' },
//   '66d6dfc8003d2aa43874': { type: 'theory', package: 'standard', subjectName: 'English' },
//   '66ec15220001235fbcdf': { type: 'theory', package: 'standard', subjectName: 'Chemistry' },
//   '6792056e001d897869c3': { type: 'theory', package: 'standard', subjectName: 'Biology' },
//   '673476de000384c2e19c': { type: 'theory', package: 'standard', subjectName: 'Physics' },
//   '681c9a630027fbe59660': {
//     type: 'theory',
//     package: 'holiday',
//     classLevel: 'Senior Three',
//     subjectName: 'Chemistry',
//   },
//   '681c9aed002c642f9b1e': {
//     type: 'theory',
//     package: 'holiday',
//     classLevel: 'Senior Three',
//     subjectName: 'Biology',
//   },
//   '681c9bbc0031618168bf': {
//     type: 'theory',
//     package: 'holiday',
//     classLevel: 'Senior Four',
//     subjectName: 'Chemistry',
//   },
//   '681c9b8c00156bfb2991': {
//     type: 'theory',
//     package: 'holiday',
//     classLevel: 'Senior Four',
//     subjectName: 'Biology',
//   },
// };

// async function populateSubjects() {
//   try {
//     console.log('Starting to populate subjects...');
//     let successCount = 0;
//     let errorCount = 0;

//     for (const [id, data] of Object.entries(collectionMetadata)) {
//       try {
//         await databases.createDocument(database_id, subjectsTable_id, id, {
//           subjectName: data.subjectName,
//           type: data.type,
//           package: data.package || null,
//           classLevel: data.classLevel || null,
//         });
//         console.log(`Created document with ID: ${id} (${data.subjectName})`);
//         successCount++;
//       } catch (err) {
//         console.error(`Failed to create document with ID: ${id} (${data.subjectName})`, err.message);
//         errorCount++;
//       }
//     }

//     console.log(`Population complete. Success: ${successCount}, Errors: ${errorCount}`);
//     if (errorCount > 0) {
//       console.log('Some documents failed to create. Check the errors above and verify collection attributes.');
//     }
//   } catch (err) {
//     console.error('Error during population:', err);
//   }
// }

// // Run the script
// populateSubjects().catch((err) => {
//   console.error('Script execution failed:', err);
// });

//==========================================================================================================

const { Client, Databases } = require('appwrite');

// Appwrite configuration
const client = new Client()
  .setEndpoint('https://appwrite.exampreptutor.com/v1') // e.g., 'https://cloud.appwrite.io/v1'
  .setProject('66a604290011456dccf3');

const databases = new Databases(client);

const database_id = '655f5a677fcf3b1d8b79'; // Replace with your database ID
const subjectsTable_id = '6821df580035bda5b425'; // Replace with your collection ID

// Collection metadata
const collectionMetadata = {
  '65c5cdfe8c088bce8e52': {subjectName: 'Math', level: 'PLE', price: 300},
  '65ca0733ec7937ed2f96': {subjectName: 'Science', level: 'PLE', price: 300},
  '65a90a70741e52dd96fe': {subjectName: 'Social Studies', level: 'PLE', price: 300},
  '6823069d00063d7d6ac3': {subjectName: 'English', level: 'PLE', price: 300},
  '67ab1c58000047ae76d8': { type: 'practical', subjectName: 'Biology', level: 'UCE', price: 500},
  '67ab1c240009b61410bb': { type: 'practical', subjectName: 'Physics', level: 'UCE', price: 500 },
  '672df1c30039f7cc043f': { type: 'practical', subjectName: 'Chemistry', level: 'UCE', price: 500 },
  '673447d1001ca059bcf3': { type: 'theory', package: 'standard', subjectName: 'Geography', level: 'UCE', price: 500 },
  '671671c300032b03732c': { type: 'theory', package: 'standard', subjectName: 'Math', level: 'UCE', price: 500 },
  '6708f89b001c6e8e17e0': { type: 'theory', package: 'standard', subjectName: 'History', level: 'UCE', price: 500 },
  '66d6dfc8003d2aa43874': { type: 'theory', package: 'standard', subjectName: 'English', level: 'UCE', price: 500 },
  '66ec15220001235fbcdf': { type: 'theory', package: 'standard', subjectName: 'Chemistry', level: 'UCE', price: 500 },
  '6792056e001d897869c3': { type: 'theory', package: 'standard', subjectName: 'Biology', level: 'UCE', price: 500 },
  '673476de000384c2e19c': { type: 'theory', package: 'standard', subjectName: 'Physics', level: 'UCE', price: 500 },
  '681c9a630027fbe59660': { type: 'theory', package: 'holiday', classLevel: 'Senior Three', subjectName: 'Chemistry', level: 'UCE', price: 500 },
  '681c9aed002c642f9b1e': { type: 'theory', package: 'holiday', classLevel: 'Senior Three', subjectName: 'Biology', level: 'UCE', price: 500 },
  '681c9bbc0031618168bf': { type: 'theory', package: 'holiday', classLevel: 'Senior Four', subjectName: 'Chemistry', level: 'UCE', price: 500 },
  '681c9b8c00156bfb2991': { type: 'theory', package: 'holiday', classLevel: 'Senior Four', subjectName: 'Biology', level: 'UCE', price: 500 },
};

async function populateSubjects() {
  try {
    console.log('Starting to populate subjects...');
    let successCount = 0;
    let errorCount = 0;

    for (const [id, data] of Object.entries(collectionMetadata)) {
      try {
        await databases.createDocument(database_id, subjectsTable_id, id, {
          subjectName: data.subjectName,
          type: data.type || null,
          package: data.package || null,
          classLevel: data.classLevel || null,
          level: data.level,
          price: data.price,
        });
        console.log(`Created document with ID: ${id} (${data.subjectName} - ${data.level})`);
        successCount++;
      } catch (err) {
        console.error(`Failed to create document with ID: ${id} (${data.subjectName})`, err.message);
        errorCount++;
      }
    }

    console.log(`Population complete. Success: ${successCount}, Errors: ${errorCount}`);
    if (errorCount > 0) {
      console.log('Some documents failed to create. Check the errors above and verify collection attributes.');
    }
  } catch (err) {
    console.error('Error during population:', err);
  }
}

// Run the script
populateSubjects().catch((err) => {
  console.error('Script execution failed:', err);
});