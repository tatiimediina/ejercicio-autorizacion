import Swal from "sweetalert2";

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
  const btnContainer = document.createElement("div");
  btnContainer.classList.add("flex", "gap-4");

  const btnHome = document.createElement("button");
  const btnCreate = document.createElement("button");

  btnHome.classList.add(
    "bg-blue-500",
    "text-white",
    "p-2",
    "rounded",
    "hover:bg-blue-600",
    "mb-4"
  );
  btnCreate.classList.add(
    "bg-purple-500",
    "text-white",
    "p-2",
    "rounded",
    "hover:bg-blue-600",
    "mb-4"
  );

  btnHome.textContent = "Home";
  btnCreate.textContent = "Create";

  btnHome.addEventListener("click", () => {
    window.location.pathname = "/home";
  });

  const title = document.createElement("h1");

  title.classList.add("text-3xl", "font-bold", "mb-4");
  title.textContent = "List of Todos";

  const table = document.createElement("table");

  table.classList.add(
    "w-1/2",
    "bg-white",
    "shadow-md",
    "h-[700px]",
    "overflow-y-scroll"
  );

  const thead = document.createElement("thead");
  const tr = document.createElement("tr");
  const th1 = document.createElement("th");
  th1.classList.add("border", "px-4", "py-2");
  th1.textContent = "ID";

  const th2 = document.createElement("th");
  th2.classList.add("border", "px-4", "py-2");
  th2.textContent = "Title";

  const th3 = document.createElement("th");
  th3.classList.add("border", "px-4", "py-2");
  th3.textContent = "Completed";

  const th4 = document.createElement("th");
  th4.classList.add("border", "px-4", "py-2");
  th4.textContent = "Owner Id";

  tr.appendChild(th1);
  tr.appendChild(th2);
  tr.appendChild(th3);
  tr.appendChild(th4);

  thead.appendChild(tr);

  const tbody = document.createElement("tbody");

  tbody.classList.add("text-center");
  table.appendChild(thead);
  table.appendChild(tbody);

  btnContainer.appendChild(btnHome);
  btnContainer.appendChild(btnCreate);
  fetch("http://localhost:4000/todos", {
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      data.forEach((todo) => {
        const tr = document.createElement("tr");

        const td1 = document.createElement("td");
        td1.classList.add("border", "px-4", "py-2");
        td1.textContent = todo.id;

        const td2 = document.createElement("td");
        td2.classList.add("border", "px-4", "py-2");
        td2.textContent = todo.title;

        const td3 = document.createElement("td");
        td3.classList.add("border", "px-4", "py-2");
        td3.textContent = todo.completed ? "Sí" : "No";

        const td4 = document.createElement("td");
        td4.classList.add("border", "px-4", "py-2");
        td4.textContent = todo.owner;

        const td5 = document.createElement("td");
        td5.classList.add("flex", "flex-row", "gap-2");
        const btnDelete = document.createElement("button");
        btnDelete.classList.add("bg-red-500", "text-white", "p-2", "rounded");
        btnDelete.textContent = "Delete";
        const btnEdit = document.createElement("button");
        btnEdit.classList.add("bg-green-500", "text-white", "p-2", "rounded");
        btnEdit.textContent = "Edit";

        btnDelete.addEventListener("click", async () => {
          try {
            const response = await fetch(
              `http://localhost:4000/todos/${todo.id}`,
              {
                method: "DELETE",
                credentials: "include",
              }
            );

            if (response.ok) {
              tr.remove();
            } else {
              console.error("Error al eliminar la tarea.");
            }
          } catch (error) {
            console.error("Hubo un error al conectarse al servidor:", error);
          }
        });
        btnEdit.addEventListener("click", () => {
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
          </div>
            `,
            focusConfirm: false,
            preConfirm: () => {
              const title = document.getElementById("title").value;
              const completed = document.getElementById("completed").checked;

              return { title, completed };
            },
          })
            .then((result) => {
              if (result.isConfirmed) {
                const { title, completed } = result.value;

                fetch(`http://localhost:4000/todos/${todo.id}`, {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  credentials: "include",
                  body: JSON.stringify({
                    title,
                    completed,
                    owner: todo.owner,
                  }),
                });
              }
            })
            .then(() => {
              window.location.reload();
            });
        });
        btnCreate.addEventListener("click", () => {
          Swal.fire({
            title: "Create New Todo",
            html: `
              <div class="flex flex-col gap-1">
              <input id="new-title" class="swal2-input" placeholder="Title">
              <input id="new-completed" type="checkbox"> Completed
          </div>
            `,
            focusConfirm: false,
            preConfirm: () => {
              const title = document.getElementById("new-title").value;
              const completed =
                document.getElementById("new-completed").checked;

              return { title, completed };
            },
          }).then((result) => {
            if (result.isConfirmed) {
              const { title, completed } = result.value;

              fetch("http://localhost:4000/todos/add", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                  title,
                  completed,
                }),
              }).then(() => {
                window.location.reload();
              });
            }
          });
        });

        td5.appendChild(btnDelete);
        td5.appendChild(btnEdit);

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);

        tbody.appendChild(tr);
      });
    });

  container.appendChild(title);
  container.appendChild(btnContainer);
  container.appendChild(table);

  return container;
};
