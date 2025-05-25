// utils.js
import { serverUrl } from '../../config.js';
import db from '../../db';  // Import your Dexie database

/**
 * Retrieve a random exam for a given subject from the database
 * @param {string} subjectName - The name of the subject
 * @returns {Promise<object | string>} - The exam data or a message if not found
 */

// export const getRandomExamBySubject = async (subjectName) => {
//     try {
//         // Query the 'exams' table for exams with the specified subject name
//         const exams = await db.exams.where({ subjectName }).toArray();

//         if (exams.length === 0) {
//             // If no exams are found, return a message
//             return 'Exam data does not exist yet for this subject';
//         }

//         // Randomly select one exam from the list
//         const randomIndex = Math.floor(Math.random() * exams.length);
//         const randomExam = exams[randomIndex];

//         // Delete the exam from the database
//         await db.exams.delete(randomExam.id);

//         return randomExam;  // Return the deleted exam's data

//     } catch (error) {
//         console.error('Error retrieving or deleting exam:', error);
//         throw new Error('Error retrieving or deleting exam data');  // Handle errors appropriately
//     }
// };

export const getRandomExamBySubject = async (subjectName, userInfo) => {
    try {
        // Query the 'exams' table for exams with the specified subject name
        const exams = await db.exams.where({ subjectName }).toArray();

        if (exams.length === 0) {
            // If no exams are found, send a message to the service worker to fetch new exams
            try {
                if ('serviceWorker' in navigator) {
                    const registration = await navigator.serviceWorker.ready;
                    registration.active.postMessage({
                        type: 'FETCH_EXAMS',  // Custom event for the service worker
                        subjects: [subjectName],  // Array of subjects to fetch
                        userId: userInfo.userId,  // ID of the logged-in user
                        educationLevel: userInfo.educationLevel,  // User's education level
                    });
                }
            } catch (error) {
                console.error('Error sending message to service worker:', error);
            }

            // Polling mechanism to check if the exam data has been added
            const startTime = Date.now();
            const timeout = 15000;  // 15 seconds timeout

            while (Date.now() - startTime < timeout) {
                const newExams = await db.exams.where({ subjectName }).toArray();
                if (newExams.length > 0) {
                    // If new exam data is found, return it
                    const randomIndex = Math.floor(Math.random() * newExams.length);
                    return newExams[randomIndex];
                }
                // Wait a bit before checking again
                await new Promise((resolve) => setTimeout(resolve, 500));  // 500ms delay
            }

            // If no exam data is found after the timeout, return a message
            return 'Exam data does not exist yet for this subject';
        }

        // Randomly select one exam from the list
        const randomIndex = Math.floor(Math.random() * exams.length);
        const randomExam = exams[randomIndex];

        // Delete the retrieved exam from the database
        await db.exams.delete(randomExam.id);

        return randomExam;  // Return the randomly selected exam

    } catch (error) {
        console.error('Error retrieving or deleting exam:', error);
        throw new Error('Error retrieving or deleting exam data');  // Handle errors appropriately
    }
};

/**
 * Genrate random exam
 * @param {*} questionsData 
 * @param {*} subjectName 
 * @param {*} userId 
 * @param {*} educationLevel 
 * @returns 
*/
export const generateRandomExam = async (questionsData, subjectName, userId, educationLevel) => {

    // console.log(`userId: ${userId}, educationLevel: ${educationLevel}`);
    // console.log('Original Questions data: ', questionsData);

    if (!questionsData) {
        console.error('questionsData is required');
        return;
    }

    try {
        // Extract category IDs dynamically from questionsData
        const categoriesToInclude = questionsData.map(category => category.category);

        // Fetch the user's question history

        // Select random questions based on various parameters
        const randomQuestions = selectRandomQuestions(
            questionsData,
            categoriesToInclude,
            subjectName
        );

        // Sort questions by category
        randomQuestions.categoriesWithQuestions.sort((a, b) => a.category - b.category);

        // Return the sorted random questions
        return randomQuestions.categoriesWithQuestions;

    } catch (error) {
        console.error('Error fetching user history:', error);
        throw error; // Rethrow the error for further handling
    }
};

/**
 * 
 * Check if is `EITHER` or `OR` type question
 */
export const isEitherOrFormat = (question) => {
    return question.hasOwnProperty('either') && question.hasOwnProperty('or');
};

/*
- Selects random a number of questions depending on the category
*/
export const selectRandomQuestions = (questionsData, categoryIds, subjectName) => {

    const getNumQuestions = (subjectName, categoryId) => {
        if (subjectName === 'sst_ple' && [36, 51].includes(categoryId)) return 5;
        if (subjectName === 'eng_ple') {
            if (categoryId === 31) return 20;
            if (categoryId === 1) return 5;
            if (categoryId === 6) return 10;
            if (categoryId === 18) return 3;
            if ([16, 21, 23, 25, 27, 29].includes(categoryId)) return 2;
            if ([51, 52, 53, 54, 55].includes(categoryId)) return 1;
        }
        return 1;
    };

    const updateQuestionIds = (questions, prefix) => {
        return questions.map((question, index) => {
            const updatedQuestion = { ...question, id: `${prefix}_${index}` };
            if (question.either?.sub_questions) {
                updatedQuestion.either.sub_questions = question.either.sub_questions.map((subQ, subIndex) => ({
                    ...subQ,
                    id: `${question.either.id}_sub_${subIndex}`,
                }));
            }
            if (question.or?.sub_questions) {
                updatedQuestion.or.sub_questions = question.or.sub_questions.map((subQ, subIndex) => ({
                    ...subQ,
                    id: `${question.or.id}_sub_${subIndex}`,
                }));
            }
            return updatedQuestion;
        });
    };

    const selectQuestionsForCategory = (categoryId) => {
        const category = questionsData.find(cat => cat.category === categoryId);
        if (!category) {
            console.warn(`Category ${categoryId} not found`);
            return null;
        }

        let attemptedQuestionIds = [];

        let availableQuestions = category.questions.filter(question => {
            const questionId = isEitherOrFormat(question) ? `${categoryId}_${category.questions.indexOf(question)}` : question.id;
            return !attemptedQuestionIds.includes(questionId);
        });

        const numQuestions = getNumQuestions(subjectName, categoryId);

        if (availableQuestions.length < numQuestions) {
            attemptedQuestionIds = [];
            availableQuestions = category.questions;
        }

        let selectedQuestions = [...availableQuestions].sort(() => 0.5 - Math.random()).slice(0, numQuestions);

        if (selectedQuestions.length < numQuestions) {
            const questionsNeeded = numQuestions - selectedQuestions.length;
            const additionalQuestions = attemptedQuestionIds.splice(0, questionsNeeded)
                .map(id => category.questions.find(q => q.id === id))
                .filter(Boolean);

            selectedQuestions = selectedQuestions.concat(additionalQuestions);
        }

        const updatedQuestions = updateQuestionIds(selectedQuestions, categoryId);

        return { ...category, questions: updatedQuestions };
    };

    const categoriesWithQuestions = categoryIds.map(selectQuestionsForCategory).filter(cat => cat !== null);

    return {
        categoriesWithQuestions,
    };
};

export const isImageUrl = (url) => {
    return (/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i).test(url);
    // return url
};
