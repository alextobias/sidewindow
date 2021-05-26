// MUI-related styling will go in this folder
// Generally, I'd prefer to do styling using SASS/CSS
import { createMuiTheme, makeStyles } from  "@material-ui/core/styles"

const useStyles = makeStyles({
})

const theme = createMuiTheme({
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
    text: {
      primary: "#eeeeee"
    }
  },
  overrides: {
    MuiDrawer: {
      paper: {
        // backgroundColor: "#263238",
        // backgroundColor: "red",
        // width: "200px",
        opacity: 1,
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
    },
    MuiButton: {
      root: {
        borderRadius: 0
      }
    },
    MuiStepper: {
      root: {
        backgroundColor: "#263238",
        // color: "red",
      }
    },
    MuiStep: {
      root: {
        // backgroundColor: "orange",
        // color: "blue"
      }
    },
    MuiStepLabel: {
      active: {
        // backgroundColor: "purple"
      }
    },
    MuiStepIcon: {
      active: {
        palette: {
          light: '#4f83cc',
          main: '#01579b',
          dark: '#002f6c',
          contrastText: '#eeeeee',
        }
      }
    }
  },
  typography: {
    fontFamily: [
      'Menlo',
      'Consolas',
      'Courier New',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
});

export {useStyles as useStyles, theme as theme}