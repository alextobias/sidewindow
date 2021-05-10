console.log("Started client script");
// const socket = io("http://localhost:8080")

let addrField = document.getElementById("addrField");
let portField = document.getElementById("portField");
let textField = document.getElementById("textField")
let roomField = document.getElementById("roomField")

connectButton = document.getElementById("connectButton");
sendButton = document.getElementById("sendMessageButton");

connectionStatus = document.getElementById("connectionStatus");

console.log('window')
console.log(window.location)


let client_soc = io();

initConnection = function () {
    console.log("Initializing connection")
    console.log(`addr: ${addrField.value}`)
    console.log(`port: ${portField.value}`)
    console.log(`room: ${roomField.value}`)
    if(addrField.value == "") {
        console.log("Invalid connection params");
        connectionStatus.innerText = "Error! Invalid connection parameters.";
        return
    }
    connectionAddr = addrField.value + (portField.value != "" ? ":" + portField.value : "")
    console.log(`connectionAddr: ${connectionAddr}`)

    // begin connection
    const connection_options = {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        query: {
            type: "browser",
            room: roomField.value
        }
    }
    // debug to log connection options
    // console.log(`Connection options:`);
    // console.log(connection_options);

    client_soc = io(connectionAddr)
    connectionStatus.innerText = "Attempting to connect to: " + connectionAddr;

    client_soc.on("server-ack", (msg) => {
        if(msg == "No Room") {
            connectStatus.innerText = "Room does not exist."
        }
        elseif(msg)
        connectionStatus.innerText = "Connection established at: " + connectionAddr
        console.log("Got 'server-ack' event from server!")
        console.log("[server] " + msg)
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