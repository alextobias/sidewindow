import logo from './logo.svg';
import React, { useState } from 'react';

// CSS imports
import './App.css';
import './Editor.css';

// AceEditor imports
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-solarized_dark";
import "ace-builds/src-noconflict/theme-dracula";

// MaterialUI imports
import { Drawer, Select, MenuItem } from "@material-ui/core"

// socketio imports
import { io } from "socket.io-client";

function App() {

  // connection fields - take out address and port in production
  const [address, setAddress] = useState("http://localhost")
  const [port, setPort] = useState("5000")
  const [room, setRoom] = useState("room")
  const [connectionStatus, setConnectionStatus] = useState("No connection started.")

  // message - take out in production
  const [browserMessage, setBrowserMessage] = useState("I am a browser!")

  // socket
  const [socket, setSocket] = useState()
  const [isSocketConnected, setIsSocketConnected] = useState(false)

  // drawer stuff & settings
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [editorLanguage, setEditorLanguage] = useState("javascript")
  const [editorTheme, setEditorTheme] = useState("solarized_dark")
  const [editorFontSize, setEditorFontSize] = useState(18)

  // editor contents
  const [editorContents, setEditorContents] = useState("console.log('hello world!')")

  function handleAddressChange(event) {
    console.log("Got input to address field.")
    console.log("Result: ")
    console.log(event.target.value)
    setAddress(event.target.value)
  }

  function handlePortChange(event) {
    console.log("Got input to  field.")
    console.log("Result: " + event.target.value)
    setPort(event.target.value)
  }

  function handleRoomChange(event) {
    console.log("Got input to address field.")
    console.log("Result: " + event.target.value)
    setRoom(event.target.value)
  }

  function handleMessageChange(event) {
    console.log("Got input to message field.")
    console.log("Result: " + event.target.value)
    setBrowserMessage(event.target.value)
  }

  function handleEditorThemeChange(event) {
    let newTheme = event.target.value;
    console.log(`Changed theme to ${newTheme}`);
    setEditorTheme(newTheme);
  }

  function handleEditorLanguageChange(event) {
    let newLanguage = event.target.value;
    console.log(`Changed language to ${newLanguage}`);
    setEditorLanguage(newLanguage);
  }

  function handleEditorFontSizeChange(event) {
    let newFontSize = event.target.value;
    console.log(`Changed font size to ${newFontSize}`);
    setEditorFontSize(newFontSize);
  }

  function handleEditorThemeChange(event) {
    let newTheme = event.target.value
    console.log(`Changed theme to ${newTheme}`);
    setEditorTheme(newTheme);
  }

  function initConnection() {
    console.log("Initializing connection")
    console.log(`addr: ${address}`)
    console.log(`port: ${port}`)
    console.log(`room: ${room}`)

    // begin connection
    const connection_options = {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        query: {
            type: "browser",
            room: room
        }
    }

    let connectionAddr = address + ":" + port
    console.log("Connection Address: " + connectionAddr)

    console.log("Logging socket before connection:")
    // console.log(socket)

    let new_socket = io(connectionAddr, connection_options)

    setIsSocketConnected(true)
    setSocket(new_socket)
    
    console.log("Logging socket after connection:")
    console.log(new_socket)

    new_socket.on("server-ack", (msg) => {
          if(msg == "No room") {
            setConnectionStatus("Room does not exist.")
          }
          else if(msg) {
              setConnectionStatus("Connection established at: " + connectionAddr)
              console.log("Got 'server-ack' event from server!")
              console.log("[server] " + msg)
          }
      })

    // new format: "extension:msg" etc
    new_socket.on("extension:msg", (msg) => {
        console.log("[extension:msg]: " + msg);
        // let textfield = document.getElementById("textField");
        // console.log(textfield)
        setEditorContents(msg)
    })

    // keep this
    new_socket.on("extension:edits", (msg) => {
        console.log("[extension:edits]: " + msg);
        setEditorContents(msg)
    })

    new_socket.onAny((ev, arg) => {
        console.log(`> Browser socket: got ${ev} event with args ${arg}`)
    })

    new_socket.on("disconnect", (msg) => {
      console.log("> got disconnected from server")
      setConnectionStatus("Disconnected from server.")
      setIsSocketConnected(false)
    })

    // codeTextArea.oninput = () => {
    //     console.log("[textField] Got input in textField")
    //     console.log("Current state of textfield: ")
    //     console.log(editorContents)
    //     socket.emit("browser:edits", editorContents)
    // }
  }

  function disconnect() {
    if(isSocketConnected) {
      console.log("Disconnecting socket.")
      socket.disconnect()
    } else {
      console.log("error! socket is not connected")
    }
  }

  // TODO: figure out how to stop double-emitting events on extension side
  // is it anything to do with the client?
  function handleEditorChange(contents) {
    console.log("> EDITOR: Got editor change:")
    console.log(`contents passed in: ${contents}`)
    console.log(`editorContents before: ${editorContents}`)
    setEditorContents(contents)
    console.log(`editorContents after: ${editorContents}`)
    if(isSocketConnected) {
      console.log(`> emitting [browser:edits]: ${contents}`) 
      socket.emit("browser:edits", contents)
    }
  }

  function toggleDrawer() {
    console.log(`Setting drawer from ${isDrawerOpen} to ${isDrawerOpen? false: true}`)
    setDrawerOpen(isDrawerOpen ? false: true);
  }

  function handleSendMessageButton() {
    console.log(`Clicked send message button w/ message: ${browserMessage}`);
    if(isSocketConnected) {
      console.log(`> emitting [browser:msg]: ${browserMessage}`)
      socket.emit("browser:msg", browserMessage)
    }
  }

  
  return (
    // <div className="App">
      <div id="Editor-page">
        <div id="Editor-bar">
          <div id="Editor-bar-room-input-section">
            <input id="addrField" type="text" placeholder={address} onInput={handleAddressChange}></input>
            <input id="portField" type="number" placeholder={port} onInput={handlePortChange} value={port}></input>
            <input id="roomField" type="text" placeholder={room} onInput={handleRoomChange}></input>
            <button id="connectButton" onClick={initConnection}>Connect!</button>
            <div id="connectionStatus">{connectionStatus}</div>
          </div>
          <div id="Editor-bar-message-section">
            <input id="sendMessageField" type="text" placeholder={browserMessage} onChange={handleMessageChange}></input>
            <button id="sendMessageButton" onClick={handleSendMessageButton}>Send</button>
          </div>
          <div id="Editor-bar-settings-section">
            <button id="Settings-button" onClick={toggleDrawer}>SETTINGS</button>
          </div>
        </div>
        <div id="Editor-drawer-container">
          <Drawer className="Editor-drawer" anchor={"right"} open={isDrawerOpen} onClose={toggleDrawer} >
            <div id="Drawer-contents-wrapper">
              <SettingsItem title={"Theme"} value={editorTheme} handleSettingsChange={handleEditorThemeChange} possibleValues={["dracula", "solarized_dark", "github"]} />
              <SettingsItem title={"Language"} value={editorLanguage} handleSettingsChange={handleEditorLanguageChange} possibleValues={["javascript", "java"]} />
              <SettingsItem title={"Font Size"} value={editorFontSize} handleSettingsChange={handleEditorFontSizeChange} possibleValues={Array.from(Array(21).keys()).map((n) => n + 10)} />
            </div>
          </Drawer>
        </div>
        <AceEditor 
          mode={editorLanguage}
          theme={editorTheme}
          width="100%"
          height="100%"
          fontSize={editorFontSize}
          onChange={handleEditorChange}
          name="editordiv"
          placeholder="Enter your text here..."
          value={editorContents}
          editorProps={{ $blockScrolling: true }}
        />
      </div>
    // </div>
  );
}

function SettingsItem(props) {
  
  return(
    <div className="settingsItemContainer">
      <div className="settingsItemTitle">
        {props.title + ":"}
      </div>
      <Select autowidth value={props.value} onChange={props.handleSettingsChange}>
        {props.possibleValues.map((val) => <MenuItem value={val}>{val}</MenuItem>)}
      </Select>
    </div>
  )
}

export default App;
