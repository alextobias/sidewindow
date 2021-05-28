
// -------------
// React Imports
// -------------
import React, { useState, useEffect } from 'react';


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
import SettingsItem from "./components/SettingsItem"; // used in the side drawer for picking editor theme, language etc
import StyledStepLabel from "./components/StyledStepLabel"; // used in the side drawer for picking editor theme, language etc

// -----------------------------
// Material UI component imports
// -----------------------------
import { AppBar, Button, Drawer, TextField, Input, Switch, Select } from "@material-ui/core";
import { Stepper, Step } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";

// ---------------------
// Editor config imports
// ---------------------
import {editorLanguages, editorThemes, editorFontSizes, defaultEditorLanguage, defaultEditorTheme, defaultEditorFontSize} from "./EditorOptions";

// -------------
// Style imports
// -------------
import './App.scss';
import { theme, useStyles } from "./MuiStyles"


// naming conventions for element IDs and classes will be lower-hyphen-case
// this is so that I can identify which are my own components
// but components that I make myself will follow the CamelCase convention

function App() {

  // Variables used for debug mode - take out for production
  const [address, setAddress] = useState("http://localhost")
  // const [address, setAddress] = useState("https://sidewindow.herokuapp.com")
  const [port, setPort] = useState("5000")
  // const [port, setPort] = useState("")
  const [debugMode, setDebugMode] = useState(false)

  // General layout state variables
  const [isLandingOpen, setIsLandingOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Editor configuration state variables
  const [editorContents, setEditorContents] = useState("#README.md\n\nWelcome to *SideWindow*!\n\nSideWindow makes it easy to remotely view and edit a file you have open in VS Code.\n\nInstall the VS Code extension, and in it, select 'Share Current File'.\nThen, enter the room ID above!\n\nGet the extension here: *[TODO: LINK TO EXTENSION HERE]*\n\nTo change settings like font size, syntax highlighting and editor theme,\nuse the *settings button* in the top right!")
  // const [editorContents, setEditorContents] = useState("...\nconsole.log('hello world!')")
  const [editorLanguage, setEditorLanguage] = useState(defaultEditorLanguage)
  const [editorTheme, setEditorTheme] = useState(defaultEditorTheme)
  const [editorFontSize, setEditorFontSize] = useState(defaultEditorFontSize)

  // Connection state variables
  const [socket, setSocket] = useState()
  // TODO: get rid of this below and use socket.connected
  const [isSocketConnected, setIsSocketConnected] = useState()
  const [connectionStatus, setConnectionStatus] = useState("Connection not started.")
  const [room, setRoom] = useState("")
  

  // uncomment this if I end up needing to use mui styles

  function initConnection() {
    console.log("Calling initConnection.")

    // do a check if socket is already active
    if(socket === undefined) {
      console.log("initConnection: socket is undefined, i.e. this is the first time we're connecting.")
    } else if(socket.connected) {
      console.log("initConnection: socket is already connected. Rejecting this attempt to connect.")
      return
    } else if(!socket.connected) {
      console.log("initConnection: socket exists but is not connected. Will make an attempt to connect.")
    } else {
      console.log("initConnection: ERROR - socket is not undefined, but is neither connected nor disconnected. RETURNING.")
      console.log(socket)
      return
    }

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

    // TODO: get rid of setIsSocketConnected and use socket.connected
    setIsSocketConnected(true)
    setSocket(new_socket)
    
    console.log("Logging socket after connection:")
    console.log(new_socket)

    new_socket.on("server:ack", (msg) => {
          if(msg == "No room") {
            setConnectionStatus("Room does not exist.")
            // disconnect ourselves just in case (server side already does disconnect)
            new_socket.disconnect()
          }
          else if(msg) {
              setConnectionStatus(`Connection Active`)
              console.log("Got 'server:ack' event from server!")
              console.log("[server] " + msg)

              // once we recieve an edit from the server, then we remove the landing page
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
      if(isLandingOpen) {
        setIsLandingOpen(false)
      }
        setConnectionStatus("Connected.")
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
      setConnectionStatus("Disconnected.")
      // TODO: get rid of this and use socket.connected
      setIsSocketConnected(false)
    })
  }

  function handleEditorChange(contents) {
    console.log("> EDITOR: Got editor change:")
    console.log(`contents passed in: ${contents}`)
    setEditorContents(contents)
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

  function disconnectSocket(event) {
    console.log("Disconnecting socket.")
    socket.disconnect()
  }

  useEffect(() => {
    setIsLandingOpen(true);
  }, [])

  const styleClasses = useStyles();

  return (
    <ThemeProvider theme={theme}>
    <div className="App">
      {/* component for overlay page will go here */}
      {/* for now, just implement ace editor and go from there */}
      <Drawer className={"transparentPaper"}
        anchor="top" 
        id="landing-overlay" 
        elevation={20} 
        open={isLandingOpen} 
        onClose={() => {setIsLandingOpen(false)}}
        transitionDuration={{
          appear: 1000,
          enter: 250,
          exit: 300,
        }}
        >
        <div id="landing-page">
          <div id="landing-page-column">
            <div class="logo-text" id="title-text">
              <span class="title-side">Side</span><span class="title-window">Window</span>
            </div>
            <div id="stepper-container">
              <Stepper className={styleClasses.root} id="landing-stepper" orientation="vertical">
                <Step>
                  <StyledStepLabel active={true}>Install the <a href="[TODO: LINK TO EXTENSION HERE]">SideWindow VS Code extension</a>.</StyledStepLabel>
                </Step>
                <Step>
                  <StyledStepLabel active={true}>In the extension, click 'Share Current File'.</StyledStepLabel>
                </Step>
                <Step>
                  <StyledStepLabel active={true}>Enter the room ID below, and click 'Connect'!</StyledStepLabel>
                </Step>
              </Stepper>
            </div>
            {/* <p>Welcome to SideWindow!</p> */}
            {/* <ol>
              <li>Install the SideWindow VS Code Extension.</li>
              <li>In the extension, click 'Share Current File'.</li>
              <li>Enter the room code below!</li>
            </ol> */}
            {/* <p>To get started, install the SideWindow VS Code extension, and click 'Share Current File'. Then, enter the room code below: </p> */}
            <div id="landing-page-connection-group">
              <div id="landing-page-room-input-container">
                <input id="landing-page-room-input" placeholder='Enter room here...' maxLength={4} onChange={handleRoomChange} disabled={isSocketConnected} value={room}></input>
              </div>
              <div id="landing-page-connect-button-container">
                <Button variant="contained" color="secondary" onClick={initConnection}>Connect!</Button>
              </div>
            </div>
            <div id="landing-page-connection-status">{connectionStatus}</div>
            <div id="lift-drawer-button-container">
              <Button variant="contained" color="tertiary" onClick={() => {setIsLandingOpen(false)}}>Or, view editor</Button>
            </div>
            {/* <p>Don't have the extension? <a href="[TODO: LINK TO EXTENSION HERE]">Get it here.</a></p> */}
          </div>
        </div>
      </Drawer>
      <div id="editor-view-page">
        <AppBar classname="editor-top-bar" position="sticky" id="editor-top-bar" display="flex" flexDirection="row-reverse">
          <div class="editor-bar-group" id="editor-bar-connection-group">
            <div class="editor-bar-inner-item" id="editor-bar-connection-input-group">
              <div id="editor-bar-connect-button-container">
              {!isSocketConnected ? 
                <Button variant="contained" color="secondary" onClick={initConnection}>Connect</Button>
                :
                <Button variant="contained" color="secondary" onClick={disconnectSocket}>Disconnect</Button>
              }
              </div>
              {debugMode? 
                <>
                  <input label="Host" placeholder={"http://localhost/"} onChange={handleAddressChange}></input>
                  <input label="Port" placeholder={"5000"} onChange={handlePortChange}></input>
                </> : null}
                <div class="editor-bar-inner-item" id="editor-bar-room-container">
                  <input class="editor-bar-inner-item" id="editor-bar-room-field" size="small" maxLength={4} variant="outlined" label="Room" placeholder="Enter room here..." onChange={handleRoomChange} disabled={isSocketConnected} value={room}></input>
                </div>
              </div>
          </div>
          <div class="editor-bar-group" id="editor-bar-settings-group">
            <div class="editor-bar-inner-item" id="editor-bar-settings-button-container">
            {debugMode? <Button variant="contained" color="secondary" onClick={() => setIsLandingOpen(true)}>Open Landing</Button> : null}
            {/* debug mode switch */}
              <Button variant="contained" color="secondary" onClick={() => setIsDrawerOpen(true)}>Settings</Button>
            </div>
          </div>
        </AppBar>
        <Drawer anchor="right" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
          <div id="drawer-contents">
            <div class="drawer-contents-group" id="drawer-settings-group">
              {/* <Button onClick={() => setIsDrawerOpen(false)}>Close</Button> */}
              <SettingsItem title="Language" value={editorLanguage} setterFunction={setEditorLanguage} possibleValues={editorLanguages} ></SettingsItem>
              <SettingsItem title="Theme" value={editorTheme} setterFunction={setEditorTheme} possibleValues={editorThemes} ></SettingsItem>
              <SettingsItem title="Font Size" value={editorFontSize} setterFunction={setEditorFontSize} possibleValues={editorFontSizes} ></SettingsItem>
            </div>
            <div class="drawer-contents-group" id="drawer-info-group">
              <div class="logo-text" id="drawer-info-logo-text">
                <span class="title-side">Side</span><span class="title-window">Window</span>
              </div>
              <div>is by <a href="https://github.com/alextobias">alextobias</a>.</div>
              {/* DEBUG - take out for production */}
              {/* <Switch checked={debugMode} onChange={(e) => setDebugMode(e.target.checked)}></Switch> */}
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
            showGutter={true}
            // debounceChangePeriod={250}
          >
          </AceEditor>
        </div>
        <AppBar classname="editor-bottom-bar" position="sticky" id="editor-bottom-bar" display="flex" flexDirection="row-reverse">
          {/* <div id="editor-bar-group">
            <div><b>SideWindow</b></div>
          </div> */}
          <div id="editor-bar-status-container">
            <div class="editor-bar-inner-item" id="editor-bar-connection-status">{connectionStatus}</div>
          </div>
          {/* <div id="editor-bar-group">
            <div><b>by Alex Tobias</b></div>
          </div> */}
        </AppBar>
      </div>
    </div>
    </ThemeProvider>
  );
}

export default App;
