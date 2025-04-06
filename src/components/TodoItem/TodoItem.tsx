/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable no-console */
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { useContext, useEffect, useRef, useState } from 'react';
import { TodoContext } from '../../context/TodoContext';
import { deleteTodo, updateTodo, USER_ID } from '../../api/todos';
import { ErrorMessageType } from '../../types/ErrorMessageType';

type TodoItemProps = {
  todo: Todo;
  isCreating?: boolean;
};

export const TodoItem = ({ todo, isCreating = false }: TodoItemProps) => {
  const {
    setErrorType,
    todos,
    setTodos,
    isListLoading,
    deletingIds,
    setDeletingIds,
  } = useContext(TodoContext);

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const editFormRef = useRef<HTMLInputElement>(null);

  const isDeleting = deletingIds.includes(todo.id);

  const handleEditTodo = () => {
    setIsEditing(true);
    setTitle(todo.title);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleOnTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleOnCheckTodo = async () => {
    const updatedTodo: Todo = {
      ...todo,
      completed: !todo.completed,
    };

    try {
      setIsLoading(true);
      const response = await updateTodo(updatedTodo);

      if (response) {
        const updatedList = todos.map(todoItem =>
          todoItem.id === response.id ? response : todoItem,
        );

        setTodos(updatedList);

        // Updating with API
        // const updatedList = await getTodos();
        // setTodos(updatedList);
      }
    } catch (error) {
      setErrorType(ErrorMessageType.Update);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    try {
      setDeletingIds((prev: number[]) => [...prev, todoId]);
      const response = await deleteTodo(todoId);

      if (response) {
        setTodos([...todos].filter(todoItem => todoItem.id !== todoId));

        // Updating with API
        // const data = await getTodos();
        // setTodos([...data]);
      }
    } catch (error) {
      setErrorType(ErrorMessageType.Delete);
    } finally {
      setDeletingIds(prev => prev.filter(id => id !== todoId));
    }
  };

  const handleOnSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const updatedTodo: Todo = {
      id: todo.id,
      completed: todo.completed,
      title: title,
      userId: USER_ID,
    };

    try {
      setIsLoading(true);
      const response = await updateTodo(updatedTodo);

      if (response) {
        const updatedTodos = todos.map(todoItem =>
          todoItem.id === response.id ? response : todoItem,
        );

        setTodos(updatedTodos);
        editFormRef.current?.blur();
        setIsEditing(false);
        // try {
        //   const updatedList = await getTodos();
        //   if (updatedList) {
        //     setTodos([...updatedList]);
        //     editFormRef.current?.blur();
        //     setIsEditing(false);
        //   }
        // } catch (error) {
        //   setErrorType(ErrorMessageType.Loading);
        // } finally {
        //   setIsLoading(false);
        // }
      }
    } catch (error) {
      setErrorType(ErrorMessageType.Update);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isEditing) {
      editFormRef.current?.focus();
    }
  }, [isEditing]);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
      onDoubleClick={handleEditTodo}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleOnCheckTodo}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleOnSubmit}>
          <input
            ref={editFormRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            onChange={handleOnTitleChange}
            onBlur={handleBlur}
          />
        </form>
      ) : (
        <span data-cy="TodoTitle" className="todo__title">
          {todo.title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => handleDeleteTodo(todo.id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isCreating || isLoading || isListLoading || isDeleting,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
