import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Main.module.scss';

const Main = () => {
  const [values, setValues] = useState({
    name: '',
    room: '',
  });

  const handleChange = e => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleClick = e => {
    const isDisabled = Object.values(values).some(v => !v);
    if (isDisabled) e.preventDefault();
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.container}>
        <h1 className={styles.heading}>SK</h1>

        <form className={styles.form}>
          <div className={styles.group}>
            <input
              type='text'
              name='name'
              value={values.name}
              placeholder='Введите имя'
              className={styles.input}
              onChange={handleChange}
              autoComplete='off'
              required
            />
          </div>
          <div className={styles.group}>
            <input
              type='text'
              name='room'
              placeholder='Введите id комнаты'
              value={values.room}
              className={styles.input}
              onChange={handleChange}
              autoComplete='off'
              required
            />
          </div>

          <Link
            className={styles.group}
            onClick={handleClick}
            to={`/chat?name=${values.name}&room=${values.room}`}
          >
            <button type='submit' className={styles.button}>
              Подключиться
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Main;
