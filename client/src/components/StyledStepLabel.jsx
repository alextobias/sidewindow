import { StepLabel } from "@material-ui/core"
import { styled  } from "@material-ui/core/styles"

// This component is used in the 'landing page' drawer
// Provides the styles for the StepLabels used in the 'Stepper' (1-2-3 steps thing)

// I'm not happy with this workaround I'm using
// i.e. in order to style these step labels, I'm having to created styled components
// which is another solution on top of MuiTheme and basic CSS
// maybe I'll find a better way

const StyledStepLabel = styled(StepLabel)({
  "& .MuiStepLabel-iconContainer": {
    paddingRight: "20px"
  },
  "& .MuiSvgIcon-root": {
    color: "#01579b" // secondary Main
  },
  "& .MuiTypography-root": {
    color: "lightgrey"
  }
})

export default StyledStepLabel;