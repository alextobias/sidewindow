console.log("Started client script");
// const socket = io("http://localhost:8080")

let addrField = document.getElementById("addrField");
let portField = document.getElementById("portField");
let textField = document.getElementById("textField")

connectButton = document.getElementById("connectButton");
sendButton = document.getElementById("sendMessageButton");

connectionStatus = document.getElementById("connectionStatus");


let client_soc;

initConnection = function () {
    // console.log(addrField.value);
    // console.log(portField.value);
    if(addrField.value == "" || portField.value == "") {
        console.log("Invalid connection params");
        connectionStatus.innerText = "Error! Invalid connection parameters.";
        return
    }

    // if(addrField.value == "localhost") {
    //     connectionAddr = "http://" + addrField.value + ":" + portField.value
    // } else {
    //     connectionAddr = "" + addrField.value + ":" + portField.value
    //     // I have a hunch that this only works when not localhost? but not sure
    // }
    connectionAddr = "http://" + addrField.value + ":" + portField.value
    console.log(connectionAddr)
    client_soc = io(connectionAddr)
    connectionStatus.innerText = "Attempting to connect to: " + connectionAddr;

    client_soc.on("server-ack", (arg) => {
        connectionStatus.innerText = "Connection established at: " + connectionAddr
        console.log("Got 'server-ack' event from server!")
        console.log("[server] " + arg)
    })

    client_soc.on("server-msg", (msg) => {
        console.log("[server-msg]: " + msg);
        // let textfield = document.getElementById("textField");
        // console.log(textfield)
        textField.innerText = msg;
    })

    client_soc.on("server-edits", (msg) => {
        console.log("[server-edits]: " + msg);
        textField.innerText = msg;
    })

    // event listener to send edits back to server
    // textField.addEventListener("input", () => {
    textField.oninput = () => {
        console.log("[textField] Got input in textField")
        console.log("Current state of textfield: ")
        console.log(textField.innerText)
        client_soc.emit("client-edits", textField.innerText)
    }
}

sendMessage = function () {
    messagetext = document.getElementById("sendMessageField").value;
    console.log("Sending: " + messagetext)
    client_soc.emit("client-msg", messagetext)
}

connectButton.onclick = initConnection;
sendButton.onclick = sendMessage;