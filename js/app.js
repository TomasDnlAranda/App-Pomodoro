const form = document.getElementById('formulario');
const alerts = document.getElementById('alert');
const inputTask = document.getElementById('task-input');
const renderTask = document.getElementById('container-tasks');
const templateTask = document.getElementById('templateTask').content;

let tasks = [];

form.addEventListener('submit', (e) => {
	e.preventDefault();

	const formData = new FormData(form);
	const [task] = [...formData.values()];

	if (!task.trim()) {
		alerts.classList.remove('alert-none');
		alerts.classList.add('alert');
		inputTask.style.border = '1.5px solid rgb(221, 0, 0)';
		return;
	} else {
		alerts.classList.add('alert-none');
		alerts.classList.remove('alert');
		inputTask.style.border = 'none';
	}
	getTask(task);
	renderTemplateTask();
});

const getTask = (task) => {
	tasksObject = {
		task: task,
		id: `${Date.now()}`,
	};
	tasks.push(tasksObject);
};

const renderTemplateTask = () => {
	localStorage.setItem('task', JSON.stringify(tasks));
	renderTask.textContent = '';
	const fragment = document.createDocumentFragment();

	tasks.forEach((item) => {
		const clone = templateTask.cloneNode(true);
		clone.querySelector('span').textContent = item.task;
		clone.querySelector('.init-btn').dataset.id = item.id;
		clone.querySelector('.del-task').dataset.id = item.id;
		fragment.appendChild(clone);
	});
	renderTask.appendChild(fragment);
};

document.addEventListener('DOMContentLoaded', (e) => {
	if (localStorage.getItem('task')) {
		tasks = JSON.parse(localStorage.getItem('task'));
		renderTemplateTask();
	}
});

document.addEventListener('click', (e) => {
	if (e.target.matches('.init-btn')) {
		tasks.forEach((item) => {
			if (e.target.dataset.id === item.id) {
				console.log('si');
			}
		});
	}
	if (e.target.matches('.del-task')) {
		tasks.forEach((item) => {
			if (e.target.dataset.id === item.id) {
				tasks = tasks.filter((item) => e.target.dataset.id !== item.id);
				renderTemplateTask();
			}
		});
	}
});
