import { useEffect, useState } from 'react';
import api from '../api.js';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);

  const loadTasks = async () => {
    const { data } = await api.get('/tasks');
    setTasks(data.tasks);
    setLoading(false);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const { data } = await api.post('/tasks', { title });
    setTasks([data, ...tasks]);
    setTitle('');
  };

  const toggleStatus = async (task) => {
    const status = task.status === 'pending' ? 'done' : 'pending';
    await api.patch(`/tasks/${task.id}`, { status });
    setTasks(tasks.map((t) => (t.id === task.id ? { ...t, status } : t)));
  };

  const removeTask = async (id) => {
    await api.delete(`/tasks/${id}`);
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const doneCount = tasks.filter((t) => t.status === 'done').length;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold text-ink">Your tasks</h1>
      <p className="mt-1 text-sm text-slate-500">
        {tasks.length === 0
          ? 'Nothing yet — add your first task below.'
          : `${doneCount} of ${tasks.length} done`}
      </p>

      <form onSubmit={addTask} className="mt-6 flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Set up GitHub Actions"
          className="flex-1 rounded-lg border border-slate-200 px-3 py-2.5 focus:border-signal-500 focus:outline-none focus:ring-2 focus:ring-signal-100"
        />
        <button className="rounded-lg bg-signal-600 px-4 py-2.5 font-medium text-white transition hover:bg-signal-700">
          Add
        </button>
      </form>

      <ul className="mt-6 space-y-2">
        {loading && <p className="text-sm text-slate-400">Loading tasks…</p>}
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm shadow-signal-50"
          >
            <button onClick={() => toggleStatus(task)} className="flex items-center gap-3 text-left">
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full border-2 text-xs ${
                  task.status === 'done'
                    ? 'border-signal-600 bg-signal-600 text-white'
                    : 'border-slate-300'
                }`}
              >
                {task.status === 'done' ? '✓' : ''}
              </span>
              <span className={task.status === 'done' ? 'text-slate-400 line-through' : 'text-ink'}>
                {task.title}
              </span>
            </button>
            <button
              onClick={() => removeTask(task.id)}
              className="text-xs font-medium text-slate-400 hover:text-ember"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
