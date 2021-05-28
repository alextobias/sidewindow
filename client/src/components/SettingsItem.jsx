import React from 'react';
import { Select, MenuItem } from "@material-ui/core"

function SettingsItem(props) {

    return(
      <div className="settings-item-container">
        <div className="settings-item-title">
          {props.title + ":"}
        </div>
        <div className="settings-item-selector-container">
            <Select classes={{root: "mui-Select", selectMenu: "mui-selectMenu"}} autowidth value={props.value} onChange={(e) => props.setterFunction(e.target.value)}>
            {props.possibleValues.map((val) => <MenuItem selected classes={{root: 'MenuItem', selected: 'selected'}} value={val}>{val}</MenuItem>)}
            </Select>
        </div>
      </div>
    )
  }

export default SettingsItem;