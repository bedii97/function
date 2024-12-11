/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

// Firebase Admin SDK'yı başlat
admin.initializeApp();

const db = admin.firestore();

async function getUsers() {
    try {
        const usersRef = db.collection("users");
        const snapshot = await usersRef.get();

        if (snapshot.empty) {
            console.log("Hiç kullanıcı bulunamadı.");
            return [];
        }

        const users = [];
        snapshot.forEach(doc => {
            users.push({ id: doc.id, ...doc.data() });
        });

        return users;
    } catch (error) {
        console.error("Err:", error);
        throw error;
    }
}

function capitalizeWords(text) {
    if (!text || text.trim() === "") return text;

    return text.split(' ').map(word => {
        if (word.trim() !== "") {
            let modifiedWord = word.replace(/İ/g, 'i').toLowerCase();
            return modifiedWord.charAt(0).toUpperCase() + modifiedWord.slice(1);
        }
        return word;
    }).join(' ');
}

async function updateDisplayNames(users) {
    try {
        const batch = db.batch();

        users.forEach(user => {
            const userRef = db.collection("users").doc(user.id);
            const formattedDisplayName = capitalizeWords(user.display_name);
            batch.update(userRef, { display_name: formattedDisplayName });
        });
        await batch.commit();
    } catch (error) {
        console.error("Err:", error);
    }
}

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

exports.helloWorld = onRequest(async (request, response) => {
    let users = await getUsers();

    const updatedUsers = users.map(user => {
        const formattedDisplayName = capitalizeWords(user.display_name);
        return { ...user, formattedDisplayName };
    });

    updatedUsers.forEach((user, index) => {
        console.log(`Kullanıcı ${index + 1}: ${user.display_name} -> ${user.formattedDisplayName}`);
    });

    // Çalışacağını umduğum fonksiyon
    // await updateDisplayNames(updatedUsers);

    response.send("Hello World");
});