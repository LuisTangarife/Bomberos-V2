/* =========================================================
   FIREBASE - INSPECCIONES
========================================================= */

import { initializeApp } from
"https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";

import {

    getFirestore,

    doc,

    setDoc,

    getDoc,

    getDocs,

    collection,

    deleteDoc,

    updateDoc,

    query,

    orderBy,

    serverTimestamp

}
from
"https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

import {

    getStorage,

    ref,

    uploadBytes,

    getDownloadURL,

    deleteObject

}
from
"https://www.gstatic.com/firebasejs/11.9.1/firebase-storage.js";

const firebaseConfig = {

    apiKey: "...",

    authDomain: "...",

    projectId: "...",

    storageBucket: "...",

    messagingSenderId: "...",

    appId: "..."

};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const storage = getStorage(app);

export {

    db,

    storage

};
export async function guardarInspeccion(id, datos){

    await setDoc(

        doc(db, "inspecciones", id),

        {

            ...datos,

            createdAt: serverTimestamp(),

            updatedAt: serverTimestamp()

        }

    );

}

export async function obtenerInspeccion(id){

    const documento = await getDoc(

        doc(db,"inspecciones",id)

    );

    if(!documento.exists()){

        return null;

    }

    return{

        id: documento.id,

        ...documento.data()

    };

}

export async function listarInspecciones(){

    const consulta = query(

        collection(db,"inspecciones"),

        orderBy("createdAt","desc")

    );

    const snapshot = await getDocs(consulta);

    return snapshot.docs.map(doc=>({

        id:doc.id,

        ...doc.data()

    }));

}

export async function actualizarInspeccion(id,datos){

    await updateDoc(

        doc(db,"inspecciones",id),

        {

            ...datos,

            updatedAt:serverTimestamp()

        }

    );

}

export async function eliminarInspeccion(id){

    await deleteDoc(

        doc(db,"inspecciones",id)

    );

}
