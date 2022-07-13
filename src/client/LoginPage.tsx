import React from 'react'
import { useNavigate } from 'react-router-dom'
import './styles.css'

// 로그인
const login = async (loginEmail: string, loginPassword: string) => {
  const res = await fetch(`/api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: loginEmail,
      password: loginPassword,
    }),
  })
  if (!res.ok) {
    return false
  }
  return res.ok
}

export default function LoginPage() {
  const [loginEmail, setLoginEmail] = React.useState('')
  const [loginPassword, setLoginPassword] = React.useState('')
  const [userCheck, setUserCheck] = React.useState(true)
  const navigate = useNavigate()

  return (
    <div className="wrap">
      {/* email */}
      <form
        id="login"
        onSubmit={async (e) => {
          e.preventDefault()
          const userCheck = await login(loginEmail, loginPassword)
          setUserCheck(userCheck)
          const res = await fetch(`/api/login/${loginEmail}`)
          const userName = await res.json()
          if (userCheck) {
            navigate('/feed', { state: { userName } })
          }
        }}
      >
        <input
          name="email"
          className="loginInput"
          placeholder="Email"
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
          type="email"
        />
        {/* password */}
        <input
          name="password"
          className="loginInput"
          placeholder="Password"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
          type="password"
        />
        <button
          className="loginInput"
          style={{
            backgroundColor: 'rgb(241,155,61)',
            color: 'white',
            padding: '0px',
            marginBottom: '0px',
            cursor: 'pointer',
          }}
          type="submit"
        >
          LOGIN
        </button>
      </form>
      {/* submit */}
      <div
        className="loginInput"
        style={{
          backgroundColor: 'white',
          color: 'black',
          padding: '0px',
          marginLeft: '100px',
        }}
      >
        <p>
          You don't have account? <a href="/registration">Register</a>
        </p>
        <p>{userCheck ? '' : '아이디/비밀번호를 다시 확인해주세요'}</p>
      </div>
    </div>
  )
}
