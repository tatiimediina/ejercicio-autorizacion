import Swal from "sweetalert2";

// Función para crear botones
const createButton = (text, classes, onClick) => {
  const button = document.createElement("button");
  button.textContent = text;
  button.classList.add(...classes);
  button.addEventListener("click", onClick);
  return button;
};

// Función principal de la página
export const todosPage = () => {
  const container = document.createElement("div");
  container.classList.add(
    "flex",
    "flex-col",
    "items-center",
    "justify-center",
    "h-screen",
    "bg-gray-200"
  );

  // Título
  const title = document.createElement("h1");
  title.classList.add("text-3xl", "font-bold", "mb-4");
  title.textContent = "List of Todos";
  container.appendChild(title);

  // Botones
  const btnContainer = document.createElement("div");
  btnContainer.classList.add("flex", "gap-4");

  const btnHome = createButton(
    "Home",
    [
      "bg-blue-500",
      "text-white",
      "p-2",
      "rounded",
      "hover:bg-blue-600",
      "mb-4",
    ],
    () => {
      window.location.pathname = "/home";
    }
  );

  /* const btnCreate = createButton(
    "Create",
    [
      "bg-purple-500",
      "text-white",
      "p-2",
      "rounded",
      "hover:bg-blue-600",
      "mb-4",
    ],
    () => {
      Swal.fire({
        title: "Create New Todo",
        html: `
        <div class="flex flex-col gap-1">
        <input id="new-title" class="swal2-input" placeholder="Title">
        <input id="new-completed" type="checkbox"> Completed
        </div>`,
        focusConfirm: false,
        preConfirm: () => {
          const title = document.getElementById("new-title").value;
          const completed = document.getElementById("new-completed").checked;
          return { title, completed };
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          const { title, completed } = result.value;

          await fetch("http://localhost:4000/todos/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ title, completed }),
          });
          window.location.reload();
        }
      });
    }
  ); */

  const btnCreate = createButton(
    "Create",
    [
      "bg-purple-500",
      "text-white",
      "p-2",
      "rounded",
      "hover:bg-blue-600",
      "mb-4",
    ],
    () => {
      Swal.fire({
        title: "Create New Todo",
        html: `
        <div class="flex flex-col gap-1">
          <input id="new-title" class="swal2-input" placeholder="Title">
          <input id="new-completed" type="checkbox"> Completed
        </div>`,
        focusConfirm: false,
        preConfirm: () => {
          const title = document.getElementById("new-title").value;
          const completed = document.getElementById("new-completed").checked;

          if (!title || title.trim() === "") {
            Swal.showValidationMessage(
              "El título no puede estar vacío o solo tener espacios en blanco."
            );
            return;
          }

          return { title: title.trim(), completed };
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          const { title, completed } = result.value;

          try {
            await fetch("http://localhost:4000/todos/add", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ title, completed }),
            });
            window.location.reload();
          } catch (error) {
            Swal.fire("Error", "Hubo un problema al crear la tarea.", "error");
          }
        }
      });
    }
  );

  btnContainer.appendChild(btnHome);
  btnContainer.appendChild(btnCreate);
  container.appendChild(btnContainer);

  // Contenedor de tareas
  const todosContainer = document.createElement("div");
  todosContainer.classList.add(
    "w-full",
    "max-w-4xl",
    "grid",
    "grid-cols-1",
    "md:grid-cols-2",
    "lg:grid-cols-3",
    "gap-4"
  );
  container.appendChild(todosContainer);

  // Obtener los datos
  const loadTodos = async () => {
    try {
      const response = await fetch("http://localhost:4000/todos", {
        credentials: "include",
      });
      const data = await response.json();
      data.forEach((todo) => {
        // Crear tarjeta (contenedor) para cada tarea
        const todoCard = document.createElement("div");
        todoCard.classList.add(
          "bg-white",
          "shadow-md",
          "p-4",
          "rounded",
          "flex",
          "flex-col",
          "gap-2",
          "rounded-xl",
          "hover:scale-105"
        );

        const title = document.createElement("h2");
        title.classList.add("text-lg", "font-bold");
        title.textContent = todo.title;
        todoCard.appendChild(title);

        todoCard.setAttribute("data-id", todo.id);

        const completed = document.createElement("p");
        completed.textContent = `Completed: ${todo.completed ? "Yes" : "No"}`;
        todoCard.appendChild(completed);

        // Botones de acción (Editar, Eliminar)
        const actionsContainer = document.createElement("div");
        actionsContainer.classList.add("flex", "gap-2");

        const btnDelete = createButton(
          "Delete",
          ["bg-red-500", "text-white", "p-2", "rounded"],
          async () => {
            Swal.fire({
              title: "Are you sure?",
              text: "You won't be able to revert this!",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Yes, delete it!",
            }).then(async (result) => {
              if (result.isConfirmed) {
                try {
                  const response = await fetch(
                    `http://localhost:4000/todos/${todo.id}`,
                    { method: "DELETE", credentials: "include" }
                  );
                  if (response.ok) {
                    todoCard.remove();
                    Swal.fire(
                      "Deleted!",
                      "Your task has been deleted.",
                      "success"
                    );
                  } else {
                    Swal.fire("Error", "Error al eliminar la tarea.", "error");
                  }
                } catch (error) {
                  Swal.fire(
                    "Error",
                    "Hubo un error al conectarse al servidor.",
                    "error"
                  );
                }
              }
            });
          }
        );

        const btnEdit = createButton(
          "Edit",
          ["bg-green-500", "text-white", "p-2", "rounded"],
          () => {
            Swal.fire({
              title: "Edit Todo",
              html: `
              <div class="flex flex-col gap-1">
              <input id="title" class="swal2-input" placeholder="Title" value="${
                todo.title
              }">
              <input id="completed" type="checkbox" ${
                todo.completed ? "checked" : ""
              }> Completed
            </div>`,
              focusConfirm: false,
              preConfirm: () => {
                const title = document.getElementById("title").value;
                const completed = document.getElementById("completed").checked;

                if (!title || title.trim() === "") {
                  Swal.showValidationMessage(
                    "El título no puede estar vacío o solo tener espacios en blanco."
                  );
                  return;
                }
                return { title: title.trim(), completed };
              },
            }).then(async (result) => {
              if (result.isConfirmed) {
                const { title, completed } = result.value;
                await fetch(`http://localhost:4000/todos/${todo.id}`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  credentials: "include",
                  body: JSON.stringify({ title, completed, owner: todo.owner }),
                });
                window.location.reload();
              }
            });
          }
        );

        actionsContainer.appendChild(btnDelete);
        actionsContainer.appendChild(btnEdit);
        todoCard.appendChild(actionsContainer);

        todosContainer.appendChild(todoCard);
      });
    } catch (error) {
      Swal.fire("Error", "Error al cargar los datos.", "error");
    }
  };

  loadTodos();

  return container;
};
