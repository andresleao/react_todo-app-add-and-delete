import React, { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { Todo } from '../types/Todo';
import { ErrorMessageType } from '../types/ErrorMessageType';
import { TodoFilterType } from '../types/TodoFilterType';

type TodoContextType = {
  todos: Todo[] | null;
  setTodos: (todos: Todo[]) => void;
  errorType: ErrorMessageType | null;
  setErrorType: (error: ErrorMessageType | null) => void;
  selectedFilter: TodoFilterType;
  setSelectedFilter: (filterType: TodoFilterType) => void;
  isListLoading: boolean;
  setIsListLoading: (isLoading: boolean) => void;
  deletingIds: number[];
  setDeletingIds: Dispatch<SetStateAction<number[]>>;
};

export const TodoContext = React.createContext<TodoContextType>({
  todos: null,
  setTodos: () => {},
  errorType: null,
  setErrorType: () => {},
  selectedFilter: TodoFilterType.All,
  setSelectedFilter: () => {},
  isListLoading: false,
  setIsListLoading: () => {},
  deletingIds: [],
  setDeletingIds: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[] | null>(null);
  const [errorType, setErrorType] = useState<ErrorMessageType | null>(null);
  const [selectedFilter, setSelectedFilter] = useState(TodoFilterType.All);
  const [isListLoading, setIsListLoading] = useState(false);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  const value = useMemo(
    () => ({
      todos,
      setTodos,
      errorType,
      setErrorType,
      selectedFilter,
      setSelectedFilter,
      isListLoading,
      setIsListLoading,
      deletingIds,
      setDeletingIds,
    }),
    [todos, errorType, selectedFilter, isListLoading, deletingIds],
  );

  // prettier-ignore
  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};
