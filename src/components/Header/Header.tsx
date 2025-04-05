/* eslint-disable no-console */

import { useContext, useEffect, useRef, useState } from 'react';
import { TodoContext } from '../../context/TodoContext';
import { ErrorMessageType } from '../../types/ErrorMessageType';
import { createTodo, getTodos, updateTodo, USER_ID } from '../../api/todos';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

export const Header = () => {
  const { todos, setTodos, setErrorType, setIsListLoading } =
    useContext(TodoContext);

  const [title, setTitle] = useState('');
  const titleInput = useRef<HTMLInputElement>(null);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const setAllTodosActive = async () => {
    setIsListLoading(true);

    try {
      if (todos) {
        const completedTodos = todos.filter(todo => todo.completed);

        if (completedTodos.length === 0) {
          return;
        }

        await Promise.all(
          completedTodos.map(todo => updateTodo({ ...todo, completed: false })),
        );

        const updatedTodos = await getTodos();

        if (updatedTodos) {
          setTodos(updatedTodos);
        }
      }
    } catch (error) {
      setErrorType(ErrorMessageType.Update);
    } finally {
      setIsListLoading(false);
    }
  };

  const handleOnSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorType(ErrorMessageType.Title);

      return;
    }

    try {
      const newTodo: Omit<Todo, 'id'> = {
        userId: USER_ID,
        title: title.trim(),
        completed: false,
      };

      const response = await createTodo(newTodo);

      if (response) {
        const currentTodos = todos || [];

        setTodos([...currentTodos, response]);
        setTitle('');
      }
    } catch (error) {
      setErrorType(ErrorMessageType.Add);
    }
  };

  const isAllTodosCompleted = todos && todos?.every(todo => todo.completed);

  useEffect(() => {
    if (titleInput?.current) {
      titleInput.current.focus();
    }
  }, []);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: isAllTodosCompleted,
        })}
        data-cy="ToggleAllButton"
        onClick={setAllTodosActive}
      />

      <form onSubmit={handleOnSubmit}>
        <input
          ref={titleInput}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleOnChange}
        />
      </form>
    </header>
  );
};
