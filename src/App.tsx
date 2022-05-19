import React, { useState } from 'react';
import './App.scss';

import users from './api/users';
import todos from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';

const preparedTodos: Todo[] = todos.map((todo) => ({
  ...todo,
  user: users.find((customer) => (
    customer.id === todo.userId)) || null,
}));

const App: React.FC = () => {
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [todosToRender, setTodosToRenter] = useState(preparedTodos);
  const [errorName, setErrorName] = useState(false);
  const [errorTitle, setErrorTitle] = useState(false);

  const checkName = (nameField: string) => {
    if (nameField === '') {
      setErrorName(true);
    } else {
      setErrorName(false);
    }
  };

  const checkTitle = (titleField: string) => {
    if (titleField === '') {
      setErrorTitle(true);
    } else {
      setErrorTitle(false);
    }

    const exceptionSymbols = /[^A-Za-z0-9А-ЯЄІЇа-яєії\s]/gi;
    const correctededTitle = titleField.replace(exceptionSymbols, '');

    setTitle(correctededTitle);
  };

  const handleAdd = (titleField: string, nameField: string) => {
    checkName(nameField);
    checkTitle(titleField);

    if (titleField === '') {
      setErrorTitle(true);
    }

    if (titleField !== '' && nameField !== '') {
      const customer = users.find((user) => nameField === user.name) || null;

      setTodosToRenter([
        {
          userId: customer ? customer.id : 0,
          id: todosToRender[todosToRender.length - 1].id + 1,
          title: titleField.trim(),
          completed: false,
          user: customer,
        },
        ...todosToRender,
      ]);

      setTitle('');
      setName('');
    }
  };

  return (
    <div className="App">
      <h1 className="App__main-title">
        Add todo form
      </h1>
      <form
        method="post"
        name="selectTodo"
        className="App__form"
        onSubmit={(event) => {
          event.preventDefault();
          handleAdd(title, name);
        }}
      >
        <label className="App__label">
          <input
            className="App__input"
            name="title"
            type="text"
            placeholder="title"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              checkTitle(event.target.value);
            }}
          />
        </label>
        <p className="App__error">
          {errorTitle && ('Please enter the title')}
        </p>
        <select
          className="App__input App__input--select"
          name="name"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            checkName(event.target.value);
          }}
        >
          <option value="">
            Choose a user
          </option>
          {
            users.map((user) => (
              <option value={user.name}>
                {user.name}
              </option>
            ))
          }
        </select>

        <p className="App__error">
          {errorName && ('Please choose a user')}
        </p>

        <button
          className="App__button"
          type="submit"
        >
          Add
        </button>
      </form>
      <p>
        <span>Users: </span>
        {users.length}
      </p>
      <TodoList prepTodos={todosToRender} />
    </div>
  );
};

export default App;
