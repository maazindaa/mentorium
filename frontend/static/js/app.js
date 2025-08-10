
// Основной клиентский код MENTORIUM (перенесён из inline-скрипта)
const { useState, useEffect, useRef } = React;

// Карта маршрутов (slug -> русское название)
const routeMap = {
	ege: { math: 'ЕГЭ - Математика', russian: 'ЕГЭ - Русский язык', physics: 'ЕГЭ - Физика' },
	oge: { math: 'ОГЭ - Математика', russian: 'ОГЭ - Русский язык', physics: 'ОГЭ - Физика' },
};

const courseDetails = {
	'ЕГЭ - Математика': 'Полный курс подготовки к ЕГЭ по математике. 100+ часов видео, тесты и разборы.',
	'ЕГЭ - Русский язык': 'Интенсивная подготовка к ЕГЭ по русскому. Грамматика, орфография и сочинения.',
	'ЕГЭ - Физика': 'Подготовка к ЕГЭ по физике: теория, задачи, практика.',
	'ОГЭ - Математика': 'Подготовка к ОГЭ по математике с нуля.',
	'ОГЭ - Русский язык': 'Подготовка к ОГЭ по русскому: грамматика и сочинения.',
	'ОГЭ - Физика': 'Подготовка к ОГЭ по физике: теория, задачи, практика.'
};

// Университеты + изображения (если файла нет, выпадет graceful fallback)
const topUniImages = [
	{ abbr: 'МГУ',   name: 'МГУ им. М. В. Ломоносова', src: 'static/assets/images/universities/mgu.jpg' },
	{ abbr: 'МФТИ',  name: 'МФТИ', src: 'static/assets/images/universities/mfti.jpg' },
	{ abbr: 'МГТУ',  name: 'МГТУ им. Н. Э. Баумана', src: 'static/assets/images/universities/mgtu.jpg' },
	{ abbr: 'ВШЭ',   name: 'НИУ ВШЭ', src: 'static/assets/images/universities/hse.jpg' },
	{ abbr: 'СПбГУ', name: 'СПбГУ', src: 'static/assets/images/universities/spbgu.jpg' },
	{ abbr: 'ИТМО',  name: 'Университет ИТМО', src: 'static/assets/images/universities/itmo.jpg' },
	{ abbr: 'МИФИ',  name: 'НИЯУ МИФИ', src: 'static/assets/images/universities/mifi.jpg' },
	{ abbr: 'МИСиС', name: 'НИТУ МИСиС', src: 'static/assets/images/universities/misis.jpg' },
];

// Отзывы
const reviews = [
	{ name: 'Александра', meta: 'ЕГЭ: математика, 92 балла', text: 'Занятия структурированные и понятные, много практики. Благодаря менторам разобралась в сложных темах и уверенно сдала экзамен.' },
	{ name: 'Даниил', meta: 'ОГЭ: математика, «5»', text: 'Отличные разборы заданий. Понравилось, что дают понятные алгоритмы решения и материалы в PDF. Результат превзошёл ожидания.' },
	{ name: 'Мария', meta: 'Родитель', text: 'Ребёнок готовился с интересом весь год. Преподаватели на связи, дают обратную связь и поддерживают мотивацию.' },
	{ name: 'Илья', meta: 'ЕГЭ: физика, 90 баллов', text: 'Системный подход, понятные конспекты и практика. Итоговые баллы выросли по всем темам из кодификатора.' },
	{ name: 'Полина', meta: 'ЕГЭ: русский, 88 баллов', text: 'Чёткие объяснения, полезные шаблоны сочинений и разбор типичных ошибок. Очень помогло на экзамене.' },
	{ name: 'Никита', meta: 'ОГЭ: математика, «5»', text: 'Понравился формат: короткие видео + задания по уровням. Удобно повторять и закреплять.' },
	{ name: 'Виктория', meta: 'ЕГЭ: математика, 94 балла', text: 'Отдельное спасибо за разборы сложных задач второй части — стало реально понятно, как их решать.' },
	{ name: 'Кирилл', meta: 'ЕГЭ: физика, 86 баллов', text: 'Много практики, быстрые ответы на вопросы. Удобная структура курса, ничего лишнего.' },
	{ name: 'Екатерина', meta: 'Родитель', text: 'Заметили прогресс уже через месяц. Ребёнок стал увереннее и начал получать высокие оценки на пробниках.' },
	{ name: 'Арсений', meta: 'ОГЭ: русский, «5»', text: 'Полезные чек-листы и тренажёры. Перед экзаменом чувствовал себя спокойно и подготовлено.' },
];

// PDF материалы
const pdfs = [
	{ title: 'Задание 20.1 — Выражения', src: 'https://storage.yandexcloud.net/mentorium/pdf/20.1.pdf' },
	{ title: 'Задание 20.2 — Уравнения', src: 'https://storage.yandexcloud.net/mentorium/pdf/20.2.pdf' },
	{ title: 'Задание 20.3 — Системы уравнений', src: 'https://storage.yandexcloud.net/mentorium/pdf/20.3.pdf' },
	{ title: 'Задание 20.4 — Неравенства', src: 'https://storage.yandexcloud.net/mentorium/pdf/20.4.pdf' },
	{ title: 'Задание 21.1 — Движение по прямой', src: 'https://storage.yandexcloud.net/mentorium/pdf/21.1.pdf' },
	{ title: 'Задание 21.2 — Средняя скорость и движение по окружности', src: 'https://storage.yandexcloud.net/mentorium/pdf/21.2.pdf' },
];

// Видео по заданиям (пример)
const ogeMathVideo = 'https://storage.yandexcloud.net/mentorium/video/20%20zadanie%2016.02.2025.mp4'; // TODO: перенести в site/assets/videos и обновить путь
const ogeTaskVideos = { 20: ogeMathVideo };

// Данные тренажёра
const ogeTrainerData = {
	20: [
		{
			question: 'Найдите значение выражения $11a-7b+21$, если $\\dfrac{4a-5b+6}{5a-4b+6}=3$',
			options: ['2', '-5', '9', '14'],
			correct: 2,
			hints: ['Представьте $125$ как степень числа $5$.', 'Приравняйте показатели: $x - 1 = 3$.'],
		},
		{
			question: 'Вычислите значение выражения $2x^2 - 5x + 1$ при $x = 3$.',
			options: ['4', '7', '10', '13'],
			correct: 0,
			hints: ['Аккуратно подставьте $x = 3$ и считайте по действиям.', 'Сначала найдите $x^2$, затем выполните умножение и сложение.'],
		},
		{
			question: 'В прямоугольном треугольнике катеты равны $6$ и $8$. Найдите гипотенузу.',
			options: ['9', '10', '12', '14'],
			correct: 1,
			hints: ['Используйте теорему Пифагора: $c^2 = a^2 + b^2$.', '$6^2 + 8^2 = 36 + 64$.'],
		},
		{
			question: 'Определите интервал убывания функции $y = 2x^2 - 8x + 5$.',
			options: ['$(-\\infty; 4)$', '$(0; 2)$', '$(2; 4)$', '$(4; +\\infty)$'],
			correct: 1,
			hints: ['Найдите $x$ вершины: $x_0 = -\\frac{b}{2a}$.', 'Парабола направлена вверх, убывает слева от вершины.'],
		},
		{
			question: 'Решите неравенство: $3x - 7 < 2x + 4$.',
			options: ['$x < 11$', '$x > 11$', '$x < -11$', '$x > -11$'],
			correct: 0,
			hints: ['Перенесите члены с $x$ влево, числа вправо.', 'Сравните получившееся значение $x$.'],
		},
	],
	21: [
		{
			question: 'Сравните дроби: какая больше?',
			options: ['$\\tfrac{1}{2}$', '$\\tfrac{2}{3}$', '$\\tfrac{3}{5}$', '$\\tfrac{5}{9}$'],
			correct: 1,
			hints: ['Приведите к общему знаменателю или сравните десятичные значения.', 'Сравните $0{,}5$, $0{,}66\\ldots$, $0{,}6$ и $0{,}55\\ldots$'],
		},
		{
			question: 'Найдите значение выражения: $(a - b)^2$ при $a = 7$, $b = 3$.',
			options: ['10', '12', '14', '16'],
			correct: 3,
			hints: ['Сначала вычислите разность, затем возведите в квадрат.', '$7 - 3 = 4$; $4^2 = 16$.'],
		},
	],
};

// Утилиты
const getTaskFromPdf = (item) => {
	const file = (item?.src || '').split('/').pop() || '';
	const num = Number(file.split('.')[0]);
	return Number.isFinite(num) ? num : null;
};
const getPdfsForTask = (n) => pdfs.filter((p) => getTaskFromPdf(p) === n);

// Компонент вывода формул
const MathText = ({ text }) => {
	const ref = useRef(null);
	useEffect(() => {
		if (!window.renderMathInElement || !ref.current) return;
		try {
			ref.current.innerHTML = text;
			window.renderMathInElement(ref.current, {
				delimiters: [
					{ left: '$$', right: '$$', display: true },
					{ left: '$', right: '$', display: false },
					{ left: '\\(', right: '\\)', display: false },
					{ left: '\\[', right: '\\]', display: true }
				],
				throwOnError: false,
			});
		} catch {}
	}, [text]);
	return <span ref={ref} />;
};

// Хэш-ротинг
const toView = (exam, slug) => (routeMap[exam] ? routeMap[exam][slug] : null);
const parseHashFull = () => {
	const h = window.location.hash.replace(/^#/, '');
	if (!h || h === '/' || h === '') return { view: 'home', task: null };
	const parts = h.replace(/^\//, '').split('/'); // exam / slug / maybe task
	const [exam, slug] = parts;
	if (exam && slug) {
		if (exam === 'oge' && slug === 'math' && parts[2]) {
			const task = Number(parts[2]);
			return { view: 'ОГЭ - Математика', task: Number.isFinite(task) ? task : null };
		}
		const task = parts[2] ? Number(parts[2]) : null;
		return { view: toView(exam, slug), task: Number.isFinite(task) ? task : null };
	}
	return { view: 'home', task: null };
};
const goRoute = (exam, slug) => { window.location.hash = `#/${exam}/${slug}`; };
const goOgeTask = (n) => { window.location.hash = `#/oge/math/${n}`; };
const goHome = () => { window.location.hash = '#/'; };

// Компонент безопасной загрузки изображений
function SafeImg({ src, alt, className='', fallbackClass='', children, ...rest }) {
	const [err, setErr] = useState(false);
	if (!src || err) {
		return <div className={`img-fallback flex items-center justify-center ${fallbackClass} ${className}`}>{children || (alt ? alt[0] : '?')}</div>;
	}
	return <img src={src} alt={alt} className={className} onError={() => setErr(true)} {...rest} />;
}

function MentoriumLanding() {
	const [view, setView] = useState('home');
	const [selectedTask, setSelectedTask] = useState(null);
	const [activePdf, setActivePdf] = useState(null);

	// Состояния тренажёра
	const [choices, setChoices] = useState([]);
	const [checked, setChecked] = useState(false);
	const [activeHint, setActiveHint] = useState(null);
	const [showMenu, setShowMenu] = useState(false);
	const [qIndex, setQIndex] = useState(0);
	const [results, setResults] = useState([]);
	const [showSummary, setShowSummary] = useState(false);
	const hintsBtnRef = useRef(null);
	const hintsMenuRef = useRef(null);

	// Полный логотип (белая цветная версия) из брендпака. Если статика сервится из папки `site/`,
	// и обращение к `../` недоступно, перенесите файл в, например, `site/static/assets/brand/` и обновите путь.
	const logoPath = 'static/assets/brand/logotype_color2_black.svg';

	const goBack = () => { setActivePdf(null); if (window.history.length > 1) window.history.back(); else goHome(); };
	const goHomeSection = (id) => {
		const { view: v } = parseHashFull();
		if (v !== 'home') {
			goHome();
			setTimeout(() => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth' }); }, 60);
		} else { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth' }); }
	};
	const findSlug = (exam, ruName) => { const entry = Object.entries(routeMap[exam] || {}).find(([, ru]) => ru === ruName); return entry ? entry[0] : null; };

	useEffect(() => {
		const apply = () => { const { view: v, task } = parseHashFull(); setView(v); setSelectedTask(task); };
		if (!window.location.hash) goHome();
		apply();
		window.addEventListener('hashchange', apply);
		return () => window.removeEventListener('hashchange', apply);
	}, []);

	// Клик вне меню подсказок
	useEffect(() => {
		const onDocClick = (e) => {
			if (!showMenu) return;
			if (hintsBtnRef.current && hintsBtnRef.current.contains(e.target)) return;
			if (hintsMenuRef.current && hintsMenuRef.current.contains(e.target)) return;
			setShowMenu(false);
		};
		document.addEventListener('mousedown', onDocClick);
		return () => document.removeEventListener('mousedown', onDocClick);
	}, [showMenu]);

	// Сброс при смене задания/вида
	useEffect(() => {
		setChoices([]); setChecked(false); setActiveHint(null); setShowMenu(false); setQIndex(0); setResults([]); setShowSummary(false);
	}, [selectedTask, view]);

	if (view !== 'home') {
		return (
			<>
				<div className={`min-h-screen flex flex-col font-sans bg-white text-gray-900 ${view === 'ОГЭ - Математика' ? 'p-6 max-w-6xl mx-auto' : 'p-6 max-w-3xl mx-auto'}`}>
					<div className="flex-1">
						<button onClick={goBack} className="text-indigo-600 mb-6 hover:underline">← Назад</button>
						<h2 className="text-3xl font-bold mb-4">{view}</h2>
						<p className="text-gray-700">{courseDetails[view] || 'Описание курса.'}</p>
						{view === 'ОГЭ - Математика' && (
							<div className="mt-10">
								{selectedTask == null ? (
									<div>
										<h3 className="text-2xl font-display font-bold mb-4">Задания ОГЭ по номерам</h3>
										<p className="text-gray-600 mb-8">ОГЭ по математике состоит из двух частей: Часть 1 (1–19) — задания с кратким ответом; Часть 2 (20–25) — задания с развёрнутым решением. Выберите номер задания.</p>
										<div className="mb-8">
											<div className="flex items-center gap-3 mb-3">
												<h4 className="text-xl font-display font-semibold">Часть 1</h4>
												<span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">краткий ответ</span>
											</div>
											<div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3">
												{Array.from({ length: 19 }, (_, i) => i + 1).map((n) => {
													const available = [].includes(n); // пока нет доступных
													return (
														<button key={n} onClick={() => available && goOgeTask(n)} disabled={!available} className={`task-btn ${available ? 'task-btn--available' : 'task-btn--disabled'}`} title={available ? `Перейти к заданию ${n}` : 'Материалы скоро'}>{n}</button>
													);
												})}
											</div>
										</div>
										<div>
											<div className="flex items-center gap-3 mb-3">
												<h4 className="text-xl font-display font-semibold">Часть 2</h4>
												<span className="text-xs px-2 py-1 rounded-full bg-indigo-50 text-brandPurple">развёрнутый ответ</span>
											</div>
											<div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3">
												{Array.from({ length: 6 }, (_, i) => i + 20).map((n) => {
													const available = [20, 21].includes(n);
													return (
														<button key={n} onClick={() => available && goOgeTask(n)} disabled={!available} className={`task-btn ${available ? 'task-btn--available' : 'task-btn--disabled'}`} title={available ? `Перейти к заданию ${n}` : 'Материалы скоро'}>{n}</button>
													);
												})}
											</div>
										</div>
									</div>
								) : (
									<div>
										<div className="flex items-center justify-between mb-4">
											<h3 className="text-2xl font-display font-bold">Задание {selectedTask}</h3>
											<button onClick={() => goRoute('oge','math')} className="text-sm text-brandPurple hover:underline">← Все задания</button>
										</div>
										{ogeTaskVideos[selectedTask] ? (
											<div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
												<video className="w-full h-auto bg-black" src={ogeTaskVideos[selectedTask]} controls preload="metadata" playsInline />
											</div>
										) : (
											<div className="p-6 rounded-xl border border-gray-200 bg-gray-50 text-gray-600">Видеоразбор в разработке.</div>
										)}
										{ogeTaskVideos[selectedTask] && (
											<div className="mt-3 text-sm">
												<a className="text-brandPurple hover:underline font-medium" href={ogeTaskVideos[selectedTask]} download>Скачать видео</a>
											</div>
										)}
										<h4 className="mt-8 text-xl font-display font-semibold mb-3">Материалы (PDF)</h4>
										<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
											{getPdfsForTask(selectedTask).length > 0 ? (
												getPdfsForTask(selectedTask).map((item) => (
													<div key={item.src} className="border border-gray-200 rounded-xl p-5 flex flex-col">
														<div className="flex-1">
															<p className="font-medium text-gray-900 mb-2">{item.title}</p>
															<p className="text-sm text-gray-600">Открыть на сайте или скачать для печати.</p>
														</div>
														<div className="mt-4 flex items-center gap-3">
															<button className="btn-brand text-sm" onClick={() => setActivePdf(item)}>Открыть</button>
															<a className="text-sm font-medium text-brandPurple hover:underline" href={item.src} download>Скачать</a>
														</div>
													</div>
												))
											) : (
												<div className="col-span-full text-gray-600">Пока материалов нет. Скоро добавим.</div>
											)}
										</div>
										{Array.isArray(ogeTrainerData[selectedTask]) && (
											<div className="mt-10">
												<h4 className="text-xl font-display font-semibold mb-4">Онлайн‑тренажёр</h4>
												<Trainer selectedTask={selectedTask} {...{ choices, setChoices, checked, setChecked, activeHint, setActiveHint, showMenu, setShowMenu, qIndex, setQIndex, results, setResults, showSummary, setShowSummary, hintsBtnRef, hintsMenuRef }} />
											</div>
										)}
									</div>
								)}
							</div>
						)}
					</div>
					<footer className="border-t border-gray-200 pt-0 text-center text-sm text-gray-500">
						<div className="h-1 bg-gradient-to-r from-brandPurple to-brandBlue" />
						<div className="py-6">© 2025 MENTORIUM. Все права защищены.</div>
					</footer>
				</div>
				{activePdf && (
					<PdfModal activePdf={activePdf} onClose={() => setActivePdf(null)} />
				)}
				{showSummary && Array.isArray(ogeTrainerData[selectedTask]) && (
					<SummaryModal selectedTask={selectedTask} choices={choices} results={results} setShowSummary={setShowSummary} setChoices={setChoices} setResults={setResults} setChecked={setChecked} setActiveHint={setActiveHint} setQIndex={setQIndex} />
				)}
			</>
		);
	}

	return (
		<div className="min-h-screen flex flex-col font-sans bg-white text-gray-900">
			<header className="border-b border-gray-200 bg-white">
				<div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
					<div className="flex items-center gap-3">
						<SafeImg src={logoPath} alt="MENTORIUM" className="h-8 md:h-9" fallbackClass="rounded" />
					</div>
					<nav className="space-x-6 text-sm font-medium">
						<button onClick={() => goHomeSection('ege')} className="hover:text-brandPurple">ЕГЭ</button>
						<button onClick={() => goHomeSection('oge')} className="hover:text-brandPurple">ОГЭ</button>
						<button onClick={() => goHomeSection('about')} className="hover:text-brandPurple">О нас</button>
						<button onClick={() => goHomeSection('reviews')} className="hover:text-brandPurple">Отзывы</button>
						<button onClick={() => goHomeSection('contacts')} className="hover:text-brandPurple">Контакты</button>
					</nav>
				</div>
				<div className="h-1 bg-gradient-to-r from-brandPurple to-brandBlue" />
			</header>
			<section className="py-20 text-center">
				<h2 className="text-3xl md:text-5xl font-display font-bold mb-4 gradient-text">Подготовка к ЕГЭ и ОГЭ</h2>
				<p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">Онлайн-школа MENTORIUM — учимся легко, эффективно и с результатом.</p>
				<button onClick={() => goHomeSection('ege')} className="btn-brand">Начать обучение</button>
			</section>
			<section id="targets" className="py-10 bg-gray-50 border-t border-gray-100">
				<div className="max-w-6xl mx-auto px-4">
					<h3 className="text-2xl md:text-3xl font-display font-semibold text-center">Ориентируем на поступление в топ‑вузы</h3>
					<div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 justify-items-center max-w-5xl mx-auto">
						{topUniImages.map((u) => (
							<div key={u.abbr} className="flex flex-col items-center">
								<div className="w-20 h-20 md:w-24 md:h-24 rounded-full ring-4 ring-white shadow overflow-hidden bg-gray-200">
										<SafeImg src={u.src} alt={u.name} title={u.name} className="w-full h-full object-cover" />
								</div>
								<div className="mt-3 text-xs sm:text-sm md:text-base text-gray-700 text-center leading-tight max-w-[11rem]">{u.name}</div>
							</div>
						))}
					</div>
				</div>
			</section>
			<section id="ege" className="py-16 border-t border-gray-100">
				<div className="max-w-6xl mx-auto px-4">
					<h3 className="text-2xl font-display font-bold mb-8">Курсы ЕГЭ</h3>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{['Математика', 'Русский язык', 'Физика'].map((subject) => (
							<div key={subject} className="border border-gray-200 rounded-xl p-6 hover:shadow-sm transition">
								<h4 className="text-lg font-display font-semibold mb-2">{subject}</h4>
								<p className="text-sm text-gray-600 mb-4">Подготовка к ЕГЭ по {subject.toLowerCase()} с опытными преподавателями.</p>
								<button onClick={() => { const s = findSlug('ege', subject) || 'math'; goRoute('ege', s); }} className="btn-brand text-sm">Подробнее</button>
							</div>
						))}
					</div>
				</div>
			</section>
			<section id="oge" className="py-16 border-t border-gray-100">
				<div className="max-w-6xl mx-auto px-4">
					<h3 className="text-2xl font-display font-bold mb-8">Курсы ОГЭ</h3>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{['Математика', 'Русский язык', 'Физика'].map((subject) => (
							<div key={subject} className="border border-gray-200 rounded-xl p-6 hover:shadow-sm transition">
								<h4 className="text-lg font-display font-semibold mb-2">{subject}</h4>
								<p className="text-sm text-gray-600 mb-4">Подготовка к ОГЭ по {subject.toLowerCase()} с нуля.</p>
								<button onClick={() => { const s = findSlug('oge', subject) || 'math'; goRoute('oge', s); }} className="btn-brand text-sm">Подробнее</button>
							</div>
						))}
					</div>
				</div>
			</section>
			<section id="about" className="py-16 border-t border-gray-100">
				<div className="max-w-3xl mx-auto px-4 text-center">
					<h3 className="text-2xl font-display font-bold mb-6">О нас</h3>
					<p className="text-base text-gray-600 max-w-3xl mx-auto">Мы — команда преподавателей, которые помогают школьникам достичь максимальных результатов. Современные материалы, интерактивные занятия и поддержка на каждом шаге.</p>
					<div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto text-left">
						<div className="border border-gray-200 rounded-2xl overflow-hidden">
							<SafeImg src="static/assets/images/photos/dmitriy.jpg" alt="Дмитрий — преподаватель" className="w-full h-56 md:h-64 object-cover img-bw" />
							<div className="p-6 md:p-8">
								<h4 className="text-xl md:text-2xl font-display font-semibold">Дмитрий</h4>
								<p className="text-base text-gray-700 mt-3 md:mt-4">Магистр, окончил МГТУ им. Н. Э. Баумана с красным дипломом. Научный сотрудник в ГК «Росатом». Специализируется на прикладной математике и подготовке к профильным экзаменам.</p>
							</div>
						</div>
						<div className="border border-gray-200 rounded-2xl overflow-hidden">
							<SafeImg src="static/assets/images/photos/ivan.jpg" alt="Иван — преподаватель" className="w-full h-56 md:h-64 object-cover img-bw" />
							<div className="p-6 md:p-8">
								<h4 className="text-xl md:text-2xl font-display font-semibold">Иван</h4>
								<p className="text-base text-gray-700 mt-3 md:mt-4">Магистр, окончил МГТУ им. Н. Э. Баумана. Работает научным сотрудником НИИ механики МГУ. Помогает уверенно закрывать пробелы и выходить на высокие баллы.</p>
							</div>
						</div>
					</div>
				</div>
			</section>
			<section id="reviews" className="py-16 border-t border-gray-100 bg-white">
				<div className="max-w-6xl mx-auto px-4">
					<h3 className="text-2xl font-display font-bold mb-8 text-center">Отзывы</h3>
					<div className="marquee" aria-label="Лента отзывов">
						<div className="marquee-track">
							{[...reviews, ...reviews].map((r, idx) => (
								<div key={idx} className="shrink-0 w-80 md:w-96 border border-gray-200 rounded-2xl p-6 bg-white shadow-sm">
									<div className="flex items-center gap-3 mb-3">
										<div className="w-10 h-10 rounded-full bg-gradient-to-r from-brandPurple to-brandBlue" />
										<div>
											<div className="font-medium">{r.name}</div>
											<div className="text-xs text-gray-500">{r.meta}</div>
										</div>
									</div>
									<p className="text-gray-700 text-sm">{r.text}</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>
			<section id="contacts" className="py-16 border-t border-gray-100">
				<div className="max-w-3xl mx-auto px-4 text-center">
					<h3 className="text-2xl font-display font-bold mb-6">Контакты</h3>
					<p className="text-base text-gray-600 mb-2">Напишите нам: mentorium.school@example.com</p>
					<p className="text-base text-gray-600">Телефон: +7 (900) 123-45-67</p>
					<div className="mt-8 flex flex-wrap justify-center gap-3">
						<a href="https://youtube.com/@mentorium" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-[#FF0000] bg-white text-[#FF0000] hover:bg-[#FF0000] hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF0000] transition text-sm"><span>YouTube</span></a>
						<a href="https://instagram.com/mentorium" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-[#E4405F] bg-white text-[#E4405F] hover:bg-[#E4405F] hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E4405F] transition text-sm"><span>Instagram</span></a>
						<a href="https://t.me/mentorium" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-[#26A5E4] bg-white text-[#26A5E4] hover:bg-[#26A5E4] hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#26A5E4] transition text-sm"><span>Telegram</span></a>
						<a href="https://vk.com/mentorium" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-[#0077FF] bg-white text-[#0077FF] hover:bg-[#0077FF] hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0077FF] transition text-sm"><span>VK</span></a>
						<a href="https://dzen.ru/mentorium" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-black bg-white text-black hover:bg-black hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition text-sm"><span>Яндекс Дзен</span></a>
					</div>
				</div>
			</section>
			<footer className="border-t border-gray-200 pt-0 text-center text-sm text-gray-500">
				<div className="h-1 bg-gradient-to-r from-brandPurple to-brandBlue" />
				<div className="py-6">© 2025 MENTORIUM. Все права защищены.</div>
			</footer>
		</div>
	);
}

// Вспомогательные компоненты модалок и тренажёра
function PdfModal({ activePdf, onClose }) {
	const ua = navigator.userAgent;
	const isIOS = /iPad|iPhone|iPod/.test(ua);
	const isAndroid = /Android/.test(ua);
	// iOS Safari плохо отображает PDF в <object>/<iframe> напрямую — используем gview
	const useGoogleViewer = isIOS; 
	const gviewUrl = `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(activePdf.src)}`;
	const directUrl = activePdf.src;
	const [showAdvice, setShowAdvice] = React.useState(false);
	useEffect(() => {
		const t = setTimeout(() => setShowAdvice(true), 5000);
		return () => clearTimeout(t);
	}, [activePdf.src]);
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
			<div className="relative bg-white w-[95vw] h-[90vh] max-w-6xl rounded-xl shadow-2xl overflow-hidden">
				<div className="flex items-center justify-between px-4 h-12 border-b">
					<div className="font-medium truncate pr-2">{activePdf.title}</div>
					<div className="flex items-center gap-2">
						<a className="text-sm font-medium text-brandPurple hover:underline" href={activePdf.src} target="_blank" rel="noreferrer">Открыть</a>
						<a className="text-sm font-medium text-brandPurple hover:underline" href={activePdf.src} download>Скачать</a>
						<button className="px-3 py-1.5 rounded-md border text-sm" onClick={onClose}>Закрыть</button>
					</div>
				</div>
				<div className="w-full h-[calc(90vh-3rem)] bg-gray-50">
					{/* Desktop */}
					{!isIOS && !isAndroid && (
						<object data={directUrl} type="application/pdf" className="w-full h-full">
							<div className="p-6 text-center text-gray-600">Не удалось встроить PDF. <a className="text-brandPurple hover:underline" href={directUrl} target="_blank" rel="noreferrer">Открыть в новой вкладке</a></div>
						</object>
					)}
					{/* Android Chrome обычно умеет рендерить PDF напрямую в <iframe> */}
					{isAndroid && !useGoogleViewer && (
						<iframe title="PDF" src={directUrl} className="w-full h-full" />
					)}
					{/* iOS fallback через Google Viewer */}
					{useGoogleViewer && (
						<iframe title="PDF" src={gviewUrl} className="w-full h-full" />
					)}
				</div>
				{(isAndroid || isIOS) && showAdvice && (
					<div className="absolute bottom-2 left-0 right-0 px-4 text-center text-xs text-gray-500">
						Если не отображается, нажмите «Открыть» — файл откроется в системном просмотрщике.
					</div>
				)}
			</div>
		</div>
	);
}

function SummaryModal({ selectedTask, choices, results, setShowSummary, setChoices, setResults, setChecked, setActiveHint, setQIndex }) {
	const items = ogeTrainerData[selectedTask];
	const total = items.length;
	const correctCnt = results.filter((r) => r === 'correct').length;
	const percent = Math.round((correctCnt / Math.max(total,1)) * 100);
	const letter = (i) => String.fromCharCode(65 + i);
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSummary(false)} />
			<div className="relative bg-white w-[95vw] max-w-3xl rounded-xl shadow-2xl overflow-hidden">
				<div className="flex items-center justify-between px-4 h-12 border-b">
					<div className="font-medium truncate pr-2">Сводка по заданию {selectedTask}</div>
					<div className="flex items-center gap-2">
						<button className="px-3 py-1.5 rounded-md border text-sm" onClick={() => setShowSummary(false)}>Закрыть</button>
					</div>
				</div>
				<div className="p-4">
					<div className="mb-4 flex items-center gap-4">
						<div className="text-lg font-semibold">Правильно: {correctCnt} / {total}</div>
						<div className="text-lg font-semibold text-brandPurple">{percent}%</div>
						<button className="ml-auto px-3 py-2 rounded-lg border text-sm" onClick={() => { setChoices([]); setResults([]); setChecked(false); setActiveHint(null); setQIndex(0); setShowSummary(false); }}>Пройти заново</button>
					</div>
					<div className="divide-y border rounded-xl overflow-hidden">
						{items.map((q, i) => {
							const state = results[i];
							const chosen = choices[i];
							const isCorrect = state === 'correct';
							return (
								<div key={i} className="p-3 flex items-start gap-3">
									<div className={`mt-1 w-3 h-3 rounded-full ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`} />
									<div className="flex-1">
										<div className="text-sm font-medium">Вопрос {i + 1}</div>
										<div className="mt-1 text-sm text-gray-700">Ваш ответ: {chosen != null ? letter(chosen) : '—'}</div>
										<div className="text-sm text-gray-700">Правильный ответ: {letter(q.correct)}</div>
									</div>
									<button className="px-2 py-1 rounded-md border text-xs" onClick={() => { setQIndex(i); setShowSummary(false); setChecked(false); setActiveHint(null); }}>Открыть вопрос</button>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}

function Trainer({ selectedTask, choices, setChoices, checked, setChecked, activeHint, setActiveHint, showMenu, setShowMenu, qIndex, setQIndex, results, setResults, showSummary, setShowSummary, hintsBtnRef, hintsMenuRef }) {
	const items = ogeTrainerData[selectedTask];
	const q = items[qIndex] || items[0];
	const selected = choices[qIndex];
	const isCorrect = selected === q.correct;
	const answeredCount = results.filter((r) => r === 'correct' || r === 'wrong').length;
	const allAnswered = answeredCount === items.length;
	return (
		<div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm relative">
			<div className="mb-4">
				<div className="flex items-center gap-2 flex-wrap">
					{items.map((_, i) => {
						const state = results[i];
						const isCurrent = i === qIndex;
						const base = 'w-8 h-8 rounded-full border text-xs font-medium flex items-center justify-center transition transform';
						const color = state === 'correct' ? 'bg-green-500 border-green-500 text-white' : state === 'wrong' ? 'bg-red-500 border-red-500 text-white' : 'bg-gray-100 border-gray-300 text-gray-700';
						const ring = isCurrent ? ' ring-2 ring-brandPurple scale-105' : '';
						return (
							<button key={i} className={`${base} ${color}${ring}`} title={`Вопрос ${i + 1}`} aria-current={isCurrent ? 'true' : 'false'} onClick={() => { setQIndex(i); setChecked(false); setActiveHint(null); setShowMenu(false); }}>{i + 1}</button>
						);
					})}
				</div>
				<div className="mt-2 text-xs text-gray-500">Выполнено: {answeredCount} из {items.length}</div>
			</div>
			<div className="flex items-center justify-between mb-3">
				<p className="text-gray-900 font-medium"><MathText text={q.question} /></p>
				<div className="text-xs text-gray-500">Вопрос {qIndex + 1} из {items.length}</div>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
				{q.options.map((opt, idx) => {
					const isActive = selected === idx;
					const afterCheckClass = checked ? (idx === q.correct ? 'border-green-500 bg-green-50' : (isActive ? 'border-red-500 bg-red-50' : 'border-gray-200')) : (isActive ? 'border-brandPurple text-gray-900 bg-white shadow-sm' : 'border-gray-200 hover:border-brandPurple/60');
					return (
						<label key={idx} className={`flex items-start gap-3 px-4 py-3 rounded-xl border cursor-pointer transition ${afterCheckClass}`}>
							<input type="checkbox" className="mt-1 h-4 w-4 rounded border-gray-300 text-brandPurple focus:ring-brandPurple" checked={isActive} onChange={() => { setChoices((prev) => { const next = [...prev]; next[qIndex] = isActive ? undefined : idx; return next; }); }} />
							<span className="flex-1"><MathText text={opt} /></span>
							{checked && idx === q.correct && <span className="ml-2 text-green-600 text-sm">✓</span>}
						</label>
					);
				})}
			</div>
			<div className="mt-4 flex flex-wrap items-center gap-3">
				<button className="btn-brand text-sm" onClick={() => { setChecked(true); setResults((prev) => { const r = [...prev]; r[qIndex] = isCorrect ? 'correct' : 'wrong'; return r; }); }} disabled={selected == null}>Проверить</button>
				<button className="px-3 py-2 rounded-lg border text-sm" onClick={() => { setChoices((prev) => { const n = [...prev]; n[qIndex] = undefined; return n; }); setChecked(false); setActiveHint(null); setResults((prev) => { const r = [...prev]; r[qIndex] = undefined; return r; }); }}>Сбросить</button>
				<div className="relative inline-block">
					<button ref={hintsBtnRef} className="px-3 py-2 rounded-lg border text-sm" onClick={() => setShowMenu((v) => !v)} aria-expanded={showMenu}>Подсказки</button>
					{showMenu && (
						<div ref={hintsMenuRef} className="absolute z-20 top-full mt-2 right-0 w-72 rounded-xl border border-gray-200 bg-white shadow-xl p-2">
							<div className="px-3 py-2 text-xs text-gray-500">Подсказки к задаче</div>
							{(Array.isArray(ogeTrainerData[selectedTask]) ? (ogeTrainerData[selectedTask][qIndex]?.hints || []) : []).map((h, i) => (
								<button key={i} className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-50 ${activeHint === i ? 'bg-gray-50' : ''}`} onClick={() => { setActiveHint(i); setShowMenu(false); }}><MathText text={h} /></button>
							))}
							<div className="mt-2 px-3 py-2"><button className="text-xs text-gray-500 hover:text-gray-700" onClick={() => setShowMenu(false)}>Закрыть</button></div>
						</div>
					)}
				</div>
				<div className="mt-3 sm:mt-0 ml-auto flex flex-col sm:flex-row w-full sm:w-auto items-stretch sm:items-center gap-2">
					<button className="px-3 py-2 rounded-lg border text-sm disabled:opacity-50 w-full sm:w-auto" onClick={() => { setChecked(false); setActiveHint(null); setShowMenu(false); setQIndex((i) => Math.max(0, i - 1)); }} disabled={qIndex === 0}>← Назад</button>
					<button className="px-3 py-2 rounded-lg border text-sm disabled:opacity-50 w-full sm:w-auto" onClick={() => { setChecked(false); setActiveHint(null); setShowMenu(false); setQIndex((i) => Math.min(items.length - 1, i + 1)); }} disabled={qIndex === items.length - 1}>Далее →</button>
					<button className={`px-3 py-2 rounded-lg border text-sm w-full sm:w-auto ${allAnswered ? 'border-green-600 text-green-700 hover:bg-green-50' : 'opacity-60 cursor-not-allowed'}`} onClick={() => allAnswered && setShowSummary(true)} disabled={!allAnswered}>Сводка</button>
				</div>
			</div>
			{checked && (
				<div className={`mt-3 text-sm ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>{isCorrect ? 'Верно! Отличная работа.' : 'Неверно. Попробуйте ещё раз или нажмите «Подсказки».'}</div>
			)}
			{activeHint != null && (
				<div className="mt-3 p-4 border border-brandPurple/30 bg-brandBlue/5 rounded-xl text-sm text-gray-800">
					<div className="font-medium mb-1">Подсказка:</div>
					<div><MathText text={(Array.isArray(ogeTrainerData[selectedTask]) ? (ogeTrainerData[selectedTask][qIndex]?.hints || []) : [])[activeHint]} /></div>
				</div>
			)}
		</div>
	);
}

// Рендер
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<MentoriumLanding />);
