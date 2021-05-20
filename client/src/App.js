import logo from './logo.svg';
import './App.scss';

import React, { useState } from 'react';

// Ace editor imports
import AceEditor from "react-ace";

// my component imports
import SettingsItem from "./SettingsItem"

// naming conventions for element IDs and classes will be lower-hyphen-case
// this is so that I can identify which are my own components
// but components that I make myself will follow the CamelCase convention

import { AppBar, Button, Drawer, TextField, Input, Switch, Select } from "@material-ui/core"


import { createMuiTheme, makeStyles, ThemeProvider } from "@material-ui/core/styles"

// editor stuff
import {editorLanguages, editorThemes, editorFontSizes, defaultEditorLanguage, defaultEditorTheme, defaultEditorFontSize} from "./EditorOptions"

// this is bullshit, I should be able to style my components with ONE consistent way
const useStyles = makeStyles({
})


const theme = createMuiTheme({
  overrides: {
    MuiDrawer: {
      paper: {
        // backgroundColor: "#263238",
        width: "200px",
      }
    },
    MuiSelect: {
      root: {
        color: "red"
      },
      select: {
        color: "blue"
      },
      selectMenu: {
        color: "lightgrey"
      }
    }
  },
  palette: {
    primary: {
      light: '#4f5b62',
      main: '#263238',
      dark: '#000a12',
      contrastText: '#eeeeee',
    },
    secondary: {
      light: '#4f83cc',
      main: '#01579b',
      dark: '#002f6c',
      contrastText: '#eeeeee',
    },
  },
});


function App() {

  const [isLandingOpen, setIsLandingOpen] = useState(true)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const [editorLanguage, setEditorLanguage] = useState(defaultEditorLanguage)
  const [editorTheme, setEditorTheme] = useState(defaultEditorTheme)
  const [editorFontSize, setEditorFontSize] = useState(defaultEditorFontSize)

  const [debugMode, setDebugMode] = useState(false)

  const classes = useStyles();

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
                <input label="Host" placeholder={"http://localhost/"}></input>
                <input label="Port" placeholder={"5000"}></input>
              </> : null}
            <input size="small" variant="outlined" label="Room"></input>
            <button>Connect!</button>
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
          >
          </AceEditor>
        </div>
      </div>
    </div>
    </ThemeProvider>
  );
}

export default App;
