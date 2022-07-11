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
        // history.push(`/`)
      }
    })
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
        <button onClick={() => createUser()}> submit </button>
      </div>
    )
  }

  // 로그인
  const [loginEmail, setLoginEmail] = React.useState('')
  const [loginPassword, setLoginPassword] = React.useState('')
  // DB에서 받아온 user의 이름을 표시하기 위함.
  const [user, setUser] = React.useState('')

  const loginUser = async () => {
    await fetch(`/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: loginEmail,
        password: loginPassword,
      }),
    }).then((res) => {
      // post에서 body를 받아오는 방법?
      console.log(res.body)
      if (res.ok) {
        alert(`${res.body}님 환영합니다.`)
        // history.push(`/`)
      } else {
        alert('비밀번호가 잘못되었습니다.')
      }
    })
  }

  const login = () => {
    return (
      <div>
        {/* id */}
        <div>
          id
          <input
            placeholder="Input Email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
          ></input>
        </div>
        {/* password */}
        <div>
          password
          <input
            placeholder="Input Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            type="password"
          ></input>
        </div>
        {/* submit */}
        <button onClick={() => loginUser()}>submit</button>
      </div>
    )
  }

  //같은 브라우저 세션 내에서는 로그인 정보가 유지되야함. 쿠키에 액세스 토큰을 저장, JWT 사용
  //글 쓰고, 지우기 가능해야함.
  //로그인 정보 유지되게하기
  //전체 공개가 되는 방식으로 생각함
  //피드를 최신 순으로 나열
  const rounge = () => {
    return (
      <div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    )
  }

  return login()
}
