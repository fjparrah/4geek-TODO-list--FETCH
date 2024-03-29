import React, { useState, useEffect } from "react";

const Home = () => {
  const [inputValue, setInputValue] = useState("");
  const [todos, setTodos] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [refresh2, setRefresh2] = useState(false);

  useEffect(() => {
    fetchData();
  }, [refresh, refresh2]);

  const fetchData = () => {
    fetch("https://playground.4geeks.com/apis/fake/todos/user/fparra")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setTodos(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
       
      });
  };

  const addTodo = () => {
    
    if (inputValue.trim() !== "") {
      const newTodo = {
        label: inputValue,
        done: false,
      };
      if (todos.length === 0){
        handlePost()
      }
      fetch("https://playground.4geeks.com/apis/fake/todos/user/fparra", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([newTodo, ...todos ]),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
          })
        .then(() => {
          setInputValue("");
          fetchData();
          
        })
        .catch((error) => {
          console.error("Error adding new todo:", error);
        });
    }
  };

  const deleteTodo = (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    
    fetch("https://playground.4geeks.com/apis/fake/todos/user/fparra", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTodos),
      
    } ) 
      .then((response) => {
          if (!response.ok) {
          throw new Error("Network response was not ok");
            }
        return response.json();
      })
      .then(() => {
        fetchData();
        
      })
      .catch((error) => {
        console.error("Error deleting todo:", error);
      });
  };

  const clearAllTodos = () => {
    fetch("https://playground.4geeks.com/apis/fake/todos/user/fparra", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([]),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
       
      })
      .then(() => {
        handlePost();
         })
      .catch((error) => {
        console.error("Error clearing all todos:", error);
      });
  };
  
  const handlePost = async () => {
    try {
      const response = await fetch(
        "https://playground.4geeks.com/apis/fake/todos/user/fparra",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify([]),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("POST:", data);
        setRefresh2(!refresh2);
      } else {
        console.error("Error post:", response.statusText);
      }
    } catch (error) {
      console.error("Error post:", error);
      //
    }
  };

  

  return (
    <div className="container col-lg-6 col-xs-12">
      <div className="row mt-5">
        <div className="container-lg">
          <h1>To-do List </h1>
        </div>
        <div className="container mt-3">
          <ul>
            <li>
              <input
                placeholder="¿Qué necesitas hacer?"
                onChange={(e) => setInputValue(e.target.value)}
                value={inputValue}
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    addTodo();
                  }
                }}
                type="text"
              />
            </li>

            {todos.length === 0 ? (
              <li>No hay tareas, añadir tareas</li>
              
            ) : (
              todos.map((item, index) => (
                <li key={index}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>{item.label}</span>{" "}
                    <i
                      className="fas fa-trash-alt"
                      onClick={() => deleteTodo(index)}
                    ></i>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
        <div className="container pt-3 d-flex justify-content-center">
          <button className="btn btn-success mx-3" onClick={clearAllTodos}>
            Limpiar todas las tareas
          </button>
         
        </div>

        <div className="container pt-5">
          <h3>
            {todos.length === 0
              ? "No hay tareas para mostrar"
              : todos.length === 1
              ? `${todos.length} tarea`
              : `${todos.length} tareas`}
          </h3>
        </div>
      </div>
      <div className="pt-4"></div>
      
    </div>
  );
};

export default Home;
