import React from 'react'
import './styles.css'

//CRUD (Create Read Update Delete)
export default function App() {
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

  const createUser = async (id: number) => {
    // 네 개를 다 채웠는지 확인해야할까?
    // if (!(isEmail(email) && isSamePassword(password, checkPassword))) {
    //   alert('입력한 정보를 다시 확인해주세요')
    //   return
    // }

    // if (!isGoodPassword(password)) {
    //   alert(
    //     '최소 8자, 최소 하나의 문자 및 하나의 숫자의 비밀번호를 사용해주세요'
    //   )
    //   return
    // }

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
        // history.push(`/`)
      }
    })
    // post json으로 보내면 됨
  }

  const register = () => {
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
          ></input>
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
          ></input>
        </div>
        {/* confirm password */}
        <div>
          Confirm Password
          <input
            placeholder="Enter password again"
            value={checkPassword}
            onChange={(e) => setCheckPassword(e.target.value)}
            type="password"
          ></input>
        </div>
        <button onClick={() => createUser(1)}> submit </button>
      </div>
    )
  }

  const login = () => {
    return 'hello'
  }

  return register()
}

// 회원가입

// 로그인

// 글 쓰기
