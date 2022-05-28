import io from 'socket.io-client'
import firebase from 'firebase/app'
import { useStore } from 'vuex'
// import store from '../../store/store'

const store   = useStore()
const socket = io('http://localhost:3080', {
  autoConnect: false
})

let isConnecting = false

const startSocketIO = () => {
  console.log('startSocketIO')

  // socket.onAny((event, ...args) => {
  //   console.log(event, args)
  // })

  socket.on('activeUsersUpdate', users => {
    const filteredUsers = []
    
    users.forEach(_user => {
      if (!filteredUsers.find(_user2 => _user.uid === _user2.uid)) {
        filteredUsers.push(_user)
      }
    })
  
    store.commit('setActiveUsersOnOrder', filteredUsers)
  })

  socket.on('disconnect', () => {
    isConnecting = false;
  })

  firebase.auth().onAuthStateChanged(user => {
    console.log('onAuthStateChanged')
    // prevent one user connect multiple times
    if (isConnecting || socket.connected) {
      return
    }

    socket.auth = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      appraisalID: store.state.appraisalID
    }

    isConnecting = true
    socket.connect()
  })
}

export {
  socket,
  startSocketIO
}

