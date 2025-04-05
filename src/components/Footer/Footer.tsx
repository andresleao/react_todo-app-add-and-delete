import { useContext } from 'react';
import { TodoContext } from '../../context/TodoContext';
import { TodoFilterType } from '../../types/TodoFilterType';
import cn from 'classnames';
import { deleteTodo } from '../../api/todos';
import { ErrorMessageType } from '../../types/ErrorMessageType';

export const Footer = () => {
  const { selectedFilter, setSelectedFilter, setDeletingIds } =
    useContext(TodoContext);
  const { todos, setTodos, setErrorType } = useContext(TodoContext);

  if ((todos && todos.length === 0) || todos === null) {
    return null;
  }

  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  const hasCompletedTodo = todos.some(todo => todo.completed);

  const handleDeleteCompletedTodos = async () => {
    if (!todos) {
      return;
    }

    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    const completedIds = completedTodos.map(todo => todo.id);

    try {
      setDeletingIds(completedIds);
      await Promise.all(completedTodos.map(todo => deleteTodo(todo.id)));
      const newList = todos.filter(todo => !completedIds.includes(todo.id));

      setTodos(newList);

      // LIST UPDATE WITH API
      // const newList = await getTodos();
      //setTodos(newList);
    } catch (error) {
      setErrorType(ErrorMessageType.Delete);
    } finally {
      setDeletingIds([]);
    }
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: selectedFilter === TodoFilterType.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setSelectedFilter(TodoFilterType.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: selectedFilter === TodoFilterType.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setSelectedFilter(TodoFilterType.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: selectedFilter === TodoFilterType.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setSelectedFilter(TodoFilterType.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodo}
        onClick={handleDeleteCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
