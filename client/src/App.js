
// -------------
// React Imports
// -------------
import React, { useState } from 'react';


// ----------------
// Socketio Imports
// ----------------
import { io } from "socket.io-client";

// -----------------
// Ace editor imports
// -----------------
import AceEditor from "react-ace";

// --------------------
// my component imports
// --------------------
import SettingsItem from "./SettingsItem" // used in the side drawer for picking editor theme, language etc

// -----------------------------
// Material UI component imports
// -----------------------------
import { AppBar, Button, Drawer, TextField, Input, Switch, Select } from "@material-ui/core"
import { ThemeProvider } from "@material-ui/core/styles"

// ---------------------
// Editor config imports
// ---------------------
import {editorLanguages, editorThemes, editorFontSizes, defaultEditorLanguage, defaultEditorTheme, defaultEditorFontSize} from "./EditorOptions"

// -------------
// Style imports
// -------------
import './App.scss';
import { theme } from "./MuiStyles"


// naming conventions for element IDs and classes will be lower-hyphen-case
// this is so that I can identify which are my own components
// but components that I make myself will follow the CamelCase convention

function App() {

  // Variables used for debug mode - take out for production
  const [address, setAddress] = useState("http://localhost")
  const [port, setPort] = useState("5000")
  const [debugMode, setDebugMode] = useState(false)

  // General layout state variables
  const [isLandingOpen, setIsLandingOpen] = useState(true)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Editor configuration state variables
  const [editorContents, setEditorContents] = useState("console.log('hello world!')")
  const [editorLanguage, setEditorLanguage] = useState(defaultEditorLanguage)
  const [editorTheme, setEditorTheme] = useState(defaultEditorTheme)
  const [editorFontSize, setEditorFontSize] = useState(defaultEditorFontSize)

  // Connection state variables
  const [socket, setSocket] = useState()
  const [isSocketConnected, setIsSocketConnected] = useState()
  const [connectionStatus, setConnectionStatus] = useState("No connection started.")
  const [room, setRoom] = useState("debug")
  

  // uncomment this if I end up needing to use mui styles
  // const classes = useStyles();

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

    // console.log("Logging socket before connection:")
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

    // this is when we receive edits from a server that are from another browser client
    // TODO: see if this fires on itself when the browser makes an edit
    // i.e. it receives its own edit
    new_socket.on("browser:edits", (msg) => {
        console.log("[browser:edits]: " + msg);
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
  }

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

  function handleAddressChange(event) {
    console.log("Got input to address field.")
    console.log("Result: " + event.target.value)
    setAddress(event.target.value)
  }

  function handlePortChange(event) {
    console.log("Got input to port field.")
    console.log("Result: " + event.target.value)
    setPort(event.target.value)
  }

  function handleRoomChange(event) {
    console.log("Got input to room field.")
    console.log("Result: " + event.target.value)
    setRoom(event.target.value)
  }



  return (
    <ThemeProvider theme={theme}>
    <div className="App">
      {/* component for overlay page will go here */}
      {/* for now, just implement ace editor and go from there */}
      {/* <Drawer anchor="top" id="landing-overlay" elevation={20} open={isLandingOpen} onClose={() => setIsLandingOpen(false)}>
        <div id="landing-page">
          <p>Hello</p>
          <p>Hello</p>
          <p>Hello</p>
          <p>Hello</p>
          <p>Hello</p>
            <Button onClick={() => setIsLandingOpen(false)}>Close Landing</Button>
        </div>
      </Drawer> */}
      <div id="editor-view-page">
        <AppBar classname="editor-top-bar" position="sticky" id="editor-top-bar" display="flex" flexDirection="row-reverse">
          <div class="editor-bar-group" id="editor-bar-connection-group">
            {debugMode? 
              <>
                <input label="Host" placeholder={"http://localhost/"} onChange={handleAddressChange}></input>
                <input label="Port" placeholder={"5000"} onChange={handlePortChange}></input>
              </> : null}
            <input size="small" variant="outlined" label="Room" onChange={handleRoomChange}></input>
            <button onClick={initConnection}>Connect!</button>
            <div id="editor-bar-connection-status">Status message goes here.</div>
          </div>
          <div class="editor-bar-group" id="editor-bar-settings-group">
            {/* debug mode switch */}
            <button onClick={() => setIsDrawerOpen(true)}>Settings</button>
          </div>
        </AppBar>
        <Drawer anchor="right" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
          <div id="drawer-contents">
            <div class="drawer-contents-group" id="drawer-settings-group">
              {/* <button onClick={() => setIsDrawerOpen(false)}>Close</button> */}
              <SettingsItem title="Language" value={editorLanguage} setterFunction={setEditorLanguage} possibleValues={editorLanguages} ></SettingsItem>
              <SettingsItem title="Theme" value={editorTheme} setterFunction={setEditorTheme} possibleValues={editorThemes} ></SettingsItem>
              <SettingsItem title="Font Size" value={editorFontSize} setterFunction={setEditorFontSize} possibleValues={editorFontSizes} ></SettingsItem>
            </div>
            <div class="drawer-contents-group" id="drawer-info-group">
              <div>Created by <a href="https://github.com/alextobias">alextobias</a>.</div>
              {/* DEBUG - take out for production */}
              <Switch checked={debugMode} onChange={(e) => setDebugMode(e.target.checked)}></Switch>
            </div>
          </div>
        </Drawer>
        <div id="editor-container">
          <AceEditor
            width="100%"
            height="100%"
            name="ace-editor"
            mode={editorLanguage}
            fontSize={editorFontSize}
            theme={editorTheme}
            value={editorContents}
            onChange={handleEditorChange}
          >
          </AceEditor>
        </div>
      </div>
    </div>
    </ThemeProvider>
  );
}

export default App;
