import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ImExit } from 'react-icons/im';
import { declOfNum } from '../function/declofNum';
import { words } from '../data/words';
import { socket } from '../socket/socket';
import EmojiPicker from 'emoji-picker-react';
import Messages from './Messages';
import icon from '../images/emoji.svg';
import styles from '../styles/Chat.module.scss';

const Chat = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const [params, setParams] = useState({ room: '', name: '' });
  const [declination, setDeclination] = useState('участников');
  const [state, setState] = useState([]);
  const [message, setMessage] = useState('');
  const [isOpen, setOpen] = useState(false);
  const [users, setUsers] = useState(0);
  const inputRef = useRef(null);

  const handleChange = ({ target: { value } }) => setMessage(value);

  const onEmojiClick = ({ emoji }) => {
    setMessage(`${message} ${emoji}`);
    setOpen(false);
  };

  const leftRoom = () => {
    socket.emit('leftRoom', { params });
    navigate('/');
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (!message) return;
    socket.emit('sendMessage', { message, params });
    setMessage('');
  };

  useEffect(() => {
    const searchParams = Object.fromEntries(new URLSearchParams(search));
    setParams(searchParams);
    socket.emit('join', searchParams);
  }, [search]);

  useEffect(() => {
    socket.on('message', ({ data }) => {
      setState(s => [...s, data]);
    });

    inputRef.current.focus();
  }, []);

  useEffect(() => {
    socket.on('room', ({ data: { users } }) => {
      setDeclination(declOfNum(users.length, words));
      setUsers(users.length);
    });
  }, []);

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div className={styles.title}>
          <div className={styles.nameId}>
            ID:{' '}
            <span style={{ color: 'rgb(106, 246, 31)' }}>{params.room}</span>
          </div>
        </div>
        <div className={styles.users}>
          {users} {declination}
        </div>
        <button className={styles.left} onClick={leftRoom}>
          Выйти <ImExit />
        </button>
      </div>

      <div className={styles.messages}>
        <Messages messages={state} name={params.name} />
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.input}>
          <input
            type='text'
            name='message'
            placeholder='Введите сообщение...'
            value={message}
            onChange={handleChange}
            ref={inputRef}
            autoСomplete='off'
            required
          />
        </div>

        <div className={styles.emoji}>
          <img src={icon} alt='emoji list' onClick={() => setOpen(!isOpen)} />

          {isOpen && (
            <div className={styles.emojies}>
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}
        </div>

        <div className={styles.button}>
          <input type='submit' onSubmit={handleSubmit} value='Отправить' />
        </div>
      </form>
    </div>
  );
};

export default Chat;
