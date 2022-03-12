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
const btnPlay = document.querySelector('.bi-play-circle-fill');
const btnPause = document.querySelector('.bi-stop-circle-fill');
const valueSettings = document.querySelector('#form-setting > input[type=submit]:nth-child(5)');

let time = 0;
let timer = null;
let timerBr = null;
let validation = true;

let tasks = [];

const getTask = (task) => {
	tasksObject = {
		task: task,
		id: `${Date.now()}`,
		status: 'Iniciar',
		color: valueSettings.dataset.color,
	};
	tasks.push(tasksObject);
};

const renderTemplateTask = () => {
	localStorage.setItem('task', JSON.stringify(tasks));
	renderTask.textContent = '';
	const fragment = document.createDocumentFragment();

	tasks.forEach((item) => {
		const clone = templateTask.cloneNode(true);
		clone.querySelector('span cite').textContent = item.task;
		clone.querySelector('.init-btn').dataset.id = item.id;
		clone.querySelector('.init-btn').textContent = item.status;
		clone.querySelector('.del-task').dataset.id = item.id;
		clone.querySelector('span cite').style.color = item.color;
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
			item.status = 'Iniciar';
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
			item.status = 'Iniciar';
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
					btnPlay.style.display = 'none';
					btnPause.style.display = 'none';
					item.status = 'Progreso';
					taskSchedule.textContent = item.task;
					btnSetting.style.display = 'none';
					schedule.textContent = `${schedule.dataset.minutes < 10 ? '0' : ''}${schedule.dataset.minutes}:00`;
					clearInterval(timer);
					timerRender(e);
					renderTemplateTask();
				} else if (item.status === 'Iniciar') {
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
					btnPlay.style.display = 'flex';
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
	if (e.target.matches('.bi-play-circle-fill')) {
		timerRender();
		btnPlay.style.display = 'none';
		btnPause.style.display = 'flex';
	}
	if (e.target.matches('.bi-stop-circle-fill')) {
		clearInterval(timer);
		taskSchedule.textContent = '';
		schedule.textContent = `${schedule.dataset.minutes < 10 ? '0' : ''}${schedule.dataset.minutes}:00`;
		btnPlay.style.display = 'flex';
		btnPause.style.display = 'none';
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
	const [minutes, color] = [...formDataSetting.values()];
	console.log(color);
	btnPlay.style.display = 'flex';
	btnPause.style.display = 'none';
	parseInt(minutes);
	clearInterval(timer);
	schedule.dataset.minutes = minutes;
	schedule.textContent = `${minutes < 10 ? '0' : ''}${minutes}:00`;
	valueSettings.dataset.color = color;
	setting.style.display = 'none';
});
