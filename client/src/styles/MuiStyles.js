// MUI-related styling will go in this folder
// Generally, I'd prefer to do styling using SASS/CSS
import { createMuiTheme, makeStyles } from  "@material-ui/core/styles"


// I'm not *certain* that any of these are used
// that's why I've got these non-theme colors
// so I can immediately identify what's being used here
const useStyles = makeStyles({
  root: {
    backgroundColor: "orange",
    color: "green"
  },
  label: {
    backgroundColor: "red",
    color: "orange",
  },
  iconContainer: {
    color: "purple",
    backgroundColor: "yellow"
  },
  labelContainer: {
    color: "orange",
    backgroundColor: "yellow",
    typography: {
      color: "pink",
    }
  },
  // I tried using this to make the landing page transparent
  transparentPaper: {
    // opacity: 0.8,
    // backgroundColor: "red",
    // paper: {
      // backgroundColor: "green",
      // opacity: 0.8,
    // }
  }
})

const theme = createMuiTheme({
  palette: {
    // right now, these are colored with ridiculous colors
    // so that I know where these styles are applied
    primary: {
      light: '#4f5b62',
      main: '#263238',
      dark: '#000a12',
      // light: '#00ff00',
      // main: '#00cc00',
      // dark: '#008800',
      // contrastText: '#eeeeee',
      contrastText: "lightgrey",
    },
    secondary: {
      light: '#4f83cc',
      main: '#01579b',
      dark: '#002f6c',
      // light: '#ff0000',
      // main: '#cc0000',
      // dark: '#880000',
      // contrastText: '#eeeeee',
      contrastText: "white",
    },
    text: {
      // primary: "#eeeeee"
    }
  },
  overrides: {
    MuiDrawer: {
      paper: {
        // backgroundColor: "#263238",
        // backgroundColor: "red",
        // width: "200px",
        // opacity: 0.7,
      }
    },
    MuiSelect: {
      root: {
        // color: "red"
      },
      select: {
        // color: "blue"
      },
      selectMenu: {
        color: "lightgrey",
        typography: {
          fontFamily: "Pattaya"
        }
      }
    },
    MuiButton: {
      root: {
        borderRadius: 0,
      }
    },
  },
  typography: {
    fontFamily: "Roboto Mono",
  //   fontFamily: [
  //     'serif',
  //     'Consolas',
  //     'Courier New',
  //     '-apple-system',
  //     'BlinkMacSystemFont',
  //     '"Segoe UI"',
  //     'Roboto',
  //     '"Helvetica Neue"',
  //     'Arial',
  //     'sans-serif',
  //     '"Apple Color Emoji"',
  //     '"Segoe UI Emoji"',
  //     '"Segoe UI Symbol"',
  //   ].join(','),
  },
});

export {useStyles as useStyles, theme as theme}