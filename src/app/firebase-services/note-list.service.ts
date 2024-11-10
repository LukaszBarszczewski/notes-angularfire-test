import { Injectable, inject } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { Firestore, collection, collectionData, doc, addDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { deleteDoc, onSnapshot } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class NoteListService {

  trashNotes: Note[] = [];
  normalNotes: Note[] = [];



  firestore: Firestore = inject(Firestore);

  unsubTrash;
  unsubNotes;

  constructor() {

    this.unsubNotes = this.subNotesList();
    this.unsubTrash = this.subTrashList();
  }

  async deleteNote(colID: 'notes' | 'trash', docID: string) {
    await deleteDoc(this.getSingleDocRef(colID, docID)).catch(
      (err) => { console.error(err) }
      
    )
  }

  async updateNote(note: Note) {
    if (note.id) {
    let docRef = this.getSingleDocRef(this.getCalIDFromNote(note), note.id); 
    await updateDoc(docRef, this.getCleanJSON(note)).catch(
      (err) => { console.error(err) }
    ).then();
    }
  }

  getCleanJSON(note: Note): {} {
    return {
      type: note.type,
      title: note.title,
      content: note.content,
      marked: note.marked,
    };
  }

  getCalIDFromNote(note: Note) {
    if (note.type == 'note') {
      return 'notes';
    } else {
      return 'trash';
    }
  }

  async addNote(item: Note, colID: 'notes' | 'trash') {
    await addDoc(this.getNotesRef(), item).catch(
      (err) => { console.error(err) }
    ).then(
      (docRef) => {
        console.log('Document written with ID: ', docRef?.id);
      }
    )
  }


  ngonDestroy() {
    this.unsubNotes();
    this.unsubTrash();
  }

  subNotesList() {
    return onSnapshot(this.getNotesRef(), (list) => {
      this.normalNotes = [];
      list.forEach(element => {
        this.normalNotes.push(this.setNoteObject(element.data(), element.id));
      });
    });
  }

  subTrashList() {
    return onSnapshot(this.getTrashRef(), (list) => {
      this.trashNotes = [];
      list.forEach(element => {
        this.trashNotes.push(this.setNoteObject(element.data(), element.id));
      });
    });
  }

  setNoteObject(obj: any, id: string): Note {
    return {
      id: id,
      type: obj.type || "note",
      title: obj.title || "",
      content: obj.content || "",
      marked: obj.marked || false,
    };
  }

  getNotesRef() {
    return collection(this.firestore, 'notes');
  }

  getTrashRef() {
    return collection(this.firestore, 'trash');
  }

  getSingleDocRef(colID: string, docID: string) {
    return doc(collection(this.firestore, colID), docID);
  }
}
