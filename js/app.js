const form = document.getElementById('formulario');
const alerts = document.getElementById('alert');
const inputTask = document.getElementById('task-input');
const renderTask = document.getElementById('container-tasks');
const templateTask = document.getElementById('templateTask').content;
const schedule = document.getElementById('schedule');
const btnSetting = document.querySelector('.bi-gear-fill');
const taskSchedule = document.querySelector('.task-schedule');
const formSetting = document.getElementById('form-setting');
const setting = document.querySelector('.container-setting');

let time = 0;
let timer = null;
let timerBr = null;
let validation = true;

let tasks = [];
const settings = [];

const getTask = (task) => {
	tasksObject = {
		task: task,
		id: `${Date.now()}`,
		status: 'iniciar',
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
		clone.querySelector('.init-btn').textContent = item.status;
		clone.querySelector('.del-task').dataset.id = item.id;
		fragment.appendChild(clone);
	});
	renderTask.appendChild(fragment);
};

const timerRender = (e) => {
	time = schedule.dataset.minutes * 60;
	timer = setInterval(() => {
		timeHandler(e);
	}, 1000);
};

const timeHandler = (e) => {
	time--;
	renderTime();

	if (time == 0) {
		clearInterval(timer);
		taskSchedule.textContent = '';
		taskSchedule.textContent = 'Breack';
		tasks = tasks.filter((item) => e.target.dataset.id !== item.id);
		schedule.textContent = '00:03';
		btnSetting.style.display = 'flex';
		timerBreack();
		renderTemplateTask();
	}
};

const renderTime = () => {
	const minutes = parseInt(time / 60);
	const seconds = parseInt(time % 60);
	schedule.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const timerBreack = () => {
	time = 1 * 4;
	timerBr = setInterval(() => {
		timeBreackHandler();
	}, 1000);
};

const timeBreackHandler = () => {
	time--;
	renderBreackTime();

	if (time == 0) {
		validation = true;
		taskSchedule.textContent = '';
		tasks.forEach((item) => {
			item.status = 'iniciar';
		});
		schedule.textContent = '00:10';
		clearInterval(timerBr);
		renderTemplateTask();
	}
};

const renderBreackTime = () => {
	const minutes = parseInt(time / 60);
	const seconds = parseInt(time % 60);
	schedule.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

document.addEventListener('DOMContentLoaded', (e) => {
	if (localStorage.getItem('task')) {
		tasks = JSON.parse(localStorage.getItem('task'));
		tasks.forEach((item) => {
			item.status = 'iniciar';
		});
		renderTemplateTask();
	}
});

document.addEventListener('click', (e) => {
	if (e.target.matches('.init-btn')) {
		tasks.forEach((item) => {
			if (e.target.dataset.id === item.id) {
				console.log(item);
				if (validation) {
					validation = false;
					item.status = 'Progreso';
					console.log(e.target);
					taskSchedule.textContent = item.task;
					btnSetting.style.display = 'none';
					timerRender(e);
					renderTemplateTask();
				} else if (item.status === 'iniciar') {
					item.status = 'Espera';
					renderTemplateTask();
				}
			}
		});
	}
	if (e.target.matches('.del-task')) {
		tasks.forEach((item) => {
			if (e.target.dataset.id === item.id) {
				tasks = tasks.filter((item) => e.target.dataset.id !== item.id);
				renderTemplateTask(e);
				renderTime();
				if (item.status === 'Progreso') {
					validation = true;
					time = 0;
					btnSetting.style.display = 'flex';
					taskSchedule.textContent = '';
					renderTime();
					clearInterval(timer);
					clearInterval(timerBr);
					renderTemplateTask(e);
					schedule.textContent = `${schedule.dataset.minutes < 10 ? '0' : ''}${schedule.dataset.minutes}:00`;
				}
			}
		});
	}
	if (e.target.matches('.bi-gear-fill')) {
		setting.style.display = 'flex';
	}
});

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

formSetting.addEventListener('submit', (e) => {
	e.preventDefault();
	const formDataSetting = new FormData(formSetting);
	const [minutes] = [...formDataSetting.values()];
	parseInt(minutes);
	schedule.dataset.minutes = minutes;
	schedule.textContent = `${minutes < 10 ? '0' : ''}${minutes}:00`;
	setting.style.display = 'none';
});
