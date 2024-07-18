// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-analytics.js";
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBbTWwY0aKf7YqGrd_ehctzKK-sKNvyCj8",
  authDomain: "this-is-my-first-prject-ac171.firebaseapp.com",
  projectId: "this-is-my-first-prject-ac171",
  storageBucket: "this-is-my-first-prject-ac171.appspot.com",
  messagingSenderId: "951577190072",
  appId: "1:951577190072:web:6ed85ccd40b7fa08a71e4d",
  measurementId: "G-YS4RDC3XK5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

const numbers_list = document.getElementById("numbers_list");
const add_number = document.getElementById("add_number");
const loading_message = document.getElementById("loading_message");
const numInp = document.getElementById("numInp");

//collection -> collection ke reference ke lye
//addDoc -> document ko collection mein add krne ke lye

const numberCollection = collection(db, "number");

getNumbersFromDb();

add_number.addEventListener("click", async () => {
  // Input field ki value check karna
  const number = numInp.value.trim();
  if (!number) {
    // alert("Please enter a number");
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Please enter the number",
      footer: '<a href="#">Why do I have this issue?</a>'
    });
    return;
  }
  console.log(number);
  try {
    add_number.disabled = true;
    const docRef = await addDoc(numberCollection, {
      number,
    });
    add_number.disabled = false;
    numInp.value = ""; // Clear the input field after adding the number
    getNumbersFromDb();
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    add_number.disabled = false;
    console.error("Error adding document: ", e);
  }
});

async function getNumbersFromDb() {
  numbers_list.innerHTML = "";
  loading_message.style.display = "block";

  const querySnapshot = await getDocs(numberCollection);
  numbers_list.innerHTML = "";
  querySnapshot.forEach((doc) => {
    var obj = doc.data();
    const li = `<li id=${doc.id}> <b>${obj.number}</b> <button> Edit </button> <button> Delete </button> </li>`;
    numbers_list.innerHTML += li;
  });

  loading_message.style.display = "none";

  numbers_list.childNodes.forEach((node) => {
    node.children[1].addEventListener("click", async function () {
      const docRef = doc(db, "number", this.parentNode.id);
      const newNumber = prompt("New Number");

      await updateDoc(docRef, {
        number: newNumber,
      });
      console.log("Document update hogya he");
      getNumbersFromDb();
    });

    node.children[2].addEventListener("click", async function () {
      const docRef = doc(db, "number", this.parentNode.id);
      await deleteDoc(docRef);
      console.log("Doc deleted");
      getNumbersFromDb();
    });
  });
}
