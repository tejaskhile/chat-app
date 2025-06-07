import React, { useEffect, useState, useContext } from "react";
import "../styles/Project.css";
import axios from "../config/axios";
import { useLocation } from "react-router-dom";
import {
  initializeSocket,
  receiveMessage,
  sendMessage,
} from "../config/socket.js";
import { UserContext } from "../context/userContext";
import Markdown from "markdown-to-jsx";
import hljs from "highlight.js";
import "highlight.js/styles/vs2015.css";
// import { getWebContainer } from "../config/webContainers.js";

const Project = () => {
  const [sidePanel, setSidePanel] = useState(false);
  const [closing, setClosing] = useState(false);
  const [addUser, setAddUser] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [currentFile, setCurrentFile] = useState(null);
  const [openFiles, setOpenFiles] = useState([]);
  const [fileTree, setFileTree] = useState({});
  const [webContainer, setWebContainer] = useState(null);

  const messageBox = React.createRef();

  const location = useLocation();

  const [project, setProject] = useState(location.state?.project || null);

  const { user } = useContext(UserContext);

  const handlePanel = () => {
    if (sidePanel) {
      setClosing(true);
      setTimeout(() => {
        setSidePanel(false);
        setClosing(false);
      }, 500);
    } else {
      setSidePanel(true);
    }
  };

  const handleAddUser = () => {
    setAddUser(!addUser);
  };

  const handleUserClick = (id) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter((user) => user !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  function addCollaborators() {
    axios
      .put("/projects/add-user", {
        projectId: location.state.project._id,
        users: Array.from(selectedUsers),
      })
      .then((res) => {
        console.log(res.data);
        handleAddUser(true);
      })
      .catch((err) => {
        console.log(err);
      });

    handleAddUser();
  }

  const send = () => {
    if (!message || message.trim().toLowerCase() === "undefined" || !project?._id) return;

    const messageData = {
      message,
      sender: user.email,
      projectId: project._id,
    };

    console.log(messageData);
    sendMessage("project-message", messageData);
    setMessages((prev) => [...prev, messageData]);
    setMessage("");
  };

  function WriteAiMessage(message) {
    try {
      let messageData;

      if (typeof message === "string") {
        try {
          messageData = message.trim().startsWith("{")
            ? JSON.parse(message)
            : { text: message };
        } catch (err) {
          console.warn("Invalid JSON:", message);
          messageData = { text: message };
        }
      } else if (typeof message === "object" && message !== null) {
        messageData = message;
      } else {
        messageData = { text: String(message) };
      }

      if (messageData.fileTree) {
        return messageData.text || "Generated file structure";
      }
      return <Markdown children={messageData.text || message} />;
    } catch (e) {
      return message;
    }
  }

  hljs.highlightAll();

  useEffect(() => {
    const storedMessages = localStorage.getItem(`chat_${project?._id}`);
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, [project?._id]);

  useEffect(() => {
    if (project?._id) {
      localStorage.setItem(`chat_${project._id}`, JSON.stringify(messages));
    }
  }, [messages, project?._id]);

  useEffect(() => {
    if (!project?._id) return;

    const socket = initializeSocket(project._id);

    receiveMessage("project-message", (data) => {
      console.log("Received message:", data);

      try {
        const message =
          typeof data.message === "string" &&
          data.message.trim().startsWith("{")
            ? JSON.parse(data.message)
            : data.message;

        if (message.fileTree) {
          setFileTree(message.fileTree);
        }

        setMessages((prev) => [
          ...prev,
          {
            ...data,
            message: message,
          },
        ]);
      } catch (e) {
        setMessages((prev) => [...prev, data]);
      }

      document.querySelectorAll("pre code").forEach((el) => {
        delete el.dataset.highlighted;
      });

      hljs.highlightAll();
    });

    axios
      .get(`/projects/get-project/${location.state.project._id}`)
      .then((res) => {
        setProject(res.data.project);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get("/users/all")
      .then((res) => {
        setUsers(res.data.users);
      })
      .catch((err) => {
        console.log(err);
      });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [project?._id]);

  useEffect(() => {
    if (messageBox.current) {
      messageBox.current.scrollTop = messageBox.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="project-container">
      <div className="chat-container">
        <div className="msg-header">
          <div className="addDiv" onClick={handleAddUser}>
            <i id="addbtn" className="fa-solid fa-plus "></i>
            <button className="add-btn">Add User</button>
          </div>
          <i
            className={sidePanel ? "fa-solid fa-times" : "fa-solid fa-bars"}
            onClick={handlePanel}
          ></i>
        </div>
        <div ref={messageBox} className="msg-content">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`msg ${msg.sender === "AI" ? "ai-msg" : ""} ${
                msg.sender === user.email ? "first" : "second"
              }`}
            >
              <h5>{msg.sender}</h5>
              {msg.sender === "AI" ? (
                <div className="ai-msg">{WriteAiMessage(msg.message)}</div>
              ) : (
                msg.message
              )}
            </div>
          ))}
        </div>
        <div className="msg-bottom">
          <input
            type="text"
            placeholder="Enter message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className="sendbtn" type="submit" onClick={send}>
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>

        {sidePanel && (
          <div className={`side-panel ${closing ? "closing" : ""}`}>
            {project.users &&
              project.users.map((user) => (
                <div key={user._id} className="side-panel-header">
                  <i className="fa-solid fa-user "></i>
                  <p>{user.email}</p>
                </div>
              ))}
          </div>
        )}

        {addUser && (
          <div className="addUser-container">
            <div className="addCard">
              <div className="addCard-header">
                <h3>Select users</h3>
                <i
                  className={addUser ? "fa-solid fa-times" : ""}
                  onClick={handleAddUser}
                ></i>
              </div>
              <div className="users-list">
                {users &&
                  users.map((user) => (
                    <div
                      key={user._id}
                      className={`user ${
                        selectedUsers.indexOf(user._id) !== -1
                          ? "userClicked"
                          : ""
                      }`}
                      onClick={() => handleUserClick(user._id)}
                    >
                      <i className="fa-solid fa-user "></i>
                      <p htmlFor={user._id}>{user.email}</p>
                    </div>
                  ))}
              </div>
              <button
                onClick={() => addCollaborators()}
                className="addCollabBtn"
              >
                Add Collaborators
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="code-container">
        <div className={`${currentFile ? "files-container" : ""}`}>
          {Object.keys(fileTree).map((file) => (
            <div key={file}>
              <p
                onClick={() => {
                  setCurrentFile(file);
                  setOpenFiles([...new Set([...openFiles, file])]);
                }}
                className="file"
              >
                {file}
              </p>
            </div>
          ))}
        </div>

        {currentFile && (
          <div className="code-editor">
            <div className="top">
              <div>
                {openFiles.map((file, index) => (
                  <button
                    onClick={() => {
                      setCurrentFile(file);
                      setOpenFiles([...new Set([...openFiles, file])]);
                    }}
                    className={`file-Btn ${
                      currentFile === file ? "active" : ""
                    }`}
                  >
                    {file}
                  </button>
                ))}
              </div>
            </div>

            <div className="bottom">
              {fileTree[currentFile] && (
                <pre>
                  <code
                    spellCheck="false"
                    className="language-javascript"
                    contentEditable
                    suppressContentEditableWarning
                    onInput={(e) => {
                      setFileTree({
                        ...fileTree,
                        [currentFile]: {
                          file: {
                            contents: e.currentTarget.textContent,
                          },
                        },
                      });
                    }}
                    style={{
                      counterSet: "line-numbering",
                      display: "block",
                      padding: "0",
                      width: "100vw",
                      height: "100vh",
                      fontSize: "16px",
                      padding: "16px",
                      outline: "none",
                      whiteSpace: "pre-wrap",
                      overflowY: "auto",
                    }}
                  >
                    {fileTree[currentFile].file.contents}
                  </code>
                </pre>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Project;
