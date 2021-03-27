import { useEffect, useState } from 'react';
import './App.css';
import {auth, db} from './base';
import firebase from 'firebase';

function App() {
  const provider = new firebase.auth.GoogleAuthProvider();
  const [user, setUser] = useState();
  const [notes, setNotes] = useState([]);
  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if (user){
        setUser(true);
        db.collection(auth.currentUser.uid).orderBy('timestamp', 'desc').onSnapshot(snapshot=>{
          setNotes(snapshot.docs.map(doc=>doc.data()))
        })
      } else {
        setUser(false);
      }
    });
  }, []);
  const login = () => {
    auth.signInWithPopup(provider);
  }
  const logout = () => {
    auth.signOut();
  }
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [exists, setExists] = useState(false);
  const [success, setSuccess] = useState(false);
  const add = () => {
    const usersRef = db.collection(auth.currentUser.uid).doc(title);

    usersRef.get()
      .then((docSnapshot) => {
        if (docSnapshot.exists) {
          console.log('doc already exists');
          setExists(true);
          setSuccess(false);
          setTitle('');
          setContent('');
        } else {
          usersRef.set({
            title,
            content,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          });
          setTitle('');
          setContent('');
          setExists(false);
          setSuccess(true);
        }
    });
  }
  const del = (doc) => {
    db.collection(auth.currentUser.uid).doc(doc).delete();
  }
  return (
    <div className="App">
      {user ? (
        <div>
          <header>
            <h2>Notes</h2>
            <button onClick={logout} className="btn btn-outline-danger">Logout</button>
          </header>
          <br></br>
          <div className="main">
            <h3>Hello, {auth.currentUser.displayName}</h3>
            <br></br>
            {exists && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
              This note already exists <button onClick={()=>{setExists(false)}} className='btn-close' type='false'></button>
              </div>
            )}
            {success && (
              <div className="alert alert-success alert-dismissible fade show" role="alert">
              Note added! <button onClick={()=>{setSuccess(false)}} className='btn-close' type='false'></button>
              </div>
            )}
            <br></br>
            <button type='button' className='btn btn-primary new-note' data-bs-toggle='modal' data-bs-target='#exampleModal'>Add note <i class="fas fa-plus"></i></button>
            <br></br>
            <br></br>
            <div className="notes">
              {notes.map(note => {
                return (
                  <div className="card">
                  <div className='card-body'>
                    <button onClick={()=>{del(note.title)}} id='del' className='btn'><i style={{color: 'red'}} class="fas fa-trash-alt"></i></button>
                    <h5 className='card-title'>{note.title}</h5>
                    <p className='card-text'>{note.content}</p>
                  </div>
                </div>
                )
                
              })}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <button onClick={login} className="btn btn-primary btn-lg login-btn">Login</button>
        </div>
      )}
      <div className="modal fade" id='exampleModal' tabindex='-1' aria-labelledby='exampleModalLabel' aria-hidden='true'>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">New Note</h5>
            </div>
            <div className="modal-body">
              <input value={title} onChange={(e)=>{setTitle(e.target.value)}} className="form-control" placeholder='Note title' />
              <br></br>
              <textarea value={content} onChange={(e)=>{setContent(e.target.value)}} className="form-control" placeholder='Note content'rows='4' />
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline-danger" data-bs-dismiss="modal">Cancel</button>
              <button className="btn btn-primary" data-bs-dismiss="modal" disabled={!title || !content} onClick={add}>Add note</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
