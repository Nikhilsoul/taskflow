import { useEffect, useState } from 'react';
import api from '../api.js';

export default function Admin() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/tasks/admin/all').then(({ data }) => {
      setTasks(data.tasks);
      setLoading(false);
    });
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold text-ink">Admin overview</h1>
      <p className="mt-1 text-sm text-slate-500">Every task, across every account — visible to admins only.</p>

      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm shadow-signal-50">
        <table className="w-full text-left text-sm">
          <thead className="bg-signal-50 text-signal-700">
            <tr>
              <th className="px-4 py-3 font-medium">Task</th>
              <th className="px-4 py-3 font-medium">Owner</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td className="px-4 py-3 text-slate-400" colSpan={3}>
                  Loading…
                </td>
              </tr>
            )}
            {!loading && tasks.length === 0 && (
              <tr>
                <td className="px-4 py-3 text-slate-400" colSpan={3}>
                  No tasks have been created yet.
                </td>
              </tr>
            )}
            {tasks.map((task) => (
              <tr key={task.id} className="border-t border-slate-100">
                <td className="px-4 py-3 text-ink">{task.title}</td>
                <td className="px-4 py-3 text-slate-500">{task.name} ({task.email})</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      task.status === 'done'
                        ? 'bg-signal-50 text-signal-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {task.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
