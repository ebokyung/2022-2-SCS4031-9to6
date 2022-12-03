import { io } from "socket.io-client";

export let socket = io("http://54.180.141.7:5000", { transports: ["websocket"] });
export const initSocketConnection = () => {
  if (socket) return;
  socket.connect();
};

// 이벤트 명을 지정하고 데이터를 보냄
export const sendSocketMessage = (cmd, body = null) => {
  if (socket == null || socket.connected === false) {
    initiateSocketConnection();
  }
  socket.emit("message", {
    cmd: cmd,
    body: body,
  });
};


let cbMap = new Map();

// 해당 이벤트를 받고 콜백 함수를 실행함
export const socketInfoReceived = (cbType, cb) => {
  cbMap.set(cbType, cb);
  
  if (socket.hasListeners("message")) {
    socket.off("message");
  }

  socket.on("message", ret => {
    for (let [, cbValue] of cbMap) {
      cbValue(null, ret);
    }
  });
};

// 소켓 연결을 끊음
export const disconnectSocket = () => {
  if (socket == null || socket.connected === false) {
    return;
  }
  socket.disconnect();
  socket = undefined;
};




// const [ state, setState ] = useState({ message: "", name: "" })
// 	const [ chat, setChat ] = useState([])

// 	const socketRef = useRef()

// 	useEffect(
// 		() => {
// 			socketRef.current = io.connect("http://localhost:4000")
// 			socketRef.current.on("message", ({ name, message }) => {
// 				setChat([ ...chat, { name, message } ])
// 			})
// 			return () => socketRef.current.disconnect()
// 		},
// 		[ chat ]
// 	)

// 	const onTextChange = (e) => {
// 		setState({ ...state, [e.target.name]: e.target.value })
// 	}

// 	const onMessageSubmit = (e) => {
// 		const { name, message } = state
// 		socketRef.current.emit("message", { name, message })
// 		e.preventDefault()
// 		setState({ message: "", name })
// 	}

// 	const renderChat = () => {
// 		return chat.map(({ name, message }, index) => (
// 			<div key={index}>
// 				<h3>
// 					{name}: <span>{message}</span>
// 				</h3>
// 			</div>
// 		))
// 	}