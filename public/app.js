document.addEventListener('DOMContentLoaded', function() {
  const todoForm = document.getElementById('todo-form');
  const descriptionInput = document.getElementById('description');
  const todoTableBody = document.getElementById('todo-table').querySelector('tbody');
  const csvUploadForm = document.getElementById('csv-upload-form');
  const csvFileInput = document.getElementById('csv-file');
  const downloadCsvBtn = document.getElementById('download-csv-btn');

  const fetchTodos = async () => {
    const response = await fetch('/todos');
    const todos = await response.json();
    todoTableBody.innerHTML = '';
    todos.forEach(todo => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${todo.description}</td>
        <td>
          <button class="toggle-status-btn" data-id="${todo._id}">${todo.status === 'pending' ? 'Mark as Complete' : 'Mark as Pending'}</button>
          ${todo.status}
        </td>
        <td class="actions-btn">
          <button class="delete-btn" data-id="${todo._id}">Delete</button>
        </td>
      `;
      todoTableBody.appendChild(tr);
    });

    document.querySelectorAll('.toggle-status-btn').forEach(button => {
      button.addEventListener('click', async () => {
        const id = button.getAttribute('data-id');
        const newStatus = button.textContent.includes('Complete') ? 'completed' : 'pending';
        await fetch(`/todos/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus }),
        });
        fetchTodos();
      });
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', async () => {
        const id = button.getAttribute('data-id');
        await fetch(`/todos/${id}`, { method: 'DELETE' });
        fetchTodos();
      });
    });
  };

  todoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const description = descriptionInput.value.trim();
    if (description) {
      await fetch('/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
      });
      descriptionInput.value = '';
      fetchTodos();
    }
  });

  csvUploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', csvFileInput.files[0]);
    await fetch('/todos/upload', {
      method: 'POST',
      body: formData,
    });
    csvFileInput.value = '';
    fetchTodos();
  });

  downloadCsvBtn.addEventListener('click', async () => {
    const response = await fetch('/todos/download');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'todos.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  });

  fetchTodos();
});



