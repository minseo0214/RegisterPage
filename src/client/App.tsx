import React from 'react'
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom'
import './styles.css'

//CRUD (Create Read Update Delete)
//userId를 저장해서, 본인이 작성한 글만 지울 수 있도록 하려했습니다.
export default function App() {
  const [userId, setUserId] = React.useState<number>()

  // 회원 가입 페이지
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [checkPassword, setCheckPassword] = React.useState('')

  // 정상적인 이메일 포맷인지 확인
  const isEmail = (email: string) => {
    const emailRegex =
      /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i

    return emailRegex.test(email)
  }

  const isSamePassword = (password: string, checkPassword: string) => {
    return password === checkPassword
  }

  const isGoodPassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    return passwordRegex.test(password)
  }

  const createUser = async () => {
    /* 
    - 네 개를 다 채웠는지 확인해야할까
    - 이미 있는 이메일인지 확인해야할까
     */
    if (!(isEmail(email) && isSamePassword(password, checkPassword))) {
      alert('입력한 정보를 다시 확인해주세요')
      return
    }

    if (!isGoodPassword(password)) {
      alert(
        '최소 8자, 최소 하나의 문자 및 하나의 숫자의 비밀번호를 사용해주세요'
      )
      return
    }

    await fetch(`/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    }).then((res) => {
      if (res.ok) {
        alert('생성되었습니다.')
      }
    })
  }

  const RegistrationPage = () => {
    return (
      <div className="container">
        Welcome
        {/* username */}
        <div>
          username
          <input
            placeholder="Eneter username"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        {/* email */}
        <div>
          Email
          <input
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>
        {/* password */}
        <div>
          Password (최소 8자, 최소 하나의 문자 및 하나의 숫자의 비밀번호를
          사용해주세요)
          <input
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
        </div>
        {/* confirm password */}
        <div>
          Confirm Password
          <input
            placeholder="Enter password again"
            value={checkPassword}
            onChange={(e) => setCheckPassword(e.target.value)}
            type="password"
          />
        </div>
        <button onClick={() => createUser()}>submit</button>
      </div>
    )
  }

  // 로그인
  const [loginEmail, setLoginEmail] = React.useState('')
  const [loginPassword, setLoginPassword] = React.useState('')

  const login = () => {
    fetch(`/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: loginEmail,
        password: loginPassword,
      }),
    }).then((res) => {
      if (!res.ok) {
        alert('아이디나 비밀번호가 틀렸습니다')
      } else {
        const setUser = async () => {
          const res = await fetch(`/user/${loginEmail}`)
          const user_Id = await res.json()
          setUserId(user_Id.rows[0].id)
        }
        setUser()
      }
    })
  }

  // review: 컴포넌트로 쪼개 주세요.
  const LoginPage = () => {
    return (
      <div>
        {/* email */}
        <div>
          email
          <input
            placeholder="이메일을 입력해주세요."
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            type="email"
          />
        </div>
        {/* password */}
        <div>
          password
          <input
            placeholder="비밀번호를 입력해주세요."
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            type="password"
          />
        </div>
        {/* submit */}
        <button onClick={() => login()}>submit</button>
      </div>
    )
  }

  interface TextInfo {
    id: number
    user_id: number
    text: string
  }

  const [text, setText] = React.useState('')
  const [textList, setTextList] = React.useState<TextInfo[]>()

  const refetch = React.useCallback(async () => {
    const fetched = await fetch(`/chatting`)
    const data = await fetched.json()
    setTextList(data.rows)
  }, [])

  React.useEffect(() => {
    refetch()
  }, [refetch])

  // review: 컴포넌트로 쪼개 주세요.
  const TextBox = (text: TextInfo) => {
    return (
      <div className="textBox" key={text.id}>
        <div>{text.text}</div>
        <button
          className="button"
          onClick={() => {
            // review: 서버에서 권한을 판단해야 합니다.
            if (userId === text.user_id) {
              deleteText(text.id)
            }
          }}
        >
          delete
        </button>
      </div>
    )
  }

  // review: text, chatting 둘 중 하나로 통일해야 합니다.
  // review: user_id는 쿠키로 서버에서 검증하는 것이고 여기에서 받으면 안 됩니다.
  const createText = async (user_id: number, text: string) => {
    await fetch(`/chatting/${user_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
      }),
    })
    refetch()
  }

  const deleteText = async (id: number) => {
    await fetch(`/chatting/${id}`, {
      method: 'DELETE',
    })
    refetch()
  }

  // review: 컴포넌트로 쪼개 주세요.
  const ChattingPage = () => {
    return (
      <div>
        <div>Chatting</div>
        <div>
          <input
            placeholder="Input Text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={(e) => {
              if (e.key == 'Enter') {
                if (text !== '') {
                  createText(userId, text)
                  setText('')
                }
              }
            }}
          ></input>
        </div>
        <div className="chattingBox">
          {textList && textList.map((text: TextInfo) => TextBox(text))}
        </div>
      </div>
    )
  }
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
            <li>
              <Link to="/chatting">Chatting</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/chatting" element={<ChattingPage />} />
          <Route path="/register" element={<RegistrationPage />} />
        </Routes>
      </div>
    </Router>
  )
}
